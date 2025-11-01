# Contributing Guide

Thank you for your interest in contributing to the Kokoro TTS MCP Server!

## How to Contribute

### Reporting Bugs

1. Check if bug already reported in [Issues](https://github.com/ross-sec/kokoro_mcp_server/issues)
2. Create new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (OS, Node version, etc.)
   - Error logs if available

### Suggesting Features

1. Check existing [Discussions](https://github.com/ross-sec/kokoro_mcp_server/discussions)
2. Create feature request with:
   - Use case description
   - Proposed solution
   - Benefits/impact
   - Alternatives considered

### Code Contributions

1. Fork the repository
2. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make changes following [Development Guide](Development-Guide)
4. Test thoroughly
5. Update documentation
6. Commit with clear messages
7. Push and create Pull Request

## Development Setup

See [Development Guide](Development-Guide) for:
- Environment setup
- Building project
- Running tests
- Code structure

## Code Style

### TypeScript

- Use TypeScript strict mode
- Follow existing code style
- Add type annotations
- Avoid `any` types
- Use async/await for async code

### Formatting

- Use 2 spaces for indentation
- Trailing commas in objects/arrays
- Semicolons required
- Single quotes for strings

### Naming

- camelCase for variables/functions
- PascalCase for classes/interfaces
- UPPER_CASE for constants
- Descriptive names

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds successfully (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Description

Include:
- What changes were made
- Why (problem solved/feature added)
- How to test
- Screenshots/logs if applicable
- Related issues

### Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Address feedback
4. Approval and merge

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(tts): add speed control parameter
fix(audio): resolve playback issue on Windows
docs(readme): update installation instructions
```

## Code of Conduct

### Our Pledge

We aim to create a welcoming environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or personal attacks
- Publishing others' private information
- Other unprofessional conduct

## Areas for Contribution

### High Priority

- Performance improvements
- Additional voice support
- Better error messages
- Documentation improvements

### Medium Priority

- Unit tests
- Integration tests
- CI/CD improvements
- Examples and tutorials

### Low Priority

- UI improvements
- Additional output formats
- Language support

## Questions?

- Open a [Discussion](https://github.com/ross-sec/kokoro_mcp_server/discussions)
- Email: devops.ross@gmail.com
- Check existing [Issues](https://github.com/ross-sec/kokoro_mcp_server/issues)

## Recognition

Contributors will be:
- Listed in project README
- Mentioned in release notes
- Credited in commit history

Thank you for contributing! 🎉

