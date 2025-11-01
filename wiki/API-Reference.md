# API Reference

Complete API documentation for the Kokoro TTS MCP Server.

## MCP Protocol

The server implements the Model Context Protocol (MCP) specification.

### Capabilities

```json
{
  "tools": {}
}
```

The server provides tools that can be called by MCP clients.

## Tools

### text_to_speech

Converts text to speech using the Kokoro TTS model.

#### Request Schema

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "text_to_speech",
    "arguments": {
      "text": "string (required)",
      "voice": "string (optional, default: 'af_heart')",
      "speed": "number (optional, default: 1.0)"
    }
  }
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | Yes | - | The text to convert to speech |
| `voice` | string | No | `af_heart` | Voice ID to use |
| `speed` | number | No | `1.0` | Speech speed multiplier (0.5-2.0) |

#### Response Schema

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Successfully generated speech audio ({size} bytes). Audio data URI: data:audio/wav;base64,{base64data}\n\nAudio file saved to: {filepath}\n{playback_status}"
      }
    ],
    "isError": false
  }
}
```

#### Success Response Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Successfully generated speech audio (144044 bytes). Audio data URI: data:audio/wav;base64,UklGRiQAAABXQVZFZm10...\n\nAudio file saved to: /mnt/c/Users/user/Desktop/kokoro-tts-1234567890.wav\n✅ Audio played successfully using aplay"
      }
    ],
    "isError": false
  }
}
```

#### Error Response Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Error generating speech: Voice 'invalid_voice' not found"
      }
    ],
    "isError": true
  }
}
```

#### Voice IDs

Available voice options:

- `af_heart` - Default female voice, warm and friendly
- `af_bella` - Female voice, clear and professional
- `af_sarah` - Female voice, energetic and cheerful

See [Kokoro documentation](https://github.com/hexgrad/kokoro) for complete list.

#### Speed Range

- **Minimum:** `0.5` (half speed)
- **Maximum:** `2.0` (double speed)
- **Default:** `1.0` (normal speed)

## HTTP/SSE Endpoints

When running in SSE mode (`--sse`), the server exposes HTTP endpoints.

### GET /sse

Server-Sent Events stream endpoint.

**Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *
```

**Response:**
```
data: {"type": "connected"}

```

### POST /mcp

MCP JSON-RPC endpoint.

**Content-Type:** `application/json`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "text_to_speech",
    "arguments": {
      "text": "Hello"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

## Audio Format

### WAV Format

Generated audio is in WAV format:
- **Encoding:** PCM
- **Sample Rate:** 24kHz (default Kokoro output)
- **Channels:** Mono
- **Bit Depth:** 16-bit

### Base64 Encoding

Audio data is provided as base64-encoded data URI:

```
data:audio/wav;base64,{base64_encoded_audio}
```

### File Output

Audio files are saved with naming pattern:
```
kokoro-tts-{timestamp}.wav
```

Where `{timestamp}` is Unix timestamp in milliseconds.

## Error Codes

### Common Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `Voice not found` | Invalid voice ID | Use valid voice from list |
| `Text parameter is required` | Missing text parameter | Provide text in request |
| `Generation timeout` | Model initialization taking too long | Wait for first-time setup |
| `Memory error` | Insufficient RAM | Ensure 4GB+ available |

## Rate Limiting

Currently, no rate limiting is enforced. However:
- Model initialization takes ~5-10 seconds
- Each generation takes ~2-5 seconds
- Consider implementing client-side rate limiting for production

## Authentication

### Stdio Mode

No authentication required - uses process communication.

### SSE Mode

Currently no authentication. For production:
- Implement API key authentication
- Use HTTPS/TLS
- Add rate limiting

## Versioning

API version follows package version:
- Current: `1.0.1`
- Check package.json for latest version

## Deprecation Policy

- Major version bumps indicate breaking changes
- Deprecated features will have 6-month notice
- Check CHANGELOG.md for migration guides

## Next Steps

- See [Examples](Examples) for usage patterns
- Check [Troubleshooting](Troubleshooting) for error resolution
- Review [Development Guide](Development-Guide) for extending the API

