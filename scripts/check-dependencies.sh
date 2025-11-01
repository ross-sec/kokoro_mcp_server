#!/bin/bash

echo "Checking dependencies for Kokoro TTS MCP Server..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
    
    # Check Node.js version (should be >= 18)
    NODE_MAJOR=$(node -p "process.version.match(/^v(\d+)/)[1]")
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo "✓ Node.js version is compatible (v18+)"
    else
        echo "⚠ Node.js version should be v18 or higher (current: $NODE_VERSION)"
    fi
else
    echo "✗ Node.js not found. Please install Node.js v18 or higher."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm found: $NPM_VERSION"
else
    echo "✗ npm not found. Please install npm."
    exit 1
fi

# Check if kokoro-js is installed
if [ -d "node_modules/kokoro-js" ]; then
    echo "✓ kokoro-js package is installed"
else
    echo "⚠ kokoro-js package not found. Install with: npm install"
fi

echo ""
echo "Dependency check complete!"
echo ""
echo "Note: This server uses the native JavaScript kokoro-js package."
echo "No Python or espeak-ng dependencies are required!"
