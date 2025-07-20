export const DEFAULT_REFRESH_INTERVAL = 15_000; // 15 seconds

export const exponentialBackoff = (retries: number) => 
  Math.min(1000 * Math.pow(2, retries), 30000);