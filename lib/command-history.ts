import { CommandPart } from "@/components/visual-command-explainer"

export interface CommandHistoryItem {
  id: string
  command: string
  parts: CommandPart[]
  overall_explanation: string
  safety_notes: string
  examples: Array<{ command: string; description: string }>
  timestamp: number
  isFavorite: boolean
  tags: string[]
}

class CommandHistoryManager {
  private readonly STORAGE_KEY = 'shell-panel-command-history'
  private readonly MAX_HISTORY = 100

  getHistory(): CommandHistoryItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load command history:', error)
      return []
    }
  }

  addCommand(item: Omit<CommandHistoryItem, 'id' | 'timestamp' | 'isFavorite' | 'tags'>): CommandHistoryItem {
    const history = this.getHistory()
    
    const newItem: CommandHistoryItem = {
      ...item,
      id: this.generateId(),
      timestamp: Date.now(),
      isFavorite: false,
      tags: []
    }

    // Remove duplicate commands
    const filteredHistory = history.filter(h => h.command !== item.command)
    
    // Add new command to beginning
    const updatedHistory = [newItem, ...filteredHistory].slice(0, this.MAX_HISTORY)
    
    this.saveHistory(updatedHistory)
    return newItem
  }

  toggleFavorite(id: string): boolean {
    const history = this.getHistory()
    const itemIndex = history.findIndex(h => h.id === id)
    
    if (itemIndex === -1) return false
    
    history[itemIndex].isFavorite = !history[itemIndex].isFavorite
    this.saveHistory(history)
    
    return history[itemIndex].isFavorite
  }

  addTag(id: string, tag: string): void {
    const history = this.getHistory()
    const item = history.find(h => h.id === id)
    
    if (item && !item.tags.includes(tag)) {
      item.tags.push(tag)
      this.saveHistory(history)
    }
  }

  removeTag(id: string, tag: string): void {
    const history = this.getHistory()
    const item = history.find(h => h.id === id)
    
    if (item) {
      item.tags = item.tags.filter(t => t !== tag)
      this.saveHistory(history)
    }
  }

  searchHistory(query: string): CommandHistoryItem[] {
    const history = this.getHistory()
    const lowercaseQuery = query.toLowerCase()
    
    return history.filter(item => 
      item.command.toLowerCase().includes(lowercaseQuery) ||
      item.overall_explanation.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  getFavorites(): CommandHistoryItem[] {
    return this.getHistory().filter(item => item.isFavorite)
  }

  filterByTags(tags: string[]): CommandHistoryItem[] {
    const history = this.getHistory()
    return history.filter(item => 
      tags.every(tag => item.tags?.includes(tag))
    )
  }

  getRecent(days: number = 7): CommandHistoryItem[] {
    const history = this.getHistory()
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return history.filter(item => new Date(item.timestamp) > cutoffDate)
  }

  clearHistory(): void {
    this.saveHistory([])
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  private saveHistory(history: CommandHistoryItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Failed to save command history:', error)
    }
  }
}

export const commandHistory = new CommandHistoryManager()
