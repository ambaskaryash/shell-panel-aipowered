import React, { useMemo } from 'react'

interface SyntaxHighlighterProps {
  command: string
  className?: string
}

interface HighlightedPart {
  text: string
  type: 'command' | 'option' | 'argument' | 'pipe' | 'redirect' | 'operator' | 'text'
}

export function SyntaxHighlighter({ command, className }: SyntaxHighlighterProps) {
  const highlightedParts = useMemo(() => {
    if (!command.trim()) return []

    const parts: HighlightedPart[] = []
    const tokens = command.split(/(\s+)/)

    let isFirstCommand = true
    let inQuotes = false
    let quoteChar = ''
    let currentArg = ''

    const knownCommands = new Set([
      'grep', 'awk', 'sed', 'find', 'tar', 'git', 'curl', 'wget', 'ssh', 'scp', 'rsync',
      'docker', 'kubectl', 'npm', 'pip', 'apt', 'yum', 'systemctl', 'journalctl', 'ps',
      'kill', 'chmod', 'chown', 'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir',
      'cat', 'less', 'more', 'head', 'tail', 'sort', 'uniq', 'wc', 'diff', 'patch',
      'make', 'gcc', 'g++', 'python', 'node', 'java', 'go', 'rust', 'cargo'
    ])

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.trim() === '') {
        parts.push({ text: token, type: 'text' })
        continue
      }

      // Handle quoted strings
      if (!inQuotes && (token.startsWith('"') || token.startsWith("'"))) {
        inQuotes = true
        quoteChar = token[0]
        currentArg = token
        continue
      }

      if (inQuotes) {
        currentArg += (currentArg ? ' ' : '') + token
        if (token.includes(quoteChar)) {
          parts.push({ text: currentArg, type: 'argument' })
          currentArg = ''
          inQuotes = false
          quoteChar = ''
        }
        continue
      }

      // Handle pipes
      if (token === '|') {
        parts.push({ text: token, type: 'pipe' })
        isFirstCommand = true
        continue
      }

      // Handle redirections
      if (token.match(/^[<>&]\d*$/)) {
        parts.push({ text: token, type: 'redirect' })
        continue
      }

      if (token.match(/^[<>]+$/)) {
        parts.push({ text: token, type: 'redirect' })
        continue
      }

      // Handle options
      if (token.startsWith('-')) {
        parts.push({ text: token, type: 'option' })
        continue
      }

      // Handle commands (first token or after pipe)
      if (isFirstCommand && knownCommands.has(token)) {
        parts.push({ text: token, type: 'command' })
        isFirstCommand = false
        continue
      }

      // Handle operators
      if (token.match(/^&&|\|\||;|&$/)) {
        parts.push({ text: token, type: 'operator' })
        if (token === ';' || token === '&') isFirstCommand = true
        continue
      }

      // Handle URLs and file paths
      if (token.match(/^https?:\/\/[^\s]+$/)) {
        parts.push({ text: token, type: 'argument' })
        continue
      }

      if (token.match(/^(\/?[\w.-]+)+\/?$/)) {
        parts.push({ text: token, type: 'argument' })
        continue
      }

      // Default to argument
      parts.push({ text: token, type: 'argument' })
    }

    return parts
  }, [command])

  const getColorClass = (type: HighlightedPart['type']) => {
    switch (type) {
      case 'command':
        return 'text-blue-600 dark:text-blue-400 font-bold'
      case 'option':
        return 'text-green-600 dark:text-green-500'
      case 'argument':
        return 'text-orange-600 dark:text-orange-500'
      case 'pipe':
        return 'text-purple-600 dark:text-purple-500 font-bold'
      case 'redirect':
        return 'text-red-600 dark:text-red-500'
      case 'operator':
        return 'text-yellow-600 dark:text-yellow-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={`font-mono text-sm sm:text-base ${className} text-selectable`}>
      {highlightedParts.map((part, index) => (
        <span key={index} className={getColorClass(part.type)}>
          {part.text}
        </span>
      ))}
    </div>
  )
}
