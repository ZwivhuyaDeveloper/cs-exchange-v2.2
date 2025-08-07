import { LRUCache } from 'lru-cache';
// Simple in-memory rate limiter using LRU cache


interface Options {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

interface RateLimitResult {
  isRateLimited: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
}

type TokenCount = [number];

// Define the LRU cache options type
interface LRUCacheOptions {
  max: number;
  ttl: number;
}

export default function rateLimit(options: Options = {}) {
  const max = options.uniqueTokenPerInterval || 60; // 60 requests per interval by default
  const windowMs = options.interval || 60000; // 1 minute by default

  // Initialize LRUCache with proper typing
  const tokenCache = new LRUCache<string, TokenCount>({
    max: max,
    ttl: windowMs,
    ttlAutopurge: true,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
  });

  return {
    check: (res: Response, limit: number, token: string): Promise<RateLimitResult> => {
      const now = Date.now();
      const key = `rate-limit:${token}`;
      
      // Get or initialize token count
      let tokenCount = tokenCache.get(key) || [0];
      
      // Reset count if window has passed
      if (tokenCount[0] === 0) {
        tokenCache.set(key, tokenCount, { ttl: windowMs });
      }
      
      // Increment the counter
      tokenCount[0] += 1;
      
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;
      const remaining = isRateLimited ? 0 : limit - currentUsage;
      
      // Set rate limit headers
      res.headers.set('X-RateLimit-Limit', String(limit));
      res.headers.set('X-RateLimit-Remaining', String(remaining));
      res.headers.set('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));
      
      if (isRateLimited) {
        const retryAfter = Math.ceil(windowMs / 1000);
        res.headers.set('Retry-After', String(retryAfter));
        return Promise.resolve({
          isRateLimited: true,
          currentUsage,
          limit,
          remaining: 0,
        });
      }
      
      return Promise.resolve({
        isRateLimited: false,
        currentUsage,
        limit,
        remaining,
      });
    },
  };
}
