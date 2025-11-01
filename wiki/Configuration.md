# Configuration Guide

Complete guide to configuring the Kokoro TTS MCP Server for different use cases.

## MCP Client Configuration

### Using NPX (Recommended)

**File:** `~/.cursor/mcp.json` or Claude Desktop config

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "npx",
      "args": ["-y", "@ross_tchnologies/kokoro-tts-mcp-server"]
    }
  }
}
```

**Advantages:**
- Always uses latest version
- No installation required
- Easy to update

### Using Global Installation

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "kokoro-tts-mcp"
    }
  }
}
```

### Using Local Installation

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "node",
      "args": ["/path/to/node_modules/@ross_tchnologies/kokoro-tts-mcp-server/dist/index.js"]
    }
  }
}
```

### SSE/HTTP Mode

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "npx",
      "args": ["-y", "@ross_tchnologies/kokoro-tts-mcp-server", "--sse", "--port=3000"],
      "env": {
        "MCP_SERVER_URL": "http://localhost:3000/mcp"
      }
    }
  }
}
```

## Environment Variables

### NODE_ENV

Control logging behavior:

```bash
# Production (minimal logging)
NODE_ENV=production kokoro-tts-mcp

# Development (verbose logging)
NODE_ENV=development kokoro-tts-mcp
```

**Default:** `production`

### KOKORO_MODEL_PATH

Specify custom model location:

```bash
KOKORO_MODEL_PATH=/custom/path/to/model kokoro-tts-mcp
```

**Default:** Auto-downloads to default location

### MCP_SERVER_URL

Required for SSE mode:

```bash
MCP_SERVER_URL=http://localhost:3000/mcp kokoro-tts-mcp --sse
```

## Command Line Arguments

### --sse / --http

Enable Server-Sent Events mode:

```bash
kokoro-tts-mcp --sse
```

### --port

Specify HTTP port (SSE mode only):

```bash
kokoro-tts-mcp --sse --port=8080
```

**Default:** `3000`

## Voice Configuration

### Default Voice

The server uses `af_heart` (female voice) by default. Change it:

```json
{
  "text": "Hello",
  "voice": "af_bella"
}
```

### Available Voices

Female voices:
- `af_heart` - Default, warm and friendly
- `af_bella` - Clear and professional
- `af_sarah` - Energetic and cheerful

See [Kokoro documentation](https://github.com/hexgrad/kokoro) for complete voice list.

### Speed Control

Adjust speech speed:

```json
{
  "text": "Hello",
  "speed": 0.8  // Slower
}
```

```json
{
  "text": "Hello",
  "speed": 1.5  // Faster
}
```

**Range:** `0.5` - `2.0`  
**Default:** `1.0`

## Audio Output Configuration

### Auto-Save Location

The server automatically saves audio files:

1. **Windows Desktop** (if in WSL):
   ```
   /mnt/c/Users/{username}/Desktop/kokoro-tts-{timestamp}.wav
   ```

2. **Temp Directory** (fallback):
   ```
   {tmpdir}/kokoro-tts-{timestamp}.wav
   ```

### Audio Playback

The server attempts automatic playback using:

1. `aplay` (ALSA - Linux)
2. `paplay` (PulseAudio)
3. `pw-play` (PipeWire)
4. `ffplay` (FFmpeg)
5. PowerShell (Windows, if WSL audio available)

If playback fails, check the response message for the file location.

## Network Configuration

### Firewall Settings

For SSE mode, ensure port is open:

```bash
# Linux (ufw)
sudo ufw allow 3000/tcp

# macOS
# Firewall settings in System Preferences

# Windows
# Windows Defender Firewall settings
```

### Proxy Configuration

If behind a proxy:

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
kokoro-tts-mcp
```

## Resource Configuration

### Memory Requirements

- **Minimum:** 2GB RAM
- **Recommended:** 4GB+ RAM
- **Model Size:** ~300MB disk space

### CPU Usage

The model runs on CPU by default. For faster performance:
- Use a faster CPU (model is quantized for efficiency)
- Ensure sufficient RAM to avoid swapping

## Security Configuration

### Scoped Package Access

The package is scoped under `@ross_tchnologies`:

```bash
npm config set @ross_tchnologies:registry https://registry.npmjs.org/
```

### GitHub Actions

For CI/CD, configure `NPM_TOKEN` secret:

1. Create npm automation token
2. Add to GitHub Secrets as `NPM_TOKEN`
3. See [Development Guide](Development-Guide) for details

## Configuration Files

### package.json

The server reads configuration from:

```json
{
  "name": "@ross_tchnologies/kokoro-tts-mcp-server",
  "version": "1.0.1",
  "main": "dist/index.js",
  "bin": {
    "kokoro-tts-mcp": "./bin/kokoro-tts-mcp.js"
  }
}
```

### mcp.json

Example configuration file in package root:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "npx",
      "args": ["-y", "@ross_tchnologies/kokoro-tts-mcp-server"]
    }
  }
}
```

## Troubleshooting Configuration

### Server won't start

- Check Node.js version: `node --version` (must be 18+)
- Verify command path
- Check permissions

### Audio not playing

- Install audio utilities: `sudo apt install alsa-utils`
- Check WSL audio support
- Manually play saved file

### Port already in use (SSE mode)

```bash
# Find process using port
lsof -i :3000

# Use different port
kokoro-tts-mcp --sse --port=8080
```

## Next Steps

- See [Examples](Examples) for configuration scenarios
- Check [Troubleshooting](Troubleshooting) for common issues
- Review [API Reference](API-Reference) for advanced usage

