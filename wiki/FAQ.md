# Frequently Asked Questions (FAQ)

Common questions and answers about the Kokoro TTS MCP Server.

## General Questions

### What is this project?

The Kokoro TTS MCP Server is a Model Context Protocol (MCP) server that provides text-to-speech capabilities using the Kokoro TTS model. It runs 100% locally with no Python dependencies.

### Why use this instead of other TTS solutions?

- **100% Local** - No external API calls, complete privacy
- **No Python** - Pure JavaScript/TypeScript implementation
- **MCP Compatible** - Works with MCP clients like Cursor, Claude Desktop
- **Female Voice Default** - Default female voice out of the box
- **Easy Integration** - Simple MCP tool interface

### Is it free?

Yes! The package is open source under MIT License. Free to use, modify, and distribute.

### What languages are supported?

Currently supports English text. The underlying Kokoro model supports multiple languages - check [Kokoro documentation](https://github.com/hexgrad/kokoro) for details.

## Installation Questions

### Do I need Python?

No! The server uses the native JavaScript `kokoro-js` package. No Python installation required.

### What Node.js version do I need?

Node.js version 18 or higher is required.

### Can I install it without npm?

No, npm (or yarn/pnpm) is required for installation. You can use `npx` without installing globally.

### Is global installation required?

No, you can use:
- `npx` (no installation)
- Local installation (project-specific)
- Global installation (system-wide)

## Usage Questions

### How do I change the voice?

Specify the `voice` parameter:
```json
{
  "voice": "af_bella"
}
```

Available voices: `af_heart`, `af_bella`, `af_sarah`, and more.

### Can I adjust speech speed?

Yes, use the `speed` parameter:
```json
{
  "speed": 0.8  // Slower
}
```

Range: 0.5 to 2.0 (default: 1.0)

### Where are audio files saved?

- **Windows Desktop** (if using WSL): `/mnt/c/Users/{username}/Desktop/`
- **Temp directory** (otherwise): System temp directory

The file path is included in the response message.

### Why doesn't audio play automatically?

Audio playback requires:
1. Audio utilities installed (Linux)
2. WSL Audio support (Windows WSL)
3. Proper audio configuration

If playback fails, the file is still saved - check the response for the file location.

## Technical Questions

### How much memory does it use?

- **Model loading**: ~300MB
- **Runtime**: ~500MB-1GB total
- **Recommended**: 4GB+ RAM available

### How long does initialization take?

- **First run**: 2-5 minutes (downloads model)
- **Subsequent runs**: 5-10 seconds
- **Generation time**: 2-5 seconds per request

### Can I use GPU acceleration?

Currently, the model runs on CPU only. GPU support may be added in future versions.

### What audio format is generated?

WAV format:
- PCM encoding
- 24kHz sample rate
- Mono channel
- 16-bit depth

### Is the model quantized?

Yes, the model uses 8-bit quantization (`q8`) for better performance and lower memory usage.

## Integration Questions

### Can I use this with my own application?

Yes! You can:
- Use as MCP server (stdio mode)
- Use HTTP/SSE endpoints (SSE mode)
- Integrate via MCP protocol
- Extract audio from responses

### Does it work with Cursor IDE?

Yes! Configure in `~/.cursor/mcp.json`:
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

### Does it work with Claude Desktop?

Yes! Configure in Claude Desktop's MCP configuration file.

### Can I run it on a server?

Yes! Use SSE mode for remote access:
```bash
kokoro-tts-mcp --sse --port=3000
```

## Troubleshooting Questions

### Server won't start

Check:
1. Node.js version (must be 18+)
2. Dependencies installed (`npm install`)
3. Build completed (`npm run build`)
4. Error logs (`2>&1 | tee error.log`)

### Model download fails

Try:
1. Check internet connection
2. Clear cache: `npm cache clean --force`
3. Check disk space (need 500MB+)
4. Manual download from Kokoro repository

### Audio doesn't play

Solutions:
1. Install audio utilities: `sudo apt install alsa-utils`
2. Check file was saved (check response message)
3. Play manually from saved location
4. Install WSL Audio (Windows)

### "Command not found" error

- If using npx: Update npm
- If global install: Check PATH
- Try: `npm install -g @ross_tchnologies/kokoro-tts-mcp-server`

### Version conflict errors

npm doesn't allow republishing same version. Update version in `package.json` before publishing.

## Development Questions

### Can I contribute?

Yes! See [Contributing Guide](Contributing) for details.

### How do I build from source?

```bash
git clone https://github.com/ross-sec/kokoro_mcp_server.git
cd kokoro_mcp_server
npm install
npm run build
```

### How do I run tests?

```bash
npm test
# or
node tests/test-tts.js "Test text"
```

### How do I add a new feature?

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit Pull Request

See [Development Guide](Development-Guide) for details.

## Licensing Questions

### What license is used?

MIT License - see [LICENSE](../LICENSE) file.

### Can I use this commercially?

Yes! MIT License allows commercial use.

### Can I modify the code?

Yes! MIT License allows modifications.

### Do I need to credit you?

Attribution is appreciated but not required by MIT License.

## Support Questions

### Where can I get help?

- **Issues**: https://github.com/ross-sec/kokoro_mcp_server/issues
- **Discussions**: https://github.com/ross-sec/kokoro_mcp_server/discussions
- **Email**: devops.ross@gmail.com

### How do I report a bug?

Open an issue on GitHub with:
- Clear description
- Steps to reproduce
- Error messages/logs
- Environment info

### How do I request a feature?

Open a discussion or issue describing:
- Use case
- Proposed solution
- Benefits

## Performance Questions

### How fast is it?

- **Generation**: 2-5 seconds per request
- **First run**: 2-5 minutes (model download)
- **Subsequent runs**: 5-10 seconds initialization

### Can it handle multiple requests?

Yes, but sequentially. Parallel requests may queue.

### Is there rate limiting?

No rate limiting currently. Consider client-side limiting for production.

## Security Questions

### Is my data sent anywhere?

No! Everything runs 100% locally. No external API calls.

### Are there any security concerns?

- Server runs locally
- No network exposure (unless SSE mode)
- Open source - code can be audited

For production SSE deployments, consider:
- Authentication
- HTTPS/TLS
- Rate limiting

## Miscellaneous Questions

### Why "Kokoro"?

Kokoro is the name of the underlying TTS model from [hexgrad/kokoro](https://github.com/hexgrad/kokoro).

### What does MCP stand for?

Model Context Protocol - a protocol for AI assistants to access external tools and data.

### Can I use this offline?

After initial model download, yes! The server runs completely offline.

### Will there be more voices?

Possibly! Depends on Kokoro model updates and community contributions.

## Still Have Questions?

- Check [Troubleshooting](Troubleshooting) guide
- Review [Examples](Examples)
- Open a [Discussion](https://github.com/ross-sec/kokoro_mcp_server/discussions)
- Email: devops.ross@gmail.com

