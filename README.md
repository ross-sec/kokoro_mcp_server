<div align="center">

![Ross Technologies Logo](https://github.com/ross-sec/kokoro_mcp_server/raw/main/resources/images/main_logo.png)

### **MCP server for text-to-speech using Kokoro TTS**

[![npm version](https://img.shields.io/npm/v/@ross_tchnologies/kokoro-tts-mcp-server)](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/ross-sec/kokoro_mcp_server?style=social)](https://github.com/ross-sec/kokoro_mcp_server)

**100% Local • No Python Required • Female Voice Default**

**[📦 NPM Package](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)** | **[🐙 GitHub Repository](https://github.com/ross-sec/kokoro_mcp_server)** | **[📚 Documentation](https://github.com/ross-sec/kokoro_mcp_server/wiki)**

</div>

---

## Overview

A production-ready MCP server that provides text-to-speech capabilities using the Kokoro TTS model. Features a default female voice (`af_heart`) and runs **100% locally** using native JavaScript, eliminating Python dependencies.

**Built by [Ross Technologies](https://github.com/ross-sec)**  
📍 Beer Sheva, Israel | 📧 [devops.ross@gmail.com](mailto:devops.ross@gmail.com)

## Features

✅ **100% Local** - No external API calls, complete privacy  
✅ **Native JavaScript** - Built with TypeScript and Node.js  
✅ **SSE & Stdio Support** - Multiple transport modes  
✅ **NPX Ready** - Run directly without installation  
✅ **Female Voice Default** - Uses `af_heart` voice out of the box  
✅ **Auto Audio Playback** - Automatically saves and plays generated audio  

## Quick Start

```bash
# Run with npx (no installation)
npx @ross_tchnologies/kokoro-tts-mcp-server

# Or install globally
npm install -g @ross_tchnologies/kokoro-tts-mcp-server
kokoro-tts-mcp
```

## Installation

### NPM

```bash
npm install @ross_tchnologies/kokoro-tts-mcp-server
```

### NPX (No Installation)

```bash
npx @ross_tchnologies/kokoro-tts-mcp-server
```

### Global Installation

```bash
npm install -g @ross_tchnologies/kokoro-tts-mcp-server
```

Visit **[Installation Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Installation)** for detailed instructions.

## MCP Client Configuration

Add to your MCP configuration file (e.g., `~/.cursor/mcp.json`):

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

See **[Configuration Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Configuration)** for more options.

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

See **[API Reference](https://github.com/ross-sec/kokoro_mcp_server/wiki/API-Reference)** for complete documentation.

## Documentation

📚 **[Full Documentation Wiki](https://github.com/ross-sec/kokoro_mcp_server/wiki)**

**Quick Links:**
- 📖 [Installation Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Installation)
- 🚀 [Getting Started](https://github.com/ross-sec/kokoro_mcp_server/wiki/Getting-Started)
- ⚙️ [Configuration](https://github.com/ross-sec/kokoro_mcp_server/wiki/Configuration)
- 📖 [API Reference](https://github.com/ross-sec/kokoro_mcp_server/wiki/API-Reference)
- 💻 [Examples](https://github.com/ross-sec/kokoro_mcp_server/wiki/Examples)
- 🔧 [Troubleshooting](https://github.com/ross-sec/kokoro_mcp_server/wiki/Troubleshooting)
- ❓ [FAQ](https://github.com/ross-sec/kokoro_mcp_server/wiki/FAQ)
- 🛠️ [Development Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Development-Guide)

## Requirements

- **Node.js** v18 or higher
- No Python or other external dependencies required! 🎉

## Troubleshooting

- **First run**: Downloads ~300MB model (one-time, takes 2-5 minutes)
- **Audio not playing**: File is saved - check response message for location
- **WSL users**: Copy audio files to Windows Desktop for playback

See **[Troubleshooting Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Troubleshooting)** for detailed solutions.

## Contributing

Contributions are welcome! See:
- **[Contributing Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Contributing)**
- **[Development Guide](https://github.com/ross-sec/kokoro_mcp_server/wiki/Development-Guide)**

## Links & Resources

- 📦 **[NPM Package](https://www.npmjs.com/package/@ross_tchnologies/kokoro-tts-mcp-server)** - Install from npm
- 🐙 **[GitHub Repository](https://github.com/ross-sec/kokoro_mcp_server)** - Source code and issues
- 📚 **[Documentation Wiki](https://github.com/ross-sec/kokoro_mcp_server/wiki)** - Complete documentation
- 🐛 **[Report Issues](https://github.com/ross-sec/kokoro_mcp_server/issues)** - Bug reports and feature requests
- 💬 **[Discussions](https://github.com/ross-sec/kokoro_mcp_server/discussions)** - Community discussions
- 🔗 **[Model Context Protocol](https://modelcontextprotocol.io)** - Learn about MCP
- 🔗 **[Kokoro TTS Model](https://github.com/hexgrad/kokoro)** - Underlying TTS engine

## License

MIT License - See [LICENSE](https://github.com/ross-sec/kokoro_mcp_server/blob/main/LICENSE) for details.

Copyright © 2025 [Ross Technologies](https://ross-developers.com). All rights reserved.

---

<div align="center">

**Made with ❤️ by Ross Technologies**

[Back to Top](#ross_tchnologieskokoro-tts-mcp-server)

</div>
