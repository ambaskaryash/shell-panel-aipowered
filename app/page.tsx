"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Terminal, Play, BookOpen, Shield, AlertTriangle, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { VisualCommandExplainer } from "@/components/visual-command-explainer"

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
  ]

  const analyzeCommand = async () => {
    if (!command.trim()) return

    setIsAnalyzing(true)
    setError(null)
    setAiExplanation(null)
    setParsedCommand([])

    try {
      console.log("[v0] Starting AI analysis for command:", command)

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
      console.log("[v0] Received AI response:", data)

      setAiExplanation(data)
      setParsedCommand(data.parts || [])
    } catch (err) {
      console.error("[v0] Error analyzing command:", err)
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
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Terminal className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">ShellPanel AI</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">AI-Powered Shell Command Explanation Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Safe Learning
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" />
                  Quick Examples
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
                    >
                      <code className="text-xs font-mono break-all">{example}</code>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

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
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to ShellExplain AI</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-4">
                    Enter any shell command and our AI will provide comprehensive explanations, safety warnings, and
                    educational insights in real-time.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-4">
                    <Button onClick={() => handleExampleClick(examples[0])} className="w-full sm:w-auto">
                      <Play className="w-4 h-4 mr-2" />
                      Try Example
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
