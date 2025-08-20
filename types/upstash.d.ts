declare module '@upstash/ratelimit' {
    import { Redis } from '@upstash/redis';

    export enum Algorithm {
        FixedWindow = 'fixed-window',
        SlidingWindow = 'sliding-window',
        TokenBucket = 'token-bucket',
    }

    export interface RatelimitConfig<TContext> {
        redis: Redis;
        limiter: Algorithm;
        tokens: number;
        window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;
        prefix?: string;
        ctx?: TContext;
    }

    export class Ratelimit<TContext> {
        constructor(config: RatelimitConfig<TContext>);
        public limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
    }
}
