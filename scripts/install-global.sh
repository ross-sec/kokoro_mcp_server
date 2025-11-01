#!/bin/bash

# Script to install Kokoro TTS MCP server globally

set -e

PROJECT_DIR="/home/ross/kokoro_tts"
BIN_DIR="$HOME/.local/bin"
WRAPPER_SCRIPT="$PROJECT_DIR/bin/kokoro-tts-mcp.js"
SYMLINK_NAME="kokoro-tts-mcp"

echo "Installing Kokoro TTS MCP server globally..."
echo ""

# Create bin directory if it doesn't exist
mkdir -p "$BIN_DIR"
echo "✓ Created/verified ~/.local/bin directory"

# Remove existing symlink if it exists
if [ -L "$BIN_DIR/$SYMLINK_NAME" ]; then
    rm "$BIN_DIR/$SYMLINK_NAME"
    echo "✓ Removed existing symlink"
fi

# Create symlink
ln -s "$WRAPPER_SCRIPT" "$BIN_DIR/$SYMLINK_NAME"
echo "✓ Created symlink: $BIN_DIR/$SYMLINK_NAME -> $WRAPPER_SCRIPT"

# Check if ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "⚠ Warning: ~/.local/bin is not in your PATH"
    echo ""
    echo "Add this line to your ~/.bashrc or ~/.zshrc:"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo ""
    echo "Then reload your shell:"
    echo "  source ~/.bashrc  # or source ~/.zshrc"
    echo ""
else
    echo "✓ ~/.local/bin is already in your PATH"
fi

echo ""
echo "Installation complete!"
echo ""
echo "You can now use 'kokoro-tts-mcp' from anywhere."
echo "Verify with: which kokoro-tts-mcp"

