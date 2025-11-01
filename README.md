# @ross_tchnologies/kokoro-tts-mcp-server

A Model Context Protocol (MCP) server for text-to-speech using the Kokoro TTS model with a default female voice. This server runs **100% locally** using the native JavaScript `kokoro-js` package, eliminating the need for Python dependencies.

**Built by [Ross Technologies](https://github.com/ross-sec)**  
**Location**: Beer Sheva, Israel  
**Contact**: devops.ross@gmail.com

## Features

- ✅ **100% Local** - No Python dependencies required
- ✅ **Native JavaScript** - Built with TypeScript and Node.js
- ✅ **SSE Support** - Server-Sent Events for real-time communication
- ✅ **Stdio Support** - Standard MCP transport mode
- ✅ **NPX Ready** - Run directly with `npx` without installation
- ✅ **Female Voice Default** - Uses `af_heart` voice out of the box

## Prerequisites

- **Node.js** (v18 or higher)
- No Python or other external dependencies required! 🎉

## Installation

### Quick Start with NPX (Recommended)

Run directly without installation:

```bash
    npx @ross_tchnologies/kokoro-tts-mcp-server
```

Or with SSE mode:

```bash
    npx @ross_tchnologies/kokoro-tts-mcp-server --sse --port=3000
```

### Install Globally

```bash
    npm install -g @ross_tchnologies/kokoro-tts-mcp-server
```

Then run:

```bash
kokoro-tts-mcp
```

### Install Locally

```bash
    npm install @ross_tchnologies/kokoro-tts-mcp-server
```

## Usage

### Running the Server

#### Stdio Mode (Default - for MCP clients)

```bash
# Using NPX
    npx @ross_tchnologies/kokoro-tts-mcp-server

# Using global installation
kokoro-tts-mcp

# Using local installation
    node node_modules/@ross_tchnologies/kokoro-tts-mcp-server/dist/index.js
```

#### SSE/HTTP Mode

Run with Server-Sent Events support:

```bash
# Using NPX
    npx @ross_tchnologies/kokoro-tts-mcp-server --sse --port=3000

# Using global installation
kokoro-tts-mcp --sse --port=3000

# Custom port
    npx @ross_tchnologies/kokoro-tts-mcp-server --sse --port=8080
```

SSE mode provides:
- **SSE Endpoint**: `http://localhost:3000/sse` - Server-Sent Events stream
- **MCP Endpoint**: `http://localhost:3000/mcp` - MCP JSON-RPC endpoint

### MCP Client Configuration

#### Using NPX (Recommended)

Add this to your MCP configuration (e.g., Claude Desktop):

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

#### Using Global Installation

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "kokoro-tts-mcp"
    }
  }
}
```

#### Using SSE Mode

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

### Available Tools

#### `text_to_speech`

Converts text to speech using Kokoro TTS with a female voice by default.

**Parameters:**
- `text` (required): The text to convert to speech
- `voice` (optional): Voice ID to use (default: `af_heart`)
  - Available female voices: `af_heart`, `af_bella`, `af_sarah`, etc.
- `speed` (optional): Speech speed multiplier (default: `1.0`)

**Response:**
Returns base64-encoded WAV audio data in a data URI format within the text content. The audio can be extracted and played or saved to a file.

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully generated speech audio (123456 bytes). Audio data URI: data:audio/wav;base64,..."
    }
  ]
}
```

## Troubleshooting

### Model Download
The first run will download the Kokoro model (~300MB). Ensure you have:
- Stable internet connection
- At least 500MB free disk space
- Sufficient time for the download (may take a few minutes)

### Audio Generation Issues
- **Voice not found**: Use valid voice IDs like `af_heart`, `af_bella`, `af_sarah`, etc. See the [Kokoro documentation](https://github.com/hexgrad/kokoro) for all available voices.
- **Generation timeout**: First-time initialization can take 30-60 seconds. Be patient on the first run.
- **Memory errors**: Ensure at least 4GB RAM available. The model runs on CPU by default.

### WSL/Windows Users
If you're using WSL and can't hear audio:
1. The audio file is generated successfully - check the response for the base64 data URI
2. Copy the generated audio to Windows and play it there
3. Or install WSL Audio support from Microsoft Store

## Authors

- **Andre Ross**
- **Eyal Atias**
- **Leorah Ross**

## Company

**Ross Technologies**  
Beer Sheva, Israel  
Email: devops.ross@gmail.com

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## References

- [Kokoro GitHub](https://github.com/hexgrad/kokoro)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [npm Package](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)
