/**
 * Idempotency Utilities
 * Prevent duplicate API operations using idempotency keys
 */

import { LRUCache } from 'lru-cache';

// Cache for storing processed idempotency keys
const idempotencyCache = new LRUCache<string, { response: unknown; timestamp: number }>({
    max: 1000,
    ttl: 1000 * 60 * 60, // 1 hour TTL
});

// In-flight requests to prevent race conditions
const inFlightRequests = new Map<string, Promise<unknown>>();

/**
 * Generate a unique idempotency key from request parameters
 */
export function generateIdempotencyKey(
    userId: string,
    action: string,
    params: Record<string, unknown>
): string {
    const paramsHash = JSON.stringify(params);
    return `${userId}:${action}:${Buffer.from(paramsHash).toString('base64').slice(0, 32)}`;
}

/**
 * Execute an operation with idempotency protection
 * Returns cached result if operation was already performed with same key
 */
export async function withIdempotency<T>(
    key: string,
    operation: () => Promise<T>
): Promise<{ result: T; fromCache: boolean }> {
    // Check cache first
    const cached = idempotencyCache.get(key);
    if (cached) {
        return { result: cached.response as T, fromCache: true };
    }

    // Check if request is already in flight
    const inFlight = inFlightRequests.get(key);
    if (inFlight) {
        const result = await inFlight;
        return { result: result as T, fromCache: true };
    }

    // Execute operation
    const promise = operation();
    inFlightRequests.set(key, promise);

    try {
        const result = await promise;
        idempotencyCache.set(key, { response: result, timestamp: Date.now() });
        return { result, fromCache: false };
    } finally {
        inFlightRequests.delete(key);
    }
}

/**
 * Decorator for API routes that require idempotency
 * Expects idempotency-key header
 */
export function extractIdempotencyKey(request: Request): string | null {
    return request.headers.get('x-idempotency-key') ||
        request.headers.get('idempotency-key');
}

/**
 * Check if a booking-like operation is a potential duplicate
 * Based on user, experience, date, and time window
 */
export function isDuplicateBookingAttempt(
    userId: string,
    experienceId: string,
    date: Date,
    windowMs = 5 * 60 * 1000 // 5 minutes
): boolean {
    const key = `booking:${userId}:${experienceId}:${date.toISOString().split('T')[0]}`;
    const existing = idempotencyCache.get(key);

    if (existing) {
        const timeSinceLastAttempt = Date.now() - existing.timestamp;
        return timeSinceLastAttempt < windowMs;
    }

    return false;
}

/**
 * Mark a booking attempt to prevent immediate duplicates
 */
export function markBookingAttempt(
    userId: string,
    experienceId: string,
    date: Date
): void {
    const key = `booking:${userId}:${experienceId}:${date.toISOString().split('T')[0]}`;
    idempotencyCache.set(key, { response: true, timestamp: Date.now() });
}
