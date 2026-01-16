/**
 * Standardized API Response Helpers
 * Provides consistent response formatting across all API routes
 */

import { NextResponse } from 'next/server';
import { formatErrorResponse } from './errors';

function serializeDecimals(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (typeof value === 'object') {
        if (value && 'toNumber' in value && typeof (value as Record<string, unknown>).toNumber === 'function') {
            return ((value as Record<string, unknown>).toNumber as () => unknown)();
        }

        if (Array.isArray(value)) {
            return value.map(serializeDecimals);
        }

        const obj = value as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj)) {
            out[k] = serializeDecimals(v);
        }
        return out;
    }

    return value;
}

/**
 * Success response with data
 */
export function successResponse<T>(data: T, statusCode = 200) {
    return NextResponse.json(serializeDecimals(data), { status: statusCode });
}

/**
 * Created response (201)
 */
export function createdResponse<T>(data: T) {
    return successResponse(data, 201);
}

/**
 * No content response (204)
 */
export function noContentResponse() {
    return new NextResponse(null, { status: 204 });
}

/**
 * Error response
 */
export function errorResponse(error: unknown) {
    const { statusCode, body } = formatErrorResponse(error);

    // Log error for monitoring (exclude validation errors)
    if (statusCode >= 500) {
        console.error('[API Error]', {
            statusCode,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
    }

    return NextResponse.json(body, { status: statusCode });
}

/**
 * Wrap async API handler with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<NextResponse>>(
    handler: T
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await handler(...args);
        } catch (error) {
            return errorResponse(error);
        }
    }) as T;
}

/**
 * Paginated response helper
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export function paginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
) {
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<T> = {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };

    return successResponse(response);
}
