# Examples

Real-world examples and use cases for the Kokoro TTS MCP Server.

## Basic Usage

### Simple Text to Speech

```json
{
  "name": "text_to_speech",
  "arguments": {
    "text": "Hello, world!"
  }
}
```

### Custom Voice

```json
{
  "name": "text_to_speech",
  "arguments": {
    "text": "Welcome to Kokoro TTS",
    "voice": "af_bella"
  }
}
```

### Adjust Speed

```json
{
  "name": "text_to_speech",
  "arguments": {
    "text": "This is slower speech",
    "speed": 0.8
  }
}
```

## Cursor IDE Integration

### Configuration

Edit `~/.cursor/mcp.json`:

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

### Usage in Chat

```
User: "Read this out loud: The quick brown fox jumps over the lazy dog"
```

The AI will call `text_to_speech` and play the audio automatically.

## Claude Desktop Integration

### Configuration

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

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

## Web Application Integration

### SSE Mode Setup

Start server:
```bash
npx @ross_tchnologies/kokoro-tts-mcp-server --sse --port=3000
```

### JavaScript Client

```javascript
async function textToSpeech(text, voice = 'af_heart', speed = 1.0) {
  const response = await fetch('http://localhost:3000/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'text_to_speech',
        arguments: {
          text,
          voice,
          speed
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.result && !data.result.isError) {
    // Extract base64 audio
    const match = data.result.content[0].text.match(
      /data:audio\/wav;base64,([A-Za-z0-9+/=]+)/
    );
    
    if (match) {
      const audioBase64 = match[1];
      const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
      
      // Create audio element and play
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      
      return audio;
    }
  }
  
  throw new Error('Failed to generate speech');
}

// Usage
textToSpeech('Hello from the web!').catch(console.error);
```

### Python Client

```python
import requests
import base64
import io
from playsound import playsound

def text_to_speech(text, voice='af_heart', speed=1.0):
    response = requests.post(
        'http://localhost:3000/mcp',
        json={
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'tools/call',
            'params': {
                'name': 'text_to_speech',
                'arguments': {
                    'text': text,
                    'voice': voice,
                    'speed': speed
                }
            }
        }
    )
    
    data = response.json()
    
    if data.get('result') and not data['result'].get('isError'):
        # Extract base64 audio
        text_content = data['result']['content'][0]['text']
        match = re.search(r'data:audio/wav;base64,([A-Za-z0-9+/=]+)', text_content)
        
        if match:
            audio_base64 = match.group(1)
            audio_data = base64.b64decode(audio_base64)
            
            # Save and play
            with open('output.wav', 'wb') as f:
                f.write(audio_data)
            
            playsound('output.wav')
            return 'output.wav'
    
    raise Exception('Failed to generate speech')

# Usage
text_to_speech('Hello from Python!')
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Test TTS

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install TTS Server
        run: npm install -g @ross_tchnologies/kokoro-tts-mcp-server
      
      - name: Test TTS
        run: |
          kokoro-tts-mcp &
          sleep 10  # Wait for initialization
          # Run your tests
```

## Node.js Script Example

```javascript
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Start server
const server = spawn('npx', ['-y', '@ross_tchnologies/kokoro-tts-mcp-server'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send MCP request
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'text_to_speech',
    arguments: {
      text: 'Hello from Node.js!',
      voice: 'af_heart',
      speed: 1.0
    }
  }
};

server.stdin.write(JSON.stringify(request) + '\n');

// Handle response
let buffer = '';
server.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        if (response.result) {
          console.log('Success:', response.result);
          
          // Extract and save audio
          const match = response.result.content[0].text.match(
            /data:audio\/wav;base64,([A-Za-z0-9+/=]+)/
          );
          
          if (match) {
            const audioBuffer = Buffer.from(match[1], 'base64');
            writeFileSync('output.wav', audioBuffer);
            console.log('Audio saved to output.wav');
          }
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    }
  }
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});
```

## Batch Processing

### Process Multiple Texts

```javascript
const texts = [
  'First sentence',
  'Second sentence',
  'Third sentence'
];

async function processBatch(texts) {
  for (const text of texts) {
    await textToSpeech(text);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between
  }
}

processBatch(texts);
```

## Error Handling

### Robust Implementation

```javascript
async function safeTextToSpeech(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await textToSpeech(text);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Advanced Examples

### Voice Comparison

```javascript
const voices = ['af_heart', 'af_bella', 'af_sarah'];
const text = 'This is a voice comparison test';

for (const voice of voices) {
  console.log(`Testing voice: ${voice}`);
  await textToSpeech(text, voice);
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

### Speed Variations

```javascript
const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const text = 'Testing different speech speeds';

for (const speed of speeds) {
  console.log(`Speed: ${speed}x`);
  await textToSpeech(text, 'af_heart', speed);
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

## Next Steps

- Explore [API Reference](API-Reference) for more details
- Check [Troubleshooting](Troubleshooting) if you encounter issues
- Review [Configuration](Configuration) for advanced setup

