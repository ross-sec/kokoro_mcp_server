# Getting Started

This guide will help you get up and running with the Kokoro TTS MCP Server in minutes.

## Quick Start

### 1. Start the Server (Stdio Mode)

```bash
npx @ross_tchnologies/kokoro-tts-mcp-server
```

The server is now running and ready to accept MCP requests via stdio.

### 2. Configure Your MCP Client

Add this to your MCP configuration file (e.g., `~/.cursor/mcp.json`):

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

### 3. Test the Server

In your MCP client (like Cursor), call the `text_to_speech` tool:

```json
{
  "text": "Hello, this is my first text to speech test!",
  "voice": "af_heart",
  "speed": 1.0
}
```

The server will:
1. Generate the audio
2. Save it to your Windows Desktop (if on WSL) or temp directory
3. Attempt to play it automatically
4. Return the audio data in the response

## Running Modes

### Stdio Mode (Default)

Standard MCP transport, uses stdin/stdout:

```bash
kokoro-tts-mcp
# or
npx @ross_tchnologies/kokoro-tts-mcp-server
```

**Use case:** MCP clients like Cursor, Claude Desktop

### SSE/HTTP Mode

Server-Sent Events over HTTP:

```bash
kokoro-tts-mcp --sse --port=3000
# or
npx @ross_tchnologies/kokoro-tts-mcp-server --sse --port=3000
```

**Endpoints:**
- SSE Stream: `http://localhost:3000/sse`
- MCP JSON-RPC: `http://localhost:3000/mcp`

**Use case:** Web applications, remote clients

### Custom Port

```bash
kokoro-tts-mcp --sse --port=8080
```

## Configuration Examples

### Cursor IDE

Edit `~/.cursor/mcp.json`:

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

### Claude Desktop

Edit MCP configuration file (location varies by OS):

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

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

### Global Installation

If installed globally:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "kokoro-tts-mcp"
    }
  }
}
```

### SSE Mode Configuration

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

## Available Tools

### text_to_speech

Converts text to speech using Kokoro TTS.

**Parameters:**
- `text` (required): The text to convert to speech
- `voice` (optional): Voice ID (default: `af_heart`)
- `speed` (optional): Speech speed multiplier (default: `1.0`)

**Available Voices:**
- `af_heart` (default, female)
- `af_bella` (female)
- `af_sarah` (female)
- See [Kokoro documentation](https://github.com/hexgrad/kokoro) for more voices

**Example:**

```json
{
  "name": "text_to_speech",
  "arguments": {
    "text": "Hello from Kokoro TTS!",
    "voice": "af_heart",
    "speed": 1.0
  }
}
```

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully generated speech audio (144044 bytes). Audio data URI: data:audio/wav;base64,...\n\nAudio file saved to: /mnt/c/Users/yourname/Desktop/kokoro-tts-1234567890.wav\n✅ Audio played successfully using aplay"
    }
  ],
  "isError": false
}
```

## Environment Variables

### Development Mode

Enable verbose logging:

```bash
NODE_ENV=development kokoro-tts-mcp
```

### Custom Model Path

```bash
KOKORO_MODEL_PATH=/custom/path kokoro-tts-mcp
```

## Next Steps

- Learn about [Configuration options](Configuration)
- See [Examples](Examples) for common use cases
- Read the [API Reference](API-Reference)

