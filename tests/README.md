# Test Scripts

## test-tts.js

Test script to debug and verify the Kokoro TTS MCP server functionality.

### Usage

```bash
# Make sure you've built the project first
npm run build

# Run the test
node tests/test-tts.js
```

### What it does

1. Starts the MCP server
2. Initializes the MCP connection
3. Lists available tools
4. Calls the `text_to_speech` tool with test text
5. Shows the complete response structure
6. Extracts and saves audio if present

### Output

The script will show:
- All MCP requests being sent
- All MCP responses received
- The structure of the response content array
- Details about each content item
- Extracted audio data (if found)
- Saved WAV file (if audio is found)

This helps debug any issues with the response format or content structure.

