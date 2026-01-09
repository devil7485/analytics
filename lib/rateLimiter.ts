/**
 * Simple in-memory rate limiter
 */
class RateLimiter {
  private requests: Map<string, number[]>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.requests = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if a request should be allowed
   */
  check(identifier: string): { allowed: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    let userRequests = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    userRequests = userRequests.filter((timestamp) => timestamp > windowStart);

    // Check if limit exceeded
    const allowed = userRequests.length < this.maxRequests;

    if (allowed) {
      userRequests.push(now);
      this.requests.set(identifier, userRequests);
    }

    const remaining = Math.max(0, this.maxRequests - userRequests.length);
    const reset = userRequests.length > 0 ? userRequests[0] + this.windowMs : now + this.windowMs;

    return { allowed, remaining, reset };
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clean up old requests
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    this.requests.forEach((timestamps, identifier) => {
      const filtered = timestamps.filter((ts) => ts > windowStart);
      if (filtered.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, filtered);
      }
    });
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10')
);

// Cleanup old requests every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    apiRateLimiter.cleanup();
  }, 60000);
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}
