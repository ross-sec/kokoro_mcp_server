#!/usr/bin/env node

/**
 * System-wide MCP server wrapper for Kokoro TTS
 * This script can be used from anywhere once installed
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawn } from "child_process";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project root directory (two levels up from bin/)
const projectRoot = join(__dirname, "..");
const serverScript = join(projectRoot, "dist", "index.js");

// Check if running from npm package or development
const distExists = existsSync(serverScript);

if (!distExists) {
  console.error(`Error: Could not find server at ${serverScript}`);
  console.error(`Please run 'npm run build' first, or install the package globally.`);
  process.exit(1);
}

// Spawn the actual server with all arguments
const server = spawn("node", [serverScript, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: projectRoot,
});

server.on("error", (error) => {
  console.error(`Failed to start Kokoro TTS MCP server: ${error.message}`);
  process.exit(1);
});

server.on("exit", (code) => {
  process.exit(code || 0);
});

// Forward signals
process.on("SIGINT", () => {
  server.kill("SIGINT");
});

process.on("SIGTERM", () => {
  server.kill("SIGTERM");
});

