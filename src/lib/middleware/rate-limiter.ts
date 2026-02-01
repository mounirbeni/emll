/**
 * Rate Limiter Middleware
 * Implements token bucket algorithm for rate limiting
 * Uses in-memory storage (can be upgraded to Redis for production)
 */

interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Maximum requests per window
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private store: Map<string, RateLimitEntry> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Cleanup expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    /**
     * Check if request should be rate limited
     */
    async checkLimit(
        identifier: string,
        config: RateLimitConfig
    ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
        const now = Date.now();
        const entry = this.store.get(identifier);

        // No entry or expired entry
        if (!entry || now > entry.resetTime) {
            const resetTime = now + config.windowMs;
            this.store.set(identifier, {
                count: 1,
                resetTime
            });
            return {
                allowed: true,
                remaining: config.maxRequests - 1,
                resetTime
            };
        }

        // Increment count
        entry.count++;

        // Check if limit exceeded
        if (entry.count > config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime
            };
        }

        return {
            allowed: true,
            remaining: config.maxRequests - entry.count,
            resetTime: entry.resetTime
        };
    }

    /**
     * Clean up expired entries
     */
    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.resetTime) {
                this.store.delete(key);
            }
        }
    }

    /**
     * Clear all entries (for testing)
     */
    clear() {
        this.store.clear();
    }

    /**
     * Destroy the rate limiter
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.store.clear();
    }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
    // Authentication endpoints - strict limits
    auth: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5
    },
    // API endpoints - moderate limits
    api: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100
    },
    // Public endpoints - relaxed limits
    public: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 1000
    }
};

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: Request): string {
    // Try to get IP from headers (works with proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier
    return 'unknown';
}

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimit(
    request: Request,
    config: RateLimitConfig = RATE_LIMITS.api
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
    const identifier = getClientIdentifier(request);
    const result = await rateLimiter.checkLimit(identifier, config);

    const headers: Record<string, string> = {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    if (!result.allowed) {
        headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
    }

    return {
        allowed: result.allowed,
        headers
    };
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(headers: Record<string, string>) {
    return new Response(
        JSON.stringify({
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests. Please try again later.',
            }
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }
    );
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
    handler: (request: Request) => Promise<Response>,
    config: RateLimitConfig = RATE_LIMITS.api
) {
    return async (request: Request): Promise<Response> => {
        const { allowed, headers } = await applyRateLimit(request, config);

        if (!allowed) {
            return createRateLimitResponse(headers);
        }

        // Call the handler and add rate limit headers to response
        const response = await handler(request);

        // Add rate limit headers to response
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    };
}

export { rateLimiter };
