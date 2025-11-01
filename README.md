# @ross_tchnologies/kokoro-tts-mcp-server

A Model Context Protocol (MCP) server for text-to-speech using the Kokoro TTS model with a default female voice. Runs **100% locally** with no Python dependencies.

**Built by [Ross Technologies](https://github.com/ross-sec)** | Beer Sheva, Israel | devops.ross@gmail.com

[![npm version](https://img.shields.io/npm/v/@ross_tchnologies/kokoro-tts-mcp-server)](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✅ **100% Local** • ✅ **Native JavaScript/TypeScript** • ✅ **SSE & Stdio Support** • ✅ **NPX Ready** • ✅ **Female Voice Default** • ✅ **Auto Audio Playback**

## Quick Start

```bash
# Run with npx (no installation)
npx @ross_tchnologies/kokoro-tts-mcp-server

# Or install globally
npm install -g @ross_tchnologies/kokoro-tts-mcp-server
kokoro-tts-mcp
```

## MCP Client Configuration

Add to your MCP config (e.g., `~/.cursor/mcp.json`):

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

## Usage

### Text to Speech Tool

```json
{
  "name": "text_to_speech",
  "arguments": {
    "text": "Hello, world!",
    "voice": "af_heart",  // optional, default
    "speed": 1.0          // optional, default
  }
}
```

**Available Voices:** `af_heart` (default), `af_bella`, `af_sarah`, and more.

## Documentation

📚 **[Full Documentation Wiki](https://github.com/ross-sec/kokoro_mcp_server/wiki)** - Complete guides, API reference, examples, and troubleshooting

**Quick Links:**
- [Installation Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Installation)
- [Getting Started](https://github.com/ross-sec/kokoro_mcp_server/wiki/Getting-Started)
- [API Reference](https://github.com/ross-sec/kokoro_mcp_server/wiki/API-Reference)
- [Examples](https://github.com/ross-sec/kokoro_mcp_server/wiki/Examples)
- [Troubleshooting](https://github.com/ross-sec/kokoro_mcp_server/wiki/Troubleshooting)
- [FAQ](https://github.com/ross-sec/kokoro_mcp_server/wiki/FAQ)

## White Labeling

This package is designed to be white-labeled for your organization or product. You can:

### Rebranding Options

1. **Package Name**: Fork and publish under your own npm organization
2. **Branding**: Update logos, colors, and branding in the wiki and documentation
3. **Customization**: Modify voice defaults, add custom voices, or extend functionality
4. **Private Deployment**: Use internally without publishing to public npm

### White Label Setup

1. Fork this repository
2. Update `package.json` with your organization details:
   ```json
   {
     "name": "@your-org/kokoro-tts-mcp-server",
     "author": "Your Company",
     "repository": {
       "url": "https://github.com/your-org/your-repo"
     }
   }
   ```
3. Replace branding assets in `resources/images/`
4. Update wiki documentation with your branding
5. Publish to your npm organization or use privately

### License

MIT License - See [LICENSE](LICENSE) for details. You're free to use, modify, and distribute this software, including commercial use.

### Attribution

While not required by the MIT License, attribution is appreciated. You may credit:
- Original project: [Ross Technologies](https://github.com/ross-sec/kokoro_mcp_server)
- Base TTS model: [Kokoro by hexgrad](https://github.com/hexgrad/kokoro)

## Requirements

- **Node.js** v18 or higher
- No Python or other external dependencies required

## Troubleshooting

- **First run**: Downloads ~300MB model (one-time, takes 2-5 minutes)
- **Audio not playing**: File is saved - check response message for location
- **WSL users**: Copy audio files to Windows Desktop for playback

See [Troubleshooting Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Troubleshooting) for detailed solutions.

## Contributing

Contributions welcome! See [Contributing Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Contributing) and [Development Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Development-Guide).

## Authors

**Ross Technologies**  
Andre Ross • Eyal Atias • Leorah Ross

## Links

- 📦 [NPM Package](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)
- 🐙 [GitHub Repository](https://github.com/ross-sec/kokoro_mcp_server)
- 📚 [Documentation Wiki](https://github.com/ross-sec/kokoro_mcp_server/wiki)
- 🐛 [Report Issues](https://github.com/ross-sec/kokoro_mcp_server/issues)
- 💬 [Discussions](https://github.com/ross-sec/kokoro_mcp_server/discussions)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io)
- 🔗 [Kokoro TTS Model](https://github.com/hexgrad/kokoro)

## License

MIT © 2025 Ross Technologies
