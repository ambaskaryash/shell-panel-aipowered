"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface CommandPart {
  text: string
  type: "command" | "option" | "argument" | "pipe" | "redirect" | "operator"
  explanation: string
  manPage?: string
}

interface VisualCommandExplainerProps {
  command: string
  parts: CommandPart[]
  onCopy: (text: string) => void
}

export function VisualCommandExplainer({ command, parts, onCopy }: VisualCommandExplainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [connections, setConnections] = useState<
    Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
    }>
  >([])

  const colors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ]

  useEffect(() => {
    if (!containerRef.current || parts.length === 0) return

    const updateConnections = () => {
      const container = containerRef.current
      if (!container) return

      const commandSpans = container.querySelectorAll("[data-command-part]")
      const explanationBoxes = container.querySelectorAll("[data-explanation-box]")

      const newConnections: typeof connections = []

      commandSpans.forEach((span, index) => {
        const box = explanationBoxes[index]
        if (!span || !box) return

        const spanRect = span.getBoundingClientRect()
        const boxRect = box.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        const x1 = spanRect.left + spanRect.width / 2 - containerRect.left
        const y1 = spanRect.bottom - containerRect.top + 5
        const x2 = boxRect.left + 15 - containerRect.left
        const y2 = boxRect.top + 15 - containerRect.top

        newConnections.push({
          x1,
          y1,
          x2,
          y2,
          color: colors[index % colors.length],
        })
      })

      setConnections(newConnections)
    }

    // Initial calculation
    setTimeout(updateConnections, 100)

    // Recalculate on window resize
    window.addEventListener("resize", updateConnections)
    return () => window.removeEventListener("resize", updateConnections)
  }, [parts])

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-100 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100">Visual Command Breakdown</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(command)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>

        <div ref={containerRef} className="relative">
          <div className="mb-12 p-6 bg-slate-950 rounded-lg border border-slate-700 font-mono">
            <div className="flex flex-wrap gap-2 text-base leading-relaxed">
              {parts.map((part, index) => (
                <span
                  key={index}
                  data-command-part={index}
                  className="px-3 py-2 rounded-md cursor-pointer transition-all hover:scale-105 font-medium"
                  style={{
                    backgroundColor: `${colors[index % colors.length]}15`,
                    border: `2px solid ${colors[index % colors.length]}40`,
                    color: colors[index % colors.length],
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </div>

          {/* SVG for connection lines */}
          <svg className="absolute inset-0 pointer-events-none w-full" style={{ height: "100%", zIndex: 1 }}>
            {connections.map((connection, index) => (
              <g key={index}>
                <path
                  d={`M ${connection.x1} ${connection.y1} 
                      C ${connection.x1} ${connection.y1 + 60} 
                        ${connection.x2 - 40} ${connection.y2 - 40} 
                        ${connection.x2} ${connection.y2}`}
                  stroke={connection.color}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.7"
                  strokeDasharray="none"
                />
                {/* Connection dot at command */}
                <circle cx={connection.x1} cy={connection.y1} r="5" fill={connection.color} opacity="0.9" />
                {/* Connection dot at explanation */}
                <circle cx={connection.x2} cy={connection.y2} r="5" fill={connection.color} opacity="0.9" />
              </g>
            ))}
          </svg>

          <div className="relative pt-8" style={{ zIndex: 2 }}>
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(parts.length, 3)}, 1fr)`,
                gridAutoRows: "min-content",
              }}
            >
              {parts.map((part, index) => (
                <div
                  key={index}
                  data-explanation-box={index}
                  className="bg-slate-800 border-2 rounded-lg p-5 relative shadow-lg"
                  style={{
                    borderColor: `${colors[index % colors.length]}60`,
                    gridColumn: index < 3 ? "auto" : `${(index % 3) + 1}`,
                    marginTop: index >= 3 ? "2rem" : "0",
                  }}
                >
                  <div
                    className="absolute -top-2 left-4 w-4 h-4 rounded-full border-2 border-slate-800"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <code
                        className="font-mono text-sm px-3 py-1.5 rounded-md font-semibold"
                        style={{
                          backgroundColor: `${colors[index % colors.length]}20`,
                          color: colors[index % colors.length],
                          border: `1px solid ${colors[index % colors.length]}40`,
                        }}
                      >
                        {part.text}
                      </code>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 bg-slate-700">
                        {part.type}
                      </Badge>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed font-medium">{part.explanation}</p>
                    {part.manPage && (
                      <div className="pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-500 font-mono">Manual: {part.manPage}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
