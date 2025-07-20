interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Rate limit configuration
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Clean up old entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < windowStart) {
      delete store[key];
    }
  });

  // Get or create entry for this IP
  if (!store[ip]) {
    store[ip] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  const entry = store[ip];

  // Check if we're in a new window
  if (entry.resetTime < now) {
    entry.count = 0;
    entry.resetTime = now + WINDOW_MS;
  }

  // Check rate limit
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime,
  };
} 