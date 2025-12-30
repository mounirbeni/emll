/**
 * Custom Error Classes for Application
 * Provides standardized error handling across the application
 */

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            error: {
                code: this.code || this.name,
                message: this.message,
                ...(this.details ? { details: this.details } : {}),
            },
        };
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'You must be logged in to access this resource') {
        super(401, message, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'You do not have permission to access this resource') {
        super(403, message, 'FORBIDDEN');
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource', id?: string, customMessage?: string) {
        const message = customMessage || (id
            ? `${resource} with ID '${id}' not found`
            : `${resource} not found`);
        super(404, message, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(422, message, 'VALIDATION_ERROR', details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: unknown) {
        super(409, message, 'CONFLICT', details);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, details?: unknown) {
        super(400, message, 'BAD_REQUEST', details);
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'An internal server error occurred') {
        super(500, message, 'INTERNAL_SERVER_ERROR');
    }
}

/**
 * Check if error is an instance of AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown) {
    if (isAppError(error)) {
        return {
            statusCode: error.statusCode,
            body: error.toJSON(),
        };
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; meta?: unknown };

        if (prismaError.code === 'P2002') {
            return {
                statusCode: 409,
                body: {
                    error: {
                        code: 'CONFLICT',
                        message: 'A record with this value already exists',
                        details: prismaError.meta,
                    },
                },
            };
        }

        if (prismaError.code === 'P2025') {
            return {
                statusCode: 404,
                body: {
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Record not found',
                    },
                },
            };
        }
    }

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
        return {
            statusCode: 422,
            body: {
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: (error as { issues: unknown }).issues,
                },
            },
        };
    }

    // Generic error
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        statusCode: 500,
        body: {
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: isProduction ? 'An internal server error occurred' : message,
            },
        },
    };
}
