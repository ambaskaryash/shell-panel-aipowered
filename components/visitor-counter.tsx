"use client"

import { useState, useEffect } from "react"
import VisitorCounter from "@/lib/visitor-counter"
import { Users } from "lucide-react"

export default function VisitorCounterDisplay() {
  const [visitorCount, setVisitorCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeCounter = async () => {
      try {
        // Get unique visitor count from server
        const response = await fetch("/api/visitors")
        if (response.ok) {
          const serverData = await response.json()
          setVisitorCount(serverData.uniqueVisitors)
        }
        
        // Register this visit (IP-based)
        await fetch('/api/visitors', { method: 'POST' })
        
        // Refresh count after registration
        const updatedResponse = await fetch("/api/visitors")
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setVisitorCount(updatedData.uniqueVisitors)
        }
      } catch (error) {
        // Fallback to localStorage only if server fails
        const stats = VisitorCounter.getStats()
        setVisitorCount(stats.uniqueVisitors)
      } finally {
        setLoading(false)
      }
    }

    initializeCounter()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Loading visits...</span>
      </div>
    )
  }

  const formattedCount = VisitorCounter.formatCount(visitorCount)

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="w-4 h-4" />
      <span>
        {visitorCount === 1 
          ? "1 unique visitor" 
          : `${formattedCount} unique visitors`
        } served
      </span>
    </div>
  )
}
