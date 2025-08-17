# AI ShellPanel - Wiki

Welcome to the AI ShellPanel wiki! This comprehensive guide covers everything you need to know about the AI-powered shell command analysis and explainer tool.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

AI ShellPanel is an intelligent web application that provides detailed explanations and analysis of shell commands using AI technology. Built with Next.js and TypeScript, it helps developers understand complex Linux/Unix commands, learn shell scripting, and master terminal operations with confidence.

**Live Demo**: [https://explainshell-prodapp.vercel.app/](https://explainshell-prodapp.vercel.app/)

## ✨ Features

### Core Features
- **AI-Powered Command Analysis**: Real-time explanations of shell commands
- **Visual Command Breakdown**: Interactive visualization of command components
- **Safety Warnings**: Automatic detection of potentially dangerous commands
- **Educational Examples**: Similar command examples with descriptions
- **Interactive Terminal**: Clean, responsive interface for command input

### Security Features
- **Command Validation**: Blocks malicious commands before execution
- **Pattern Matching**: Detects dangerous operations (rm -rf, destructive commands)
- **Real-time Security Alerts**: Immediate warnings for risky commands
- **Educational Focus**: Designed for learning, not actual command execution

### Analytics Features
- **Unique Visitor Tracking**: IP-based unique visitor counting
- **Real-time Statistics**: Live visitor count display
- **Persistent Storage**: Maintains visitor data across sessions
- **Privacy Compliant**: No personal data collection, only IP addresses for counting

### User Experience
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Copy Functionality**: One-click copying of command explanations
- **Example Commands**: Pre-loaded safe examples for exploration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager
- Perplexity API key (for AI explanations)

### Quick Start
\`\`\`bash
# Clone the repository
git clone https://github.com/ambaskaryash/shell-panel-aipowered.git
cd shell-panel-aipowered

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Perplexity API key to .env.local
# PERPLEXITY_API_KEY=your_api_key_here

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application running.

## 🔧 Installation

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/ambaskaryash/shell-panel-aipowered.git
   cd shell-panel-aipowered
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

### Production Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Other Platforms
- **Netlify**: Use the Next.js build configuration
- **Railway**: Connect GitHub repo and add environment variables
- **Self-hosted**: Use `npm run build` and `npm start`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | API key for AI command explanations | Yes |
| `NEXT_PUBLIC_VERCEL_URL` | Auto-set by Vercel for production | No |


## 📖 Usage

### Basic Usage
1. **Enter a command**: Type any shell command in the input field
2. **Get explanation**: Click "Analyze" to get AI-powered explanation
3. **Learn safely**: Review safety warnings and educational examples
4. **Copy insights**: Use the copy button to save explanations

### Example Commands

#### Safe Examples
- `ls -la` - List files with details
- `grep -r "pattern" .` - Search for text recursively
- `tar -xzvf archive.tar.gz` - Extract compressed archive

#### Commands with Warnings
- `rm -rf /tmp/*` - Shows safety warning about deletion
- `sudo systemctl restart` - Warns about system changes
- `chmod 777 sensitive.txt` - Flags security implications

### Understanding the Output

The AI provides:
- **Overall explanation**: What the command does
- **Component breakdown**: Each flag and parameter
- **Safety notes**: Potential risks and warnings
- **Similar examples**: Related commands for learning

## 🔌 API Documentation

### Endpoints

#### POST /api/explain
Explain a shell command using AI.

**Request:**
\`\`\`json
{
  "command": "tar -xzvf archive.tar.gz"
}
\`\`\`

**Response:**
\`\`\`json
{
  "overall_explanation": "Extracts files from a gzip-compressed tar archive...",
  "component_breakdown": [
    {
      "component": "tar",
      "description": "Archive utility for creating/extracting tar archives"
    }
  ],
  "safety_notes": "This command is safe for extracting archives",
  "examples": [...]
}
\`\`\`

#### GET /api/visitors
Get the current unique visitor count.

**Response:**
\`\`\`json
{
  "uniqueVisitors": 42
}
\`\`\`

#### POST /api/visitors
Register a new unique visitor (IP-based).

**Response:**
\`\`\`json
{
  "uniqueVisitors": 43
}
\`\`\`

## 🔒 Security

### Command Validation
The application implements multi-layer security:

1. **Pattern Matching**: Detects dangerous command patterns
2. **Blacklist Validation**: Blocks known malicious commands
3. **Educational Focus**: Never executes actual commands
4. **Input Sanitization**: Prevents injection attacks

### Security Categories
- **File Operations**: rm, chmod, chown with warnings
- **System Commands**: shutdown, reboot, systemctl
- **Network Tools**: nmap, netcat, suspicious network commands
- **Data Destruction**: dd, mkfs, fdisk

### Privacy
- **No Personal Data**: Only IP addresses for unique counting
- **No Tracking**: No cookies or persistent tracking
- **Transparent**: All tracking is clearly disclosed

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Add `PERPLEXITY_API_KEY`
3. **Deploy**: Automatic deployment on push to main

### Environment-Specific Configuration

#### Production
\`\`\`bash
npm run build
npm start
\`\`\`

#### Development
\`\`\`bash
npm run dev
\`\`\`

#### Testing
\`\`\`bash
npm run test
npm run lint
\`\`\`

### Performance Optimization
- **Static Generation**: Optimized for Next.js static generation
- **Image Optimization**: Automatic image optimization
- **Bundle Splitting**: Code splitting for faster loads
- **CDN Ready**: Optimized for CDN deployment

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript best practices
2. **Testing**: Add tests for new features
3. **Documentation**: Update wiki for changes
4. **Security**: Always validate user input

### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Reporting Issues
- **Bug Reports**: Use GitHub Issues with reproduction steps
- **Feature Requests**: Use GitHub Discussions
- **Security Issues**: Email directly for sensitive issues

## 🔧 Troubleshooting

### Common Issues

#### API Key Not Working
- Verify Perplexity API key is valid
- Check environment variable name matches exactly
- Ensure API key has proper permissions

#### Build Failures
- Clear `.next` directory: `rm -rf .next`
- Update dependencies: `npm update`
- Check Node.js version compatibility

#### Visitor Counter Not Updating
- Check file permissions for `visitor-data.json`
- Verify API endpoints are accessible
- Check browser console for errors

### Debug Mode
Enable debug logging by setting:
\`\`\`bash
DEBUG=shell-panel:* npm run dev
\`\`\`

### Support
- **GitHub Issues**: [Report bugs here](https://github.com/yourusername/shell-panel-aipowered/issues)
- **Discussions**: [Ask questions](https://github.com/yourusername/shell-panel-aipowered/discussions)
- **Wiki**: [Full documentation](https://github.com/yourusername/shell-panel-aipowered/wiki)

## 📊 Analytics

### Visitor Statistics
The application tracks unique visitors using IP-based counting:
- **Unique IPs**: Each unique IP address counts as one visitor
- **Real-time Updates**: Counter updates immediately on new visits
- **Privacy Compliant**: No personal data collection
- **Persistent Storage**: Data survives server restarts

### Performance Metrics
- **Load Time**: < 3 seconds on good connections
- **API Response**: < 2 seconds for AI explanations
- **Mobile Performance**: Optimized for mobile devices

## 📝 Changelog

### v1.0.0 (Current)
- AI-powered command explanations
- Security validation and warnings
- Unique visitor tracking
- Responsive design
- Dark/light mode support

### Roadmap
- [ ] PowerShell command support
- [ ] Command history
- [ ] User accounts and favorites
- [ ] Advanced filtering options
- [ ] Multi-language support

## 🙏 Acknowledgments

- **Perplexity AI**: For providing the AI explanation API
- **Next.js Team**: For the excellent framework
- **Contributors**: All community contributors
- **Users**: Everyone using and providing feedback

---

**Built with ❤️ for the developer community**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/yourusername/shell-panel-aipowered).
