/**
 * Visitor counter utility for tracking total visits
 * Uses localStorage for persistence and provides API for incrementing
 */

interface VisitorStats {
  uniqueVisitors: number
  lastVisit: string
  firstVisit: string
}

class VisitorCounter {
  private static readonly STORAGE_KEY = 'ai-shellpanel-visits';
  private static readonly API_ENDPOINT = '/api/visitors';

  /**
   * Get current visitor statistics
   */
  static getStats(): VisitorStats {
    if (typeof window === 'undefined') {
      return {
        uniqueVisitors: 0,
        lastVisit: new Date().toISOString(),
        firstVisit: new Date().toISOString()
      };
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultStats();
      }
    }
    return this.getDefaultStats();
  }

  /**
   * Increment visitor count
   */
  static async incrementVisit(): Promise<number> {
    if (typeof window === 'undefined') return 0;

    const stats = this.getStats();
    const now = new Date().toISOString();
    
    // Check if this is a new session (more than 30 minutes since last visit)
    const lastVisit = new Date(stats.lastVisit);
    const currentTime = new Date(now);
    const timeDiff = currentTime.getTime() - lastVisit.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff > 30) {
      stats.uniqueVisitors += 1;
    }
    
    stats.lastVisit = now;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));

    return stats.uniqueVisitors;
  }

  /**
   * Get default statistics for new visitors
   */
  private static getDefaultStats(): VisitorStats {
    const now = new Date().toISOString();
    return {
      uniqueVisitors: 1,
      lastVisit: now,
      firstVisit: now
    };
  }

  /**
   * Format visitor count with appropriate suffix
   */
  static formatCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  /**
   * Reset visitor counter (for testing/debugging)
   */
  static reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default VisitorCounter;
export type { VisitorStats };