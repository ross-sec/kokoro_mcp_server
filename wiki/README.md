# GitHub Wiki Documentation

This directory contains the complete documentation for the Kokoro TTS MCP Server in GitHub Wiki format.

## Wiki Pages

- **[Home.md](Home.md)** - Overview and quick links
- **[Installation.md](Installation.md)** - Installation guide for all platforms
- **[Getting-Started.md](Getting-Started.md)** - Quick start guide
- **[Configuration.md](Configuration.md)** - Complete configuration reference
- **[API-Reference.md](API-Reference.md)** - API documentation
- **[Examples.md](Examples.md)** - Code examples and use cases
- **[Troubleshooting.md](Troubleshooting.md)** - Common issues and solutions
- **[Development-Guide.md](Development-Guide.md)** - Developer documentation
- **[Contributing.md](Contributing.md)** - Contribution guidelines
- **[FAQ.md](FAQ.md)** - Frequently asked questions

## Wiki Customization

- **[_Sidebar.md](_Sidebar.md)** - Wiki sidebar navigation
- **[_Footer.md](_Footer.md)** - Wiki footer with branding and links
- **[resources/images/](resources/images/)** - Logo and images for wiki pages

## How to Upload to GitHub Wiki

GitHub Wikis are stored in a separate git repository. To upload these files:

### Method 1: Using GitHub UI (Recommended)

1. Go to your repository: https://github.com/ross-sec/kokoro_mcp_server
2. Click on the **Wiki** tab (or enable it in Settings)
3. Click **New Page** for each file
4. Copy and paste the content from each `.md` file
5. Save each page

### Method 2: Using Git (Advanced)

1. Enable Wiki in repository settings
2. Clone the wiki repository:
   ```bash
   git clone https://github.com/ross-sec/kokoro_mcp_server.wiki.git
   ```
3. Copy all `.md` files from this directory to the wiki repo:
   ```bash
   cp wiki/*.md kokoro_mcp_server.wiki/
   ```
4. Copy resources (images, logo):
   ```bash
   mkdir -p kokoro_mcp_server.wiki/resources/images
   cp -r resources/images/* kokoro_mcp_server.wiki/resources/images/
   ```
5. Commit and push:
   ```bash
   cd kokoro_mcp_server.wiki
   git add .
   git commit -m "Add comprehensive documentation with footer and sidebar"
   git push origin main
   ```

### Method 3: GitHub CLI

```bash
gh repo edit ross-sec/kokoro_mcp_server --enable-wiki
# Then use Method 1 or 2
```

## File Structure

Each markdown file is formatted for GitHub Wiki:
- Uses relative links between pages
- Follows GitHub Wiki naming conventions
- Compatible with GitHub Markdown

## Updating Documentation

When updating:
1. Edit the `.md` file in this directory
2. Upload to GitHub Wiki using one of the methods above
3. Update the main README.md if needed

## Notes

- GitHub Wiki has a separate git repository (`.wiki` suffix)
- Wiki pages can be edited via GitHub UI
- Internal links use wiki page names (spaces become hyphens)
- Images should be uploaded via GitHub Wiki interface

## Quick Upload Script

For convenience, here's a simple script to help with uploads:

```bash
#!/bin/bash
# upload-wiki.sh
# Enable wiki first: gh repo edit ross-sec/kokoro_mcp_server --enable-wiki

WIKI_REPO="kokoro_mcp_server.wiki"
git clone https://github.com/ross-sec/${WIKI_REPO}.git 2>/dev/null || cd $WIKI_REPO
cd $WIKI_REPO
cp ../wiki/*.md .
mkdir -p resources/images
cp -r ../resources/images/* resources/images/
git add .
git commit -m "Update wiki documentation with footer and sidebar"
git push origin main
```

## Automated Sync

The repository includes a GitHub Actions workflow (`.github/workflows/sync-wiki.yml`) that automatically syncs wiki files when changes are pushed to the main branch. This ensures your wiki stays up-to-date automatically!

