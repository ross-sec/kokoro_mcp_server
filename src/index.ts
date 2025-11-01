#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { KokoroTTS } from "kokoro-js";
import { readFile, unlink, writeFile } from "fs/promises";
import { existsSync, copyFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import express from "express";
import { createServer } from "http";

const execAsync = promisify(exec);

// Default female voice - using 'af_heart' as shown in Kokoro examples
const DEFAULT_FEMALE_VOICE = "af_heart";
const DEFAULT_SPEED = 1.0;
const DEFAULT_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

interface KokoroOptions {
  text: string;
  voice?: string;
  speed?: number;
}

class KokoroTTSWrapper {
  private tts: KokoroTTS | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized && this.tts) {
      return;
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.error("[Kokoro TTS] Initializing Kokoro TTS model...");
      }
      this.tts = await KokoroTTS.from_pretrained(DEFAULT_MODEL_ID, {
        dtype: "q8", // Quantized 8-bit for better performance
        device: "cpu", // Use CPU for Node.js
      });
      this.initialized = true;
      if (process.env.NODE_ENV === "development") {
        console.error("[Kokoro TTS] Model initialized successfully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[Kokoro TTS] Initialization failed: ${errorMessage}`);
      throw new Error(`Failed to initialize Kokoro TTS: ${errorMessage}`);
    }
  }

  async generate(options: KokoroOptions): Promise<Buffer> {
    if (!this.tts || !this.initialized) {
      await this.initialize();
    }

    if (!this.tts) {
      throw new Error("Kokoro TTS not initialized");
    }

    const { text, voice = DEFAULT_FEMALE_VOICE, speed = DEFAULT_SPEED } =
      options;

    try {
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[Kokoro TTS] Generating speech with voice: ${voice}, speed: ${speed}`
        );
      }

      // Generate audio using kokoro-js
      const rawAudio = await this.tts.generate(text, {
        voice: voice as any, // Type assertion for voice selection
        speed,
      });

      // Save to temporary file and read as buffer
      // RawAudio has a save() method that writes WAV format
      const tempFile = join(tmpdir(), `kokoro-${randomUUID()}.wav`);
      
      // Save the audio to a temporary file
      await rawAudio.save(tempFile);

      // Read the WAV file as a buffer
      const audioBuffer = await readFile(tempFile);

      // Clean up temporary file
      try {
        await unlink(tempFile);
      } catch {
        // Ignore cleanup errors
      }

      return audioBuffer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[Kokoro TTS] Generation failed: ${errorMessage}`);
      throw new Error(`Failed to generate speech: ${errorMessage}`);
    }
  }
}

/**
 * Save audio buffer to file and attempt to play it
 */
async function saveAndPlayAudio(audioBuffer: Buffer): Promise<string> {
  const timestamp = Date.now();
  const fileName = `kokoro-tts-${timestamp}.wav`;
  
  // Try to save to Windows Desktop if in WSL, otherwise use temp directory
  let outputPath: string;
  const windowsUser = process.env.USERNAME || process.env.USER;
  const windowsDesktop = `/mnt/c/Users/${windowsUser}/Desktop/`;
  
  try {
    // Check if Windows Desktop path exists (WSL scenario)
    if (existsSync(windowsDesktop)) {
      outputPath = join(windowsDesktop, fileName);
    } else {
      // Fallback to temp directory
      outputPath = join(tmpdir(), fileName);
    }
  } catch {
    // Fallback to temp directory
    outputPath = join(tmpdir(), fileName);
  }
  
  // Save the audio file
  await writeFile(outputPath, audioBuffer);
  
  // Try to play audio using available players
  const players = [
    { cmd: "aplay", args: [outputPath] },  // ALSA (most common on Linux)
    { cmd: "paplay", args: [outputPath] },  // PulseAudio
    { cmd: "pw-play", args: [outputPath] }, // PipeWire
    { cmd: "ffplay", args: ["-nodisp", "-autoexit", outputPath] }, // FFmpeg
    // Windows WSL audio (if available)
    { cmd: "powershell.exe", args: ["-Command", `(New-Object Media.SoundPlayer '${outputPath.replace(/\//g, "\\")}').PlaySync()`] },
  ];
  
  let played = false;
  for (const player of players) {
    try {
      await execAsync(`${player.cmd} ${player.args.join(" ")}`);
      console.error(`[Kokoro TTS] Audio played successfully using ${player.cmd}`);
      played = true;
      break;
    } catch (err) {
      // Try next player
      continue;
    }
  }
  
  if (!played) {
    // Copy to Windows Desktop if we saved to temp and Windows Desktop exists
    if (!outputPath.startsWith("/mnt/c/")) {
      try {
        if (existsSync(windowsDesktop)) {
          const winPath = join(windowsDesktop, fileName);
          copyFileSync(outputPath, winPath);
          console.error(`[Kokoro TTS] Audio copied to Windows Desktop: ${winPath}`);
          outputPath = winPath;
        }
      } catch (err) {
        // Ignore copy errors
      }
    }
    
    console.error(`[Kokoro TTS] Could not auto-play audio. File saved to: ${outputPath}`);
    if (outputPath.startsWith("/mnt/c/")) {
      console.error(`[Kokoro TTS] You can play it from Windows: ${outputPath.replace(/\//g, "\\")}`);
    }
  }
  
  return outputPath;
}

class KokoroMCPServer {
  private server: Server;
  private tts: KokoroTTSWrapper;
  private listToolsHandler?: (request: any) => Promise<any>;
  private callToolHandler?: (request: any) => Promise<any>;

  constructor() {
    this.server = new Server(
      {
        name: "kokoro-tts-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tts = new KokoroTTSWrapper();
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.listToolsHandler = async () => {
      return {
        tools: [
          {
            name: "text_to_speech",
            description:
              "Convert text to speech using Kokoro TTS model with female voice (af_heart by default)",
            inputSchema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description: "The text to convert to speech",
                },
                voice: {
                  type: "string",
                  description:
                    "Voice ID to use (default: af_heart). Other female voices: af_bella, af_sarah, etc.",
                  default: DEFAULT_FEMALE_VOICE,
                },
                speed: {
                  type: "number",
                  description: "Speech speed multiplier (default: 1.0)",
                  default: DEFAULT_SPEED,
                },
              },
              required: ["text"],
            },
          },
        ],
      };
    };
    this.server.setRequestHandler(ListToolsRequestSchema, this.listToolsHandler);

    // Handle tool calls
    this.callToolHandler = async (request: any) => {
      const { name, arguments: args } = request.params;

      if (name === "text_to_speech") {
        try {
          const text = args?.text as string;
          const voice = (args?.voice as string) || DEFAULT_FEMALE_VOICE;
          const speed = (args?.speed as number) || DEFAULT_SPEED;

          if (!text) {
            throw new Error("Text parameter is required");
          }

          // Log to stderr (won't interfere with MCP stdio protocol)
          if (process.env.NODE_ENV === "development") {
            console.error(`[Kokoro TTS] Generating speech for: "${text.substring(0, 50)}..."`);
            console.error(`[Kokoro TTS] Voice: ${voice}, Speed: ${speed}`);
          }

          const audioBuffer = await this.tts.generate({
            text,
            voice,
            speed,
          });

          // Save and attempt to play the audio
          let filePath: string;
          let playbackMessage = "";
          try {
            filePath = await saveAndPlayAudio(audioBuffer);
            playbackMessage = `\nAudio file saved and playback attempted: ${filePath}`;
          } catch (playbackError) {
            // Continue even if playback fails - still return the audio data
            filePath = "Failed to save/play audio";
            playbackMessage = `\nNote: Audio playback failed, but audio data is available below.`;
            console.error(`[Kokoro TTS] Playback error: ${playbackError}`);
          }

          // Return base64 encoded audio
          const base64Audio = audioBuffer.toString("base64");

          // Return just the text content with audio data URI
          return {
            content: [
              {
                type: "text",
                text: `Successfully generated speech audio (${audioBuffer.length} bytes).${playbackMessage}\n\nAudio data URI: data:audio/wav;base64,${base64Audio}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(`[Kokoro TTS] Error: ${errorMessage}`);
          return {
            content: [
              {
                type: "text",
                text: `Error generating speech: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    };
    this.server.setRequestHandler(CallToolRequestSchema, this.callToolHandler);
  }

    async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // Log to stderr to avoid interfering with MCP stdio protocol
    if (process.env.NODE_ENV === "development") {
      console.error("Kokoro TTS MCP Server running on stdio");
    }
  }

  async runSSE(port: number = 3000) {
    const app = express();
    app.use(express.json());

    // SSE endpoint for MCP over HTTP
    app.get("/sse", (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      // Send initial connection event
      res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

      // Handle client disconnect
      req.on("close", () => {
        console.error("[SSE] Client disconnected");
        res.end();
      });
    });

    // MCP endpoint for tool calls
    app.post("/mcp", async (req: express.Request, res: express.Response) => {
      try {
        const { jsonrpc, method, params, id } = req.body;

        if (jsonrpc !== "2.0") {
          return res.status(400).json({
            jsonrpc: "2.0",
            id,
            error: { code: -32600, message: "Invalid Request" },
          });
        }

        if (method === "tools/list") {
          // Call the list tools handler directly
          if (!this.listToolsHandler) {
            throw new Error("ListTools handler not found");
          }
          const result = await this.listToolsHandler({
            jsonrpc: "2.0",
            id: id || 1,
            method: "tools/list",
          } as any);
          res.json({ jsonrpc: "2.0", id, result });
        } else if (method === "tools/call") {
          // Call the tool call handler directly
          if (!this.callToolHandler) {
            throw new Error("CallTool handler not found");
          }
          const result = await this.callToolHandler({
            jsonrpc: "2.0",
            id: id || 1,
            method: "tools/call",
            params,
          } as any);
          res.json({ jsonrpc: "2.0", id, result });
        } else {
          res.status(400).json({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: "Method not found" },
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`[SSE] Error handling request: ${errorMessage}`);
        res.status(500).json({
          jsonrpc: "2.0",
          id: req.body.id,
          error: { code: -32603, message: errorMessage },
        });
      }
    });

    const httpServer = createServer(app);
    httpServer.listen(port, () => {
      console.error(`Kokoro TTS MCP Server running on HTTP/SSE at http://localhost:${port}`);
      console.error(`  - SSE endpoint: http://localhost:${port}/sse`);
      console.error(`  - MCP endpoint: http://localhost:${port}/mcp`);
    });
  }
}

// Parse command line arguments and start server
const args = process.argv.slice(2);
const useSSE = args.includes("--sse") || args.includes("--http");
const port = parseInt(
  args.find((arg) => arg.startsWith("--port="))?.split("=")[1] || "3000",
  10
);

const server = new KokoroMCPServer();

if (useSSE) {
  server.runSSE(port).catch(console.error);
} else {
  server.run().catch(console.error);
}
