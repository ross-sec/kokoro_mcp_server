# Troubleshooting Guide

Common issues and solutions for the Kokoro TTS MCP Server.

## Installation Issues

### Command Not Found

**Problem:** `kokoro-tts-mcp: command not found`

**Solutions:**
1. Check if globally installed:
   ```bash
   npm list -g @ross_tchnologies/kokoro-tts-mcp-server
   ```

2. Check PATH:
   ```bash
   npm config get prefix
   # Add output to your PATH
   export PATH=$(npm config get prefix)/bin:$PATH
   ```

3. Reinstall globally:
   ```bash
   npm install -g @ross_tchnologies/kokoro-tts-mcp-server
   ```

### Permission Denied

**Problem:** `EACCES: permission denied`

**Solutions:**

1. Use sudo (Linux/Mac):
   ```bash
   sudo npm install -g @ross_tchnologies/kokoro-tts-mcp-server
   ```

2. Change npm directory (Recommended):
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   # Add to ~/.bashrc or ~/.zshrc
   ```

3. Fix permissions:
   ```bash
   sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
   ```

## Model Download Issues

### Download Fails

**Problem:** Model download fails or times out

**Solutions:**
1. Check internet connection:
   ```bash
   curl -I https://registry.npmjs.org
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Check disk space:
   ```bash
   df -h
   # Need at least 500MB free
   ```

4. Manual download:
   - Visit [Kokoro repository](https://github.com/hexgrad/kokoro)
   - Download model manually
   - Place in cache directory

### Slow Download

**Problem:** Model download is very slow

**Solutions:**
1. Use faster connection or wait
2. Check firewall/proxy settings
3. Try different time of day (less network congestion)

## Runtime Issues

### Server Won't Start

**Problem:** Server exits immediately or fails to start

**Solutions:**
1. Check Node.js version:
   ```bash
   node --version
   # Must be 18+
   ```

2. Check for errors:
   ```bash
   kokoro-tts-mcp 2>&1 | tee error.log
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

### Initialization Timeout

**Problem:** First run takes too long or times out

**Solutions:**
1. This is normal - first run downloads model (2-5 min)
2. Increase timeout in client configuration
3. Check system resources:
   ```bash
   free -h  # Check RAM
   df -h     # Check disk
   ```

### Out of Memory

**Problem:** `JavaScript heap out of memory`

**Solutions:**
1. Increase Node.js memory:
   ```bash
   node --max-old-space-size=4096 dist/index.js
   ```

2. Close other applications
3. Check available RAM:
   ```bash
   free -h
   # Need at least 4GB
   ```

## Audio Issues

### No Audio Playback

**Problem:** Audio generated but doesn't play

**Solutions:**
1. Check audio file location in response message
2. Install audio utilities (Linux):
   ```bash
   sudo apt install alsa-utils pulseaudio
   ```

3. Test audio player:
   ```bash
   aplay test.wav
   ```

4. WSL Audio (Windows):
   - Install "WSL Audio" from Microsoft Store
   - Or copy file to Windows and play manually

### Audio File Not Saved

**Problem:** Response doesn't include file path

**Solutions:**
1. Check permissions:
   ```bash
   ls -la ~/Desktop  # or temp directory
   ```

2. Check disk space:
   ```bash
   df -h
   ```

3. Manual extraction:
   - Extract base64 from response
   - Save to file manually

### Poor Audio Quality

**Problem:** Audio sounds distorted or low quality

**Solutions:**
1. Check model download (may be corrupted)
2. Clear cache and redownload:
   ```bash
   rm -rf ~/.cache/kokoro-js
   # Restart server
   ```

3. Try different voice:
   ```json
   {
     "voice": "af_bella"
   }
   ```

## MCP Client Issues

### Client Can't Connect

**Problem:** MCP client reports connection failure

**Solutions:**
1. Verify command path:
   ```json
   {
     "command": "which",
     "args": ["kokoro-tts-mcp"]
   }
   ```

2. Test command manually:
   ```bash
   kokoro-tts-mcp
   # Should start without errors
   ```

3. Check MCP config syntax:
   ```bash
   cat ~/.cursor/mcp.json | python -m json.tool
   # Should parse without errors
   ```

### Tool Not Available

**Problem:** `text_to_speech` tool not listed

**Solutions:**
1. Restart MCP client (Cursor/Claude Desktop)
2. Check server logs for errors
3. Verify server is running:
   ```bash
   ps aux | grep kokoro-tts-mcp
   ```

### Response Format Error

**Problem:** Client rejects response format

**Solutions:**
1. Check MCP client version (may need update)
2. Verify server version:
   ```bash
   npm list -g @ross_tchnologies/kokoro-tts-mcp-server
   ```

3. Check server logs for errors

## SSE Mode Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Find process using port:
   ```bash
   lsof -i :3000
   # or
   netstat -tulpn | grep 3000
   ```

2. Kill process or use different port:
   ```bash
   kokoro-tts-mcp --sse --port=8080
   ```

### CORS Issues

**Problem:** Web client blocked by CORS

**Solutions:**
1. Check server logs
2. Verify CORS headers (should be enabled)
3. For production, implement proper CORS policy

### Connection Timeout

**Problem:** HTTP requests timeout

**Solutions:**
1. Check server is running:
   ```bash
   curl http://localhost:3000/sse
   ```

2. Increase client timeout
3. Check firewall settings

## Performance Issues

### Slow Generation

**Problem:** Audio generation takes too long

**Solutions:**
1. Normal: 2-5 seconds per generation
2. First run slower (model initialization)
3. Check CPU usage:
   ```bash
   top
   ```

4. Close other applications
5. Consider faster CPU (model runs on CPU)

### High Memory Usage

**Problem:** Server uses too much memory

**Solutions:**
1. Normal: ~500MB-1GB for model
2. Check actual usage:
   ```bash
   ps aux | grep kokoro-tts-mcp
   ```

3. Restart server periodically
4. Use Node.js memory limits if needed

## GitHub Actions Issues

### Publish Fails

**Problem:** GitHub Actions workflow fails to publish

**Solutions:**
1. Check `NPM_TOKEN` secret is set:
   - Repository → Settings → Secrets → Actions
   - Must be named exactly `NPM_TOKEN`

2. Verify token permissions:
   - Must be "Automation" type
   - Must have publish permissions

3. Check version:
   - Must be newer than published version
   - Update `package.json` version

### Build Fails

**Problem:** TypeScript build fails in CI

**Solutions:**
1. Check Node.js version in workflow (must be 18+)
2. Run build locally:
   ```bash
   npm run build
   ```

3. Check for TypeScript errors:
   ```bash
   npm run build 2>&1 | grep error
   ```

## Getting Help

If issues persist:

1. **Check Logs:**
   ```bash
   kokoro-tts-mcp 2>&1 | tee server.log
   ```

2. **Version Information:**
   ```bash
   node --version
   npm --version
   npm list -g @ross_tchnologies/kokoro-tts-mcp-server
   ```

3. **Report Issue:**
   - GitHub Issues: https://github.com/ross-sec/kokoro_mcp_server/issues
   - Include: error messages, logs, version info

4. **Community:**
   - Check existing issues
   - Search documentation
   - Ask in discussions

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Command not found` | Not installed or not in PATH | Install globally or use npx |
| `EACCES: permission denied` | Permission issue | Fix npm permissions |
| `EADDRINUSE` | Port in use | Use different port |
| `out of memory` | Insufficient RAM | Increase memory or close apps |
| `Voice not found` | Invalid voice ID | Use valid voice |
| `404 Not Found` | Package not published | Wait for propagation or check name |

## Next Steps

- Review [Configuration](Configuration) for setup details
- Check [Examples](Examples) for usage patterns
- See [API Reference](API-Reference) for technical details

