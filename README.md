# 🚀 ShellPanel AI - High-Performance Shell Command Explainer

<div align="center">

![Header Image](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000&auto=format&fit=crop)

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/AI_Powered_By-Groq_Llama_3.3-orange.svg?style=for-the-badge)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Demystify complex terminal commands with lightning-fast AI analysis.**

[Explore the Code](#-tech-stack) • [Quick Start](#-quick-start) • [Security](#-security-first)

</div>

---

## 🧠 Intelligence Engine

ShellPanel AI leverages **Groq** and the **Llama-3.3-70b-versatile** model to provide sub-second command analysis. It doesn't just tell you what a command does; it breaks down every flag, operator, and pipe with surgical precision.

### ✨ Key Features
- **Instant Breakdown**: Get a granular analysis of each token in your shell command.
- **Visual Mapping**: Interactive UI that highlights command structure.
- **Safety Safeguards**: Intelligent detection of destructive patterns (e.g., recursive deletions, dangerous flags).
- **Educational Context**: Direct links to manual pages and alternative examples.
- **Privacy-First Tracking**: High-performance local visitor tracking using IP hashing.

---

## 🎨 Professional UX

Designed for a premium experience, the interface features:
- **Glassmorphism UI**: Modern, translucent aesthetic with smooth transitions.
- **Dynamic Terminal**: Responsive command input that feels like a native environment.
- **Real-time Analytics**: Live visitor counter with zero-latency updates.
- **Dark Mode Optimization**: Hand-curated color palettes for deep focus.

---

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js**: 20.x or later
- **Groq API Key**: Obtain one at [console.groq.com](https://console.groq.com/)

### 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/ambaskaryash/shell-panel-aipowered.git
cd shell-panel-aipowered

# Install dependencies (cleaned and optimized)
pnpm install

# Configure Environment
cp .env.example .env.local
```

### 🔑 Environment Configuration
Edit your `.env` or `.env.local` file:

```env
GROQ_API_KEY=gsk_your_key_here
```

### 🏃 Running Locally

```bash
pnpm run dev
```
Navigate to `http://localhost:3000`.

---

## 🔧 API Reference

### `POST /api/explain`
Analyzes a submitted shell command.
**Body:** `{ "command": "tar -xzvf archive.tar.gz" }`

### `GET /api/visitors`
Fetches the current unique visitor count from the local data store.

---

## 🛡️ Security First

ShellPanel AI is built with safety as a core principle:
1. **No Execution**: The application never executes code on your machine.
2. **Regex Validation**: Blocks known highly-dangerous patterns before they reach the AI.
3. **Safety Warnings**: Clearly labels commands that modify the filesystem or system state.

---

## 📊 Project Architecture

```text
app/
├── api/             # High-performance API routes
│   └── explain/     # Groq-powered analysis engine
components/
├── ui/              # shadcn/ui shared components
└── explainer/       # Core visual analysis components
lib/                 # Modular utility functions
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Built with ❤️ by [ambaskaryash](https://github.com/ambaskaryash)

**⭐ Star the repo to show support!**

</div>
