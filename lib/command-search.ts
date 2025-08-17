export interface SearchFilters {
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  isFavorite?: boolean
  commandType?: string
  complexity?: 'simple' | 'moderate' | 'complex'
}

export interface SearchResult {
  command: string
  score: number
  highlights: {
    command?: number[]
    explanation?: number[]
  }
  metadata: {
    date: Date
    tags: string[]
    riskLevel: string
    complexity: string
  }
}

export class CommandSearchEngine {
  private commandIndex = new Map<string, Set<string>>()
  private tagIndex = new Map<string, Set<string>>()
  private dateIndex = new Map<string, Date>()

  indexCommand(id: string, command: string, explanation: string, tags: string[] = []) {
    // Index command words
    const commandWords = command.toLowerCase().split(/\s+/)
    commandWords.forEach(word => {
      if (!this.commandIndex.has(word)) {
        this.commandIndex.set(word, new Set())
      }
      this.commandIndex.get(word)!.add(id)
    })

    // Index explanation words
    const explanationWords = explanation.toLowerCase().split(/\s+/)
    explanationWords.forEach(word => {
      if (!this.commandIndex.has(word)) {
        this.commandIndex.set(word, new Set())
      }
      this.commandIndex.get(word)!.add(id)
    })

    // Index tags
    tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase()
      if (!this.tagIndex.has(normalizedTag)) {
        this.tagIndex.set(normalizedTag, new Set())
      }
      this.tagIndex.get(normalizedTag)!.add(id)
    })

    this.dateIndex.set(id, new Date())
  }

  search(
    query: string,
    filters: SearchFilters = {},
    limit: number = 50
  ): SearchResult[] {
    const results = new Map<string, number>()
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)

    // Score based on query matches
    queryWords.forEach(word => {
      const matchingIds = this.commandIndex.get(word) || new Set()
      matchingIds.forEach(id => {
        results.set(id, (results.get(id) || 0) + 1)
      })
    })

    // Convert to SearchResult format
    let searchResults: SearchResult[] = Array.from(results.entries()).map(([id, score]) => ({
      command: id, // This will be populated with actual command from storage
      score,
      highlights: {
        command: queryWords.map(word => word.length),
        explanation: []
      },
      metadata: {
        date: this.dateIndex.get(id) || new Date(),
        tags: [],
        riskLevel: 'low',
        complexity: 'simple'
      }
    }))

    // Apply filters
    searchResults = this.applyFilters(searchResults, filters)

    // Sort by score and date
    return searchResults
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score
        return b.metadata.date.getTime() - a.metadata.date.getTime()
      })
      .slice(0, limit)
  }

  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    return results.filter(result => {
      // Apply date range filter
      if (filters.dateRange) {
        const date = result.metadata.date
        if (date < filters.dateRange.start || date > filters.dateRange.end) {
          return false
        }
      }

      // Apply risk level filter
      if (filters.riskLevel && result.metadata.riskLevel !== filters.riskLevel) {
        return false
      }

      // Apply favorite filter
      if (filters.isFavorite !== undefined && !result.metadata.tags.includes('favorite')) {
        return false
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => 
          result.metadata.tags.includes(tag.toLowerCase())
        )
        if (!hasAllTags) return false
      }

      return true
    })
  }

  getPopularCommands(limit: number = 10): SearchResult[] {
    const commandFrequency = new Map<string, number>()
    
    this.commandIndex.forEach((ids, word) => {
      commandFrequency.set(word, ids.size)
    })

    return Array.from(commandFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([command, score]) => ({
        command,
        score,
        highlights: {},
        metadata: {
          date: new Date(),
          tags: ['popular'],
          riskLevel: 'low',
          complexity: 'simple'
        }
      }))
  }

  getRecentCommands(limit: number = 10): SearchResult[] {
    return Array.from(this.dateIndex.entries())
      .sort((a, b) => b[1].getTime() - a[1].getTime())
      .slice(0, limit)
      .map(([id, date]) => ({
        command: id,
        score: 1,
        highlights: {},
        metadata: {
          date,
          tags: ['recent'],
          riskLevel: 'low',
          complexity: 'simple'
        }
      }))
  }

  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return []

    const queryLower = query.toLowerCase()
    const suggestions = new Set<string>()

    // Find matching commands
    this.commandIndex.forEach((ids, word) => {
      if (word.startsWith(queryLower) && word !== queryLower) {
        suggestions.add(word)
      }
    })

    // Find similar commands
    this.commandIndex.forEach((ids, word) => {
      if (word.includes(queryLower) && word !== queryLower) {
        suggestions.add(word)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  clearIndex() {
    this.commandIndex.clear()
    this.tagIndex.clear()
    this.dateIndex.clear()
  }
}

export const commandSearchEngine = new CommandSearchEngine()

// Utility function to extract command type
export function getCommandType(command: string): string {
  const baseCommand = command.split(' ')[0].toLowerCase()
  
  const commandTypes: Record<string, string> = {
    'ls': 'file-listing',
    'find': 'search',
    'grep': 'text-search',
    'tar': 'archive',
    'git': 'version-control',
    'curl': 'network',
    'wget': 'network',
    'docker': 'container',
    'kubectl': 'kubernetes',
    'ps': 'process',
    'df': 'disk-usage',
    'chmod': 'permissions',
    'chown': 'ownership'
  }

  return commandTypes[baseCommand] || 'general'
}

// Utility function to assess command complexity
export function assessCommandComplexity(command: string): 'simple' | 'moderate' | 'complex' {
  const complexity = command.split(/\s+/).length
  const pipes = (command.match(/\|/g) || []).length
  const redirects = (command.match(/[<>]/g) || []).length

  const totalComplexity = complexity + pipes * 2 + redirects * 2

  if (totalComplexity <= 3) return 'simple'
  if (totalComplexity <= 6) return 'moderate'
  return 'complex'
}