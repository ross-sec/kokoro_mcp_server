# Development Guide

Guide for developers who want to contribute or extend the Kokoro TTS MCP Server.

## Project Structure

```
kokoro_tts/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── bin/
│   └── kokoro-tts-mcp.js # Executable wrapper
├── tests/
│   └── test-tts.js       # Test script
├── .github/
│   └── workflows/
│       └── publish.yml   # CI/CD workflow
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm or yarn
- TypeScript knowledge
- Familiarity with MCP protocol

## Setup Development Environment

### 1. Clone Repository

```bash
git clone https://github.com/ross-sec/kokoro_mcp_server.git
cd kokoro_mcp_server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build Project

```bash
npm run build
```

### 4. Run in Development Mode

```bash
npm run dev
```

This uses `tsx watch` for automatic rebuilding on changes.

## Development Workflow

### Making Changes

1. Edit source files in `src/`
2. Watch mode rebuilds automatically (`npm run dev`)
3. Or manually rebuild: `npm run build`
4. Test changes:
   ```bash
   npm test
   # or
   node tests/test-tts.js "Test text"
   ```

### Code Style

- Follow TypeScript best practices
- Use async/await for async operations
- Add error handling
- Use console.error for logs (stderr, doesn't interfere with MCP)

### Testing

```bash
# Run test script
npm test

# Manual testing
node tests/test-tts.js "Hello world"
```

## Architecture

### Main Components

1. **KokoroTTSWrapper**
   - Wraps `kokoro-js` library
   - Handles model initialization
   - Manages audio generation

2. **KokoroMCPServer**
   - MCP protocol implementation
   - Tool registration and handling
   - Transport management (stdio/SSE)

3. **saveAndPlayAudio**
   - Saves generated audio
   - Attempts automatic playback
   - Handles WSL/Windows paths

### Key Files

- `src/index.ts` - Main server implementation
- `bin/kokoro-tts-mcp.js` - Executable entry point
- `package.json` - Package configuration

## Adding Features

### Add New Tool

1. Update tool list in `listToolsHandler`:
   ```typescript
   {
     name: "new_tool",
     description: "Tool description",
     inputSchema: {
       type: "object",
       properties: {
         // Define parameters
       }
     }
   }
   ```

2. Handle tool call in `callToolHandler`:
   ```typescript
   if (name === "new_tool") {
     // Implementation
   }
   ```

### Add New Voice

1. Check if voice exists in Kokoro model
2. Add to voice list in documentation
3. Update default voice constant if needed

### Modify Audio Output

Edit `saveAndPlayAudio` function:
- Change save location
- Add new audio players
- Modify playback logic

## TypeScript Configuration

`tsconfig.json` settings:
- Target: ES2022
- Module: NodeNext
- Module Resolution: nodenext
- Strict mode enabled

## Building

### Development Build

```bash
npm run build
```

Generates:
- `dist/index.js` - Main server
- Type definitions (if enabled)

### Production Build

```bash
npm run build
npm pack --dry-run  # Verify package contents
```

## Publishing

### Manual Publishing

1. Update version in `package.json`
2. Build project: `npm run build`
3. Test locally
4. Publish:
   ```bash
   npm publish --access public
   ```

### Automated Publishing

GitHub Actions workflow (`.github/workflows/publish.yml`) publishes automatically on:
- Push to main/master
- Tag creation (v*)
- Release creation

## CI/CD

### GitHub Actions

Workflow located at: `.github/workflows/publish.yml`

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Build TypeScript
5. Publish to npm

**Required Secrets:**
- `NPM_TOKEN` - npm authentication token

### Setup CI/CD

1. Get npm token:
   - https://www.npmjs.com/settings/{username}/tokens
   - Create "Automation" token

2. Add to GitHub:
   - Repository → Settings → Secrets → Actions
   - Name: `NPM_TOKEN`
   - Value: npm token

## Debugging

### Enable Verbose Logging

```bash
NODE_ENV=development npm run dev
```

### Debug with Node Inspector

```bash
node --inspect dist/index.js
```

Then attach debugger in VS Code or Chrome DevTools.

### Check MCP Messages

Enable MCP protocol logging:
```typescript
// In src/index.ts
console.error('[MCP] Request:', JSON.stringify(request, null, 2));
```

## Code Guidelines

### Error Handling

Always handle errors gracefully:

```typescript
try {
  // Operation
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[Error] ${errorMessage}`);
  return {
    content: [{ type: "text", text: `Error: ${errorMessage}` }],
    isError: true
  };
}
```

### Logging

- Use `console.error` (stderr, doesn't interfere with MCP stdio)
- Include context: `[Kokoro TTS] Message`
- Conditional on NODE_ENV for production

### Type Safety

- Use TypeScript types strictly
- Avoid `any` types
- Use proper interfaces for MCP messages

## Dependencies

### Production Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol
- `kokoro-js` - TTS engine
- `express` - HTTP server (SSE mode)

### Development Dependencies

- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution
- `@types/*` - Type definitions

## Contributing

### Before Submitting PR

1. Run tests: `npm test`
2. Build successfully: `npm run build`
3. Check linting: `npm run lint` (if configured)
4. Update documentation if needed

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Update documentation
6. Submit PR with description

## Common Tasks

### Update Dependencies

```bash
npm update
npm audit fix
```

### Version Bump

```bash
# Patch (1.0.0 -> 1.0.1)
npm version patch

# Minor (1.0.0 -> 1.1.0)
npm version minor

# Major (1.0.0 -> 2.0.0)
npm version major
```

### Clean Build

```bash
rm -rf dist node_modules
npm install
npm run build
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Kokoro GitHub](https://github.com/hexgrad/kokoro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## Next Steps

- See [Contributing](Contributing) for contribution guidelines
- Check [API Reference](API-Reference) for implementation details
- Review [Troubleshooting](Troubleshooting) for common issues

