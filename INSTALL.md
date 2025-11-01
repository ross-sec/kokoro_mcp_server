# System-Wide Installation Guide

This guide will help you set up the Kokoro TTS MCP server for system-wide access.

## Quick Start (Recommended)

Run the installation script:

```bash
cd /home/ross/kokoro_tts
./scripts/install-global.sh
```

This will:
- Create a symlink in `~/.local/bin/kokoro-tts-mcp`
- Make it accessible from anywhere (if `~/.local/bin` is in your PATH)

Then update your MCP config to use:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "kokoro-tts-mcp"
    }
  }
}
```

## Option 1: Use Direct Path (Recommended)

The easiest way is to use the wrapper script directly in your MCP configuration.

### For Claude Desktop

1. Open your Claude Desktop MCP configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the Kokoro TTS server configuration:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "/home/ross/kokoro_tts/bin/kokoro-tts-mcp"
    }
  }
}
```

3. Restart Claude Desktop

## Option 2: Install to System PATH (Global Access)

To make the server accessible from anywhere:

### Step 1: Create a Symlink

```bash
# Create a global bin directory if it doesn't exist
mkdir -p ~/.local/bin

# Create a symlink to the wrapper script
ln -s /home/ross/kokoro_tts/bin/kokoro-tts-mcp ~/.local/bin/kokoro-tts-mcp
```

### Step 2: Add to PATH (if not already added)

Add this line to your `~/.bashrc` or `~/.zshrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then reload your shell:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Step 3: Update MCP Configuration

Now you can use the command name directly:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "kokoro-tts-mcp"
    }
  }
}
```

## Option 3: Use npm link (Alternative)

If you prefer using npm:

```bash
cd /home/ross/kokoro_tts
npm link
```

Then in your MCP config:

```json
{
  "mcpServers": {
    "kokoro-tts": {
      "command": "node",
      "args": ["/home/ross/kokoro_tts/dist/index.js"]
    }
  }
}
```

## Verifying Installation

Test that the server can be found:

```bash
# If using Option 2 (symlink)
which kokoro-tts-mcp

# Test run (should show "Kokoro TTS MCP Server running on stdio")
kokoro-tts-mcp
```

Press Ctrl+C to stop the test.

## Troubleshooting

### "Command not found" Error

- Make sure the path in your MCP config is correct
- For Option 2, verify `~/.local/bin` is in your PATH
- Ensure the wrapper script is executable: `chmod +x /home/ross/kokoro_tts/bin/kokoro-tts-mcp`

### Server Won't Start

- Make sure you've built the project: `npm run build`
- Check that `dist/index.js` exists
- Verify Node.js is accessible: `which node`

### Permission Errors

- Ensure the script is executable: `chmod +x /home/ross/kokoro_tts/bin/kokoro-tts-mcp`
- Check file permissions on the project directory

