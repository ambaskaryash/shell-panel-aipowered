# 🚀 AI ShellPanel - AI-Powered Shell Command Analysis

[![Live Demo](https://img.shields.io/badge/Live-Demo-green.svg)](https://explainshell-prodapp.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Your AI-powered companion for understanding shell commands safely and effectively**

AI ShellPanel is an intelligent web application that provides detailed explanations and analysis of shell commands using cutting-edge AI technology. Built with Next.js and TypeScript, it helps developers understand complex Linux/Unix commands, learn shell scripting, and master terminal operations with confidence.

## ✨ Features

### 🧠 AI-Powered Intelligence
- **Real-time Command Analysis**: Get instant explanations for any shell command
- **Visual Command Breakdown**: Interactive visualization of command components
- **Educational Examples**: Learn with similar command examples and use cases

### 🔒 Security First
- **Malicious Command Detection**: Automatically blocks dangerous commands
- **Safety Warnings**: Clear alerts for potentially risky operations
- **Educational Focus**: Designed for learning, never executes actual commands

### 📊 Analytics & Tracking
- **Unique Visitor Counting**: IP-based tracking for accurate visitor statistics
- **Real-time Updates**: Live visitor counter in the footer
- **Privacy Compliant**: No personal data collection, only IP addresses for counting

### 🎨 Modern UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Interactive Terminal**: Clean, intuitive interface for command input
- **One-click Copying**: Easy sharing of command explanations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager
- Perplexity API key (for AI explanations)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/ambaskaryash/shell-panel-aipowered.git
cd shell-panel-aipowered

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Perplexity API key

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application running.

### Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
PERPLEXITY_API_KEY=your_perplexity_api_key_here
\`\`\`

## 🎯 Usage Examples

### Safe Commands
\`\`\`bash
ls -la                    # List files with detailed information
grep -r "pattern" .       # Search for text recursively
tar -xzvf archive.tar.gz  # Extract compressed archive
\`\`\`

### Commands with Warnings
\`\`\`bash
rm -rf /tmp/*            # Shows safety warning about deletion
sudo systemctl restart   # Warns about system changes
chmod 777 sensitive.txt  # Flags security implications
\`\`\`

## 🔧 API Endpoints

### Command Analysis
\`\`\`http
POST /api/explain
Content-Type: application/json

{
  "command": "tar -xzvf archive.tar.gz"
}
\`\`\`

### Visitor Statistics
\`\`\`http
GET /api/visitors
# Returns: {"uniqueVisitors": 42}

POST /api/visitors
# Registers new unique visitor (IP-based)
\`\`\`

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **AI Integration**: Perplexity API
- **Analytics**: Custom IP-based visitor tracking
- **Deployment**: Vercel (optimized)

## 📁 Project Structure

\`\`\`
shell-panel-aipowered/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── explain/       # Command analysis endpoint
│   │   └── visitors/      # Visitor tracking endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── visitor-counter.tsx # Visitor counter display
│   └── visual-command-explainer.tsx # Command visualization
├── lib/                  # Utility functions
│   ├── security.ts      # Command validation & security
│   └── visitor-counter.ts # Client-side visitor tracking
├── public/             # Static assets
└── visitor-data.json   # Server-side visitor storage
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ambaskaryash/shell-panel-aipowered)

## 🔒 Security Features

### Command Validation
- **Pattern Matching**: Detects dangerous command patterns
- **Blacklist Validation**: Blocks known malicious commands
- **Real-time Alerts**: Immediate warnings for risky commands

### Privacy Protection
- **No Personal Data**: Only IP addresses for unique counting
- **No Tracking Cookies**: Privacy-first approach
- **Transparent**: All tracking clearly disclosed

## 📊 Analytics

The application includes built-in analytics:
- **Unique Visitor Counting**: IP-based tracking for accurate statistics
- **Real-time Updates**: Live visitor counter in footer
- **Privacy Compliant**: No personal data collection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📚 Documentation

- **[Wiki](https://github.com/ambaskaryash/shell-panel-aipowered/wiki)**: Complete documentation and guides
- **[API Reference](https://github.com/ambaskaryash/shell-panel-aipowered/wiki/API-Documentation)**: Detailed API documentation
- **[Security Guide](https://github.com/ambaskaryash/shell-panel-aipowered/wiki/Security)**: Security features and best practices 

## 🐛 Bug Reports & Feature Requests

- **Issues**: [Report bugs here](https://github.com/ambaskaryash/shell-panel-aipowered/issues)
- **Discussions**: [Feature requests and questions](https://github.com/ambaskaryash/shell-panel-aipowered/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Perplexity AI**: For providing the AI explanation API
- **Next.js Team**: For the excellent framework
- **shadcn/ui**: For beautiful, accessible components
- **Contributors**: All amazing community contributors

---

**Built with ❤️ for the developer community**

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[![Live Demo](https://img.shields.io/badge/🚀_Try_Live_Demo-Click_Here-green?style=for-the-badge)](https://explainshell-prodapp.vercel.app/)

</div>
