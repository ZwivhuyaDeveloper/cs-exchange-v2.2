import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('Redis connected'));

export const cache = {
  get: async (key: string) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key: string, value: any, ttl: number = 3600) => {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  },
  del: async (key: string) => {
    await redis.del(key);
  },
  clearPattern: async (pattern: string) => {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  }
};

export default redis;