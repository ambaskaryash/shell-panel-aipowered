"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Terminal, Play, BookOpen, AlertTriangle, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { VisualCommandExplainer } from "@/components/visual-command-explainer"
import VisitorCounterDisplay from "@/components/visitor-counter"

interface CommandPart {
  text: string
  type: "command" | "option" | "argument" | "pipe" | "redirect" | "operator"
  explanation: string
  manPage?: string
}

interface AIExplanation {
  parts: CommandPart[]
  overall_explanation: string
  safety_notes?: string
  examples?: Array<{ command: string; description: string }>
}

export default function ShellExplainer() {
  const [command, setCommand] = useState("")
  const [parsedCommand, setParsedCommand] = useState<CommandPart[]>([])
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedExample, setSelectedExample] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const examples = [
    "tar -xzvf archive.tar.gz",
    'find . -type f -name "*.js" -exec grep -l "function" {} \\;',
    "ps aux | grep nginx | awk '{print $2}' | xargs kill",
    'ssh -i ~/.ssh/key.pem user@server "cd /var/www && git pull"',
    'curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' https://api.example.com',
    "docker run -d -p 8080:80 --name myapp nginx:latest",
    "sudo rm -rf /var/log/*",
    "chmod 755 script.sh && ./script.sh",
    "ls -la | grep \".txt\"",
    "find /var/log -name \"*.log\" -mtime -7",
    "ps aux | grep node | awk '{print $2}'",
    "tar -czf backup.tar.gz /home/user/documents",
    "grep -r \"pattern\" . --include=\"*.py\"",
    "git log --oneline -n 10",
  ]

  const analyzeCommand = async () => {
    if (!command.trim()) return

    setIsAnalyzing(true)
    setError(null)
    setAiExplanation(null)
    setParsedCommand([])

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: command.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze command")
      }

      const data: AIExplanation = await response.json()

      setAiExplanation(data)
      setParsedCommand(data.parts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the command")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setCommand(example)
    setSelectedExample(example)
    setError(null)
    setAiExplanation(null)
    setParsedCommand([])
    inputRef.current?.focus()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    if (command && command !== selectedExample) {
      const timeoutId = setTimeout(() => {
        analyzeCommand()
      }, 800) // Increased delay for AI processing
      return () => clearTimeout(timeoutId)
    }
  }, [command, selectedExample])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ai_shell_new_logo-6qoFC8RcqszdKAJ3XajSDAqgYvnPG8.png"
                  alt="AI ShellPanel"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">AI ShellPanel</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">AI-Powered Shell Command Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Shell Command Explainer & Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. 
            Perfect for learning Linux commands, bash scripting, and terminal usage.
          </p>
        </header>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar */}
          <aside className="xl:col-span-1 order-2 xl:order-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" />
                  Popular Commands
                </CardTitle>
                <CardDescription className="text-sm">Click any example to analyze it with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ScrollArea className="h-60 sm:h-80">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant={selectedExample === example ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-2 sm:p-3 mb-2"
                      onClick={() => handleExampleClick(example)}
                      title={`Analyze: ${example}`}
                    >
                      <code className="text-xs font-mono break-all">{example}</code>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Command Categories</CardTitle>
                <CardDescription className="text-sm">Learn by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <strong>File Operations:</strong> ls, cp, mv, rm, find, tar
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <strong>System Info:</strong> ps, top, df, du, free, uptime
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <strong>Network:</strong> curl, wget, netstat, ssh, scp
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <strong>Text Processing:</strong> grep, sed, awk, sort, uniq, wc
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6 order-1 xl:order-2">
            {/* Command Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Enter Shell Command</CardTitle>
                <CardDescription className="text-sm">
                  Type any shell command and our AI will provide detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="e.g., tar -xzvf archive.tar.gz"
                      className="pl-10 font-mono text-sm"
                      onKeyDown={(e) => e.key === "Enter" && analyzeCommand()}
                    />
                  </div>
                  <Button
                    onClick={analyzeCommand}
                    disabled={!command.trim() || isAnalyzing}
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {!process.env.NEXT_PUBLIC_PERPLEXITY_CONFIGURED && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      To enable AI-powered explanations, add your Perplexity API key as PERPLEXITY_API_KEY in your
                      environment variables.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* AI Command Analysis */}
            {aiExplanation && (
              <>
                <VisualCommandExplainer command={command} parts={parsedCommand} onCopy={copyToClipboard} />

                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Sparkles className="w-5 h-5" />
                        AI Command Analysis
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Safety Warning */}
                    {aiExplanation.safety_notes && (
                      <Alert className="mb-4 sm:mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Safety Note:</strong> {aiExplanation.safety_notes}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Overall Explanation */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">What This Command Does</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {aiExplanation.overall_explanation}
                      </p>
                    </div>

                    {/* Similar Examples */}
                    {aiExplanation.examples && aiExplanation.examples.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Similar Examples</h3>
                        <div className="space-y-2">
                          {aiExplanation.examples.map((example, index) => (
                            <div key={index} className="p-2 sm:p-3 bg-muted rounded-lg">
                              <code className="font-mono text-xs sm:text-sm block mb-1 break-all">
                                {example.command}
                              </code>
                              <p className="text-xs text-muted-foreground">{example.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Welcome Message */}
            {!aiExplanation && !command && !isAnalyzing && (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Terminal className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary absolute -top-1 -right-1" />
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to AI Shell Explainer</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-4">
                    Enter any shell command and our AI will provide comprehensive explanations, safety warnings, and
                    educational insights in real-time.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-4">
                    <Button onClick={() => handleExampleClick(examples[0])} className="w-full sm:w-auto">
                      <Play className="w-4 h-4 mr-2" />
                      Try Example
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-transparent"
                      onClick={() => window.open('https://github.com/ambaskaryash/shell-panel-aipowered/wiki', '_blank')}>  
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <section className="mt-12">
          <FAQ />
        </section>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            <strong>AI ShellPanel</strong> - Your AI-powered shell command companion. 
            Learn Linux commands, understand bash scripting, and master the terminal with confidence.
          </p>
          <p className="mt-2">
            Built with Next.js, TypeScript, and AI technology for developers, by developers.
          </p>
          <div className="mt-4">
            <VisitorCounterDisplay />
          </div>
        </footer>
      </div>
    </div>
  )
}

function FAQ() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div>
          <strong>Q: How accurate are the AI explanations?</strong><br/>
          A: The AI provides highly accurate explanations based on extensive training data, but always cross-reference with official documentation for critical operations.
        </div>
        <div>
          <strong>Q: Does this work with Windows PowerShell commands?</strong><br/>
          A: Currently optimized for Unix/Linux shell commands (bash, zsh, sh). PowerShell support is planned for future updates.
        </div>
        <div>
          <strong>Q: Are dangerous commands flagged?</strong><br/>
          A: Yes! The AI automatically identifies potentially destructive commands (like rm -rf) and provides prominent safety warnings.
        </div>
        <div>
          <strong>Q: Can I use this offline?</strong><br/>
          A: No, real-time AI analysis requires an internet connection to query the Perplexity API.
        </div>
      </CardContent>
    </Card>
  )
}
