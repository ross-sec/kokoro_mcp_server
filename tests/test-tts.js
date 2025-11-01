#!/usr/bin/env node

/**
 * Test script for Kokoro TTS MCP Server
 * Tests the text-to-speech functionality and shows the response structure
 */

import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_TEXT = "Hello Andre, our packag work okay";
const SERVER_PATH = join(__dirname, "..", "dist", "index.js");

async function sendMCPRequest(mcpProcess, method, params) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const request = {
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    };

    const requestStr = JSON.stringify(request) + "\n";
    
    console.log("\n📤 Sending request:");
    console.log(JSON.stringify(request, null, 2));

    const responseHandler = (data) => {
      stdout += data.toString();
      
      // Try to parse the response
      const lines = stdout.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            // Only process responses with matching ID
            if (response.id === request.id) {
              console.log("\n📥 Received response:");
              console.log(JSON.stringify(response, null, 2));
              
              if (response.result) {
                console.log("\n✅ Response result structure:");
                console.log("  - content array length:", response.result.content?.length);
                if (response.result.content) {
                  response.result.content.forEach((item, idx) => {
                    console.log(`  - content[${idx}]:`, {
                      type: item.type,
                      hasText: !!item.text,
                      textLength: item.text?.length,
                      hasResource: !!item.resource,
                      hasData: !!item.data,
                    });
                  });
                }
                mcpProcess.stdout.removeListener("data", responseHandler);
                resolve(response);
                return;
              } else if (response.error) {
                console.log("\n❌ Error received:");
                console.log(JSON.stringify(response.error, null, 2));
                mcpProcess.stdout.removeListener("data", responseHandler);
                reject(response.error);
                return;
              }
            }
          } catch (e) {
            // Not JSON, continue
          }
        }
      }
    };

    mcpProcess.stdout.on("data", responseHandler);

    mcpProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    mcpProcess.stdin.write(requestStr);

    // Timeout after 120 seconds (model initialization can take time)
    setTimeout(() => {
      reject(new Error("Request timeout"));
    }, 120000);
  });
}

async function testTTS() {
  console.log("🧪 Starting Kokoro TTS MCP Server Test");
  console.log("=" .repeat(60));
  console.log(`Test text: "${TEST_TEXT}"`);
  console.log("=" .repeat(60));

  // Start the MCP server
  const mcpServer = spawn("node", [SERVER_PATH], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  console.log("\n🚀 MCP Server started (PID:", mcpServer.pid + ")");

  mcpServer.on("error", (error) => {
    console.error("❌ Server error:", error);
    process.exit(1);
  });

  mcpServer.on("exit", (code) => {
    console.log(`\n🏁 Server exited with code: ${code}`);
  });

  // Wait a bit for server to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // First, initialize the connection
    console.log("\n📡 Step 1: Initializing MCP connection...");
    await sendMCPRequest(mcpServer, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0",
      },
    });

    // Send initialized notification
    console.log("\n📡 Step 2: Sending initialized notification...");
    const initNotif = {
      jsonrpc: "2.0",
      method: "notifications/initialized",
    };
    mcpServer.stdin.write(JSON.stringify(initNotif) + "\n");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // List available tools
    console.log("\n📡 Step 3: Listing available tools...");
    await sendMCPRequest(mcpServer, "tools/list", {});

    // Call the text_to_speech tool
    console.log("\n📡 Step 4: Calling text_to_speech tool...");
    const result = await sendMCPRequest(mcpServer, "tools/call", {
      name: "text_to_speech",
      arguments: {
        text: TEST_TEXT,
        voice: "af_heart",
        speed: 1.0,
      },
    });

    console.log("\n✅ Test completed successfully!");
    
    // Extract audio data if present
    if (result?.result?.content) {
      for (let idx = 0; idx < result.result.content.length; idx++) {
        const item = result.result.content[idx];
        if (item.type === "text" && item.text?.includes("data:audio/wav;base64,")) {
          const base64Match = item.text.match(/data:audio\/wav;base64,([A-Za-z0-9+/=]+)/);
          if (base64Match) {
            const audioBase64 = base64Match[1];
            console.log(`\n🎵 Found audio data in content[${idx}], length: ${audioBase64.length} characters`);
            console.log(`   First 50 chars: ${audioBase64.substring(0, 50)}...`);
            
            // Try to save the audio
            const audioBuffer = Buffer.from(audioBase64, "base64");
            const outputFile = join(__dirname, `test-output-${Date.now()}.wav`);
            await writeFile(outputFile, audioBuffer);
            console.log(`\n💾 Audio saved to: ${outputFile}`);
            console.log(`   File size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
            
            // Try to play audio on Linux/WSL
            console.log(`\n🔊 Attempting to play audio...`);
            
            // Try different audio players (WSL/Ubuntu compatible)
            const players = [
              { cmd: "aplay", args: [outputFile] },  // ALSA (most common on Linux)
              { cmd: "paplay", args: [outputFile] },  // PulseAudio
              { cmd: "pw-play", args: [outputFile] }, // PipeWire
              { cmd: "ffplay", args: ["-nodisp", "-autoexit", outputFile] }, // FFmpeg
            ];
            
            let played = false;
            for (const player of players) {
              try {
                const { exec } = await import("child_process");
                const { promisify } = await import("util");
                const execAsync = promisify(exec);
                await execAsync(`${player.cmd} ${player.args.join(" ")}`);
                console.log(`✅ Audio played successfully using ${player.cmd}`);
                played = true;
                break;
              } catch (err) {
                // Try next player
              }
            }
            
            if (!played) {
              console.log(`\n⚠️  Could not auto-play audio (WSL typically doesn't have direct audio)`);
              console.log(`\n📋 To hear the audio:`);
              
              // Try to copy to Windows
              const windowsUser = process.env.USERNAME || process.env.USER;
              const windowsDesktop = `/mnt/c/Users/${windowsUser}/Desktop/`;
              
              try {
                const { execSync } = await import("child_process");
                const winFileName = `kokoro-tts-${Date.now()}.wav`;
                const winPath = join(windowsDesktop, winFileName);
                execSync(`cp "${outputFile}" "${winPath}" 2>/dev/null || cp "${outputFile}" "/mnt/c/Users/${windowsUser}/Desktop/${winFileName}"`);
                console.log(`\n✅ Audio copied to Windows Desktop: ${winPath}`);
                console.log(`   → Double-click the file in Windows to play it!`);
                console.log(`   → Or run: start "${winPath.replace(/\//g, "\\")}"`);
              } catch (err) {
                console.log(`\n   1. Copy the file to Windows Desktop:`);
                console.log(`      cp "${outputFile}" "${windowsDesktop}"`);
                console.log(`   2. Or access it from Windows at:`);
                console.log(`      \\\\wsl$\\Ubuntu\\home\\ross\\kokoro_tts\\tests\\${outputFile.split("/").pop()}`);
              }
              
              console.log(`\n   3. Install WSL audio support (optional):`);
              console.log(`      - Windows: Install "WSL Audio" from Microsoft Store`);
              console.log(`      - Or: sudo apt install alsa-utils pulseaudio`);
              console.log(`\n📍 WSL file location: ${outputFile}`);
            }
          }
        }
      }
    }

    // Clean shutdown
    mcpServer.stdin.end();
    await new Promise((resolve) => setTimeout(resolve, 500));
    mcpServer.kill();
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    mcpServer.kill();
    process.exit(1);
  }
}

testTTS().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

