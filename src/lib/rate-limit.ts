/**
 * Simple In-Memory Rate Limiter
 * Uses LRU Cache to store request counts.
 * Note: In a serverless/distributed environment (like Vercel Edge), 
 * this will only limit requests per instance/lambda. 
 * For distributed rate limiting, use Redis (e.g., Upstash).
 */

import { LRUCache } from 'lru-cache';

interface RateLimitConfig {
    uniqueTokenPerInterval?: number; // Max unique IPs to track
    interval?: number; // Window size in ms
    limit?: number; // Max requests per window
}

export function rateLimit(options?: RateLimitConfig) {
    const tokenCache = new LRUCache<string, number[]>({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = tokenCache.get(token) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage > limit;

                // In LRU cache 7+, items with TTL are removed automatically.
                // We just increment logic here effectively fixed window/usage.
                // Actually, simple counter with TTL is easier.

                if (isRateLimited) {
                    reject(new Error('Rate limit exceeded'));
                } else {
                    resolve();
                }
            }),
    };
}

/**
 * Advanced Rate Limiter with Sliding Window (Simplified for this use case)
 */
interface Options {
    interval: number
    uniqueTokenPerInterval?: number
}

export class RateLimiter {
    private tokenCache: LRUCache<string, number[]>

    constructor(options: Options) {
        this.tokenCache = new LRUCache({
            max: options.uniqueTokenPerInterval || 500,
            ttl: options.interval,
        })
    }

    check(limit: number, token: string): boolean {
        const tokenCount = this.tokenCache.get(token) || [0]
        if (tokenCount[0] === 0) {
            this.tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        return tokenCount[0] <= limit
    }
}
