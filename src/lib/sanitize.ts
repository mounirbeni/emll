/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks by sanitizing user inputs
 */

/**
 * Sanitize a string input by removing potentially dangerous characters
 * For display purposes only - does not prevent SQL injection (Prisma handles that)
 */
export function sanitizeString(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length to prevent DoS
    const MAX_LENGTH = 10000;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}

/**
 * Sanitize a search query string
 * Removes special regex characters that could be used for injection
 */
export function sanitizeSearchQuery(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove potentially dangerous regex characters
    // Note: Prisma's contains filter is safe, but we sanitize for extra safety
    let sanitized = input
        .replace(/[<>{}[\]\\^$|*+?.()]/g, '')
        .trim();

    // Limit length
    const MAX_LENGTH = 500;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Basic email sanitization (validation should be done separately)
    return input.trim().toLowerCase().substring(0, 255);
}

/**
 * Sanitize a phone number
 */
export function sanitizePhone(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove non-numeric characters except +, -, spaces, and parentheses
    return input.replace(/[^\d+\-() ]/g, '').trim().substring(0, 50);
}

/**
 * Sanitize an array of strings
 */
export function sanitizeStringArray(input: unknown): string[] {
    if (!Array.isArray(input)) {
        return [];
    }

    return input
        .filter((item): item is string => typeof item === 'string')
        .map(sanitizeString)
        .filter(str => str.length > 0);
}

/**
 * Sanitize a number (ensure it's a valid number)
 */
export function sanitizeNumber(input: unknown, defaultValue = 0, min?: number, max?: number): number {
    if (typeof input === 'number') {
        let value = input;
        if (min !== undefined && value < min) value = min;
        if (max !== undefined && value > max) value = max;
        return value;
    }

    if (typeof input === 'string') {
        const parsed = parseFloat(input);
        if (!isNaN(parsed)) {
            let value = parsed;
            if (min !== undefined && value < min) value = min;
            if (max !== undefined && value > max) value = max;
            return value;
        }
    }

    return defaultValue;
}

/**
 * Sanitize a URL
 */
export function sanitizeUrl(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Basic URL sanitization
    let sanitized = input.trim();

    // Ensure it starts with http:// or https://
    if (!sanitized.match(/^https?:\/\//i)) {
        sanitized = `https://${sanitized}`;
    }

    // Limit length
    const MAX_LENGTH = 2048;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}


/**
 * Helper to safely get a string query parameter from Request or URLSearchParams
 */
export function getQueryParam(requestOrParams: Request | URLSearchParams, key: string, defaultValue = ''): string {
    let searchParams: URLSearchParams;

    if (requestOrParams instanceof URLSearchParams) {
        searchParams = requestOrParams;
    } else {
        const url = new URL(requestOrParams.url);
        searchParams = url.searchParams;
    }

    const value = searchParams.get(key);
    return sanitizeString(value || defaultValue);
}

/**
 * Helper to safely get a number query parameter from Request or URLSearchParams
 */
export function getQueryParamNumber(
    requestOrParams: Request | URLSearchParams,
    key: string,
    defaultValue = 0,
    min?: number
): number {
    let searchParams: URLSearchParams;

    if (requestOrParams instanceof URLSearchParams) {
        searchParams = requestOrParams;
    } else {
        const url = new URL(requestOrParams.url);
        searchParams = url.searchParams;
    }

    const value = searchParams.get(key);
    if (!value) return defaultValue;

    return sanitizeNumber(value, defaultValue, min);
}

