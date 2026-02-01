/**
 * API Route Utilities
 * Common utilities for API route handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { errorResponse } from './api-response';
import { BadRequestError } from './errors';

/**
 * Safely parse JSON from request body
 * Handles errors gracefully and prevents crashes
 */
export async function safeJsonParse<T = unknown>(request: NextRequest | Request): Promise<T> {
    try {
        const text = await request.text();
        
        if (!text || text.trim().length === 0) {
            throw new BadRequestError('Request body is required');
        }

        // Limit body size to prevent DoS
        const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10MB
        if (text.length > MAX_BODY_SIZE) {
            throw new BadRequestError('Request body too large');
        }

        return JSON.parse(text) as T;
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        
        if (error instanceof SyntaxError) {
            throw new BadRequestError('Invalid JSON in request body');
        }

        throw new BadRequestError('Failed to parse request body');
    }
}

/**
 * Get query parameter as string
 */
export function getQueryParam(request: NextRequest | Request, key: string): string | undefined {
    const url = new URL(request.url);
    return url.searchParams.get(key) || undefined;
}

/**
 * Get query parameter as number
 */
export function getQueryParamNumber(
    request: NextRequest | Request,
    key: string,
    defaultValue?: number,
    min?: number,
    max?: number
): number {
    const value = getQueryParam(request, key);
    if (!value) {
        return defaultValue ?? 0;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
        return defaultValue ?? 0;
    }

    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;

    return num;
}

/**
 * Get query parameter as boolean
 */
export function getQueryParamBoolean(request: NextRequest | Request, key: string, defaultValue = false): boolean {
    const value = getQueryParam(request, key);
    if (!value) {
        return defaultValue;
    }

    return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Validate request body with Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
    const result = schema.safeParse(body);
    
    if (!result.success) {
        throw new BadRequestError('Validation failed', result.error.issues);
    }

    return result.data;
}

/**
 * Wrap API handler with common error handling and JSON parsing
 */
export function createApiHandler<T = unknown>(
    handler: (req: NextRequest, body: T, params?: unknown) => Promise<NextResponse>,
    options?: {
        requireBody?: boolean;
        bodySchema?: z.ZodSchema<T>;
    }
) {
    return async (request: NextRequest, context?: { params?: Promise<unknown> }) => {
        try {
            let body: T | undefined;

            // Parse body if needed
            if (options?.requireBody || options?.bodySchema) {
                const rawBody = await safeJsonParse(request);
                
                if (options?.bodySchema) {
                    body = validateBody(options.bodySchema, rawBody);
                } else {
                    body = rawBody as T;
                }
            }

            const params = context?.params ? await context.params : undefined;

            return await handler(request, body!, params);
        } catch (error) {
            return errorResponse(error);
        }
    };
}

/**
 * Get pagination parameters from query string
 */
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export function getPagination(request: NextRequest | Request, defaultLimit = 10, maxLimit = 100): PaginationParams {
    const page = getQueryParamNumber(request, 'page', 1, 1);
    const limit = Math.min(getQueryParamNumber(request, 'limit', defaultLimit, 1), maxLimit);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}
