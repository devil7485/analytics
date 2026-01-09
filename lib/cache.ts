import { AnalysisSnapshot } from '@/types';

/**
 * Simple in-memory cache with TTL
 */
class CacheManager {
  private cache: Map<string, AnalysisSnapshot>;
  private defaultTTL: number;

  constructor(defaultTTLMinutes: number = 15) {
    this.cache = new Map();
    this.defaultTTL = defaultTTLMinutes * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Store analysis snapshot in cache
   */
  set(mint: string, snapshot: AnalysisSnapshot): void {
    this.cache.set(mint, snapshot);
  }

  /**
   * Retrieve analysis snapshot from cache
   * Returns null if not found or expired
   */
  get(mint: string): AnalysisSnapshot | null {
    const snapshot = this.cache.get(mint);

    if (!snapshot) {
      return null;
    }

    // Check if expired
    if (Date.now() > snapshot.expiresAt) {
      this.cache.delete(mint);
      return null;
    }

    return snapshot;
  }

  /**
   * Check if a mint is cached and not expired
   */
  has(mint: string): boolean {
    return this.get(mint) !== null;
  }

  /**
   * Delete a specific entry
   */
  delete(mint: string): boolean {
    return this.cache.delete(mint);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Calculate TTL based on trading activity
   * More active tokens = shorter TTL
   */
  calculateDynamicTTL(totalTrades: number): number {
    if (totalTrades > 1000) {
      return 5 * 60 * 1000; // 5 minutes for very active tokens
    } else if (totalTrades > 500) {
      return 10 * 60 * 1000; // 10 minutes
    } else if (totalTrades > 100) {
      return 15 * 60 * 1000; // 15 minutes
    } else {
      return 30 * 60 * 1000; // 30 minutes for less active tokens
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.cache.forEach((snapshot, mint) => {
      if (now > snapshot.expiresAt) {
        toDelete.push(mint);
      }
    });

    toDelete.forEach((mint) => this.cache.delete(mint));
  }
}

// Singleton instance
export const cacheManager = new CacheManager(15);

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  // Only run on server-side
  setInterval(() => {
    cacheManager.cleanup();
  }, 5 * 60 * 1000);
}
