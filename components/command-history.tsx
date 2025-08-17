'use client'

import { useState, useEffect } from 'react'
import { commandHistory, CommandHistoryItem } from '@/lib/command-history'
import { commandSearchEngine, SearchFilters } from '@/lib/command-search'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Star, Trash2, Clock, Tag, History, Filter, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CommandHistoryProps {
  onSelectCommand?: (command: CommandHistoryItem) => void
  className?: string
}

export function CommandHistory({ onSelectCommand, className }: CommandHistoryProps) {
  const [history, setHistory] = useState<CommandHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    // Extract all unique tags from history
    const tags = new Set<string>()
    history.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag))
    })
    setAllTags(Array.from(tags))
  }, [history])

  const loadHistory = () => {
    const allHistory = commandHistory.getHistory()
    setHistory(allHistory)
  }

  const handleToggleFavorite = (id: string) => {
    commandHistory.toggleFavorite(id)
    loadHistory()
  }

  const handleClearHistory = () => {
    commandHistory.clearHistory()
    loadHistory()
  }

  let filteredHistory = history

  if (searchQuery) {
    filteredHistory = commandHistory.searchHistory(searchQuery)
  } else {
    filteredHistory = activeTab === 'favorites' 
      ? commandHistory.getFavorites() 
      : history
  }

  const getDisplayItems = filteredHistory

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Command History
        </CardTitle>
        <CardDescription>
          View and manage your previously analyzed commands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search commands, tags, or explanations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Quick Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={activeTab === 'favorites' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(activeTab === 'favorites' ? 'all' : 'favorites')}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Favorites
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const recent = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        setFilters({ ...filters, dateRange: { start: recent, end: new Date() } })
                      }}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      This Week
                    </Button>
                  </div>
                </div>

                {allTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={filters.tags?.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTags = filters.tags?.includes(tag)
                              ? filters.tags.filter(t => t !== tag)
                              : [...(filters.tags || []), tag]
                            setFilters({ ...filters, tags: newTags })
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({})
                    setActiveTab('all')
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          <HistoryList items={getDisplayItems} onToggleFavorite={handleToggleFavorite} onSelect={onSelectCommand} />
        </div>
      </CardContent>
    </Card>
  )
}

interface HistoryListProps {
  items: CommandHistoryItem[]
  onToggleFavorite: (id: string) => void
  onSelect?: (command: CommandHistoryItem) => void
}

function HistoryList({ items, onToggleFavorite, onSelect }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No commands found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer touch-target"
            onClick={() => onSelect?.(item)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-selectable">
                    {item.command.length > 50 ? item.command.substring(0, 50) + '...' : item.command}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 touch-target p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(item.id)
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                    />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.overall_explanation}
                </p>

                {item.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}