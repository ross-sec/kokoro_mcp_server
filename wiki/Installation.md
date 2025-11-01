# Installation Guide

This guide covers all methods of installing the Kokoro TTS MCP Server.

## Prerequisites

- **Node.js** version 18 or higher
- **npm** (comes with Node.js) or **yarn**
- No Python or other external dependencies required! 🎉

### Checking Node.js Version

```bash
node --version
```

Should output `v18.x.x` or higher.

## Installation Methods

### Method 1: NPX (Recommended - No Installation)

Run directly without installing:

```bash
npx @ross_tchnologies/kokoro-tts-mcp-server
```

**Advantages:**
- No installation required
- Always uses the latest version
- Clean - doesn't clutter your system

### Method 2: Global Installation

Install globally for system-wide access:

```bash
npm install -g @ross_tchnologies/kokoro-tts-mcp-server
```

After installation, run from anywhere:

```bash
kokoro-tts-mcp
```

**Advantages:**
- Available system-wide
- Faster startup (no download)
- Can be used in MCP configs without npx

### Method 3: Local Installation (Project-based)

Install in your project:

```bash
npm install @ross_tchnologies/kokoro-tts-mcp-server
```

Then run from your project:

```bash
node node_modules/@ross_tchnologies/kokoro-tts-mcp-server/dist/index.js
```

**Advantages:**
- Project-specific version
- Doesn't require global permissions
- Good for CI/CD pipelines

## First Run Setup

On the first run, the server will:

1. **Download the Kokoro model** (~300MB)
   - This is a one-time download
   - Requires stable internet connection
   - Takes 2-5 minutes depending on connection

2. **Initialize the TTS engine**
   - Loads the quantized model into memory
   - Takes 30-60 seconds on first run
   - Subsequent runs are faster (~5-10 seconds)

## Verifying Installation

### Test with NPX

```bash
npx @ross_tchnologies/kokoro-tts-mcp-server --help
```

### Test Global Installation

```bash
kokoro-tts-mcp --help
```

### Run Test Script

If installed locally:

```bash
npm test
```

Or run the test script directly:

```bash
node tests/test-tts.js "Hello, this is a test"
```

## Troubleshooting Installation

### Issue: Command not found

**Global installation:**
- Ensure npm global bin is in your PATH
- Try: `npm config get prefix` and add to PATH

**NPX:**
- Update npm: `npm install -g npm@latest`
- Clear cache: `npm cache clean --force`

### Issue: Permission denied

**Linux/Mac:**
```bash
sudo npm install -g @ross_tchnologies/kokoro-tts-mcp-server
```

**Or configure npm to use a different directory:**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Model download fails

- Check internet connection
- Ensure sufficient disk space (500MB+ free)
- Check firewall/proxy settings
- Try manual download from [Kokoro repository](https://github.com/hexgrad/kokoro)

## Next Steps

After installation, proceed to:
- [Getting Started](Getting-Started) - Learn how to use the server
- [Configuration](Configuration) - Set up MCP clients

