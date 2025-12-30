/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */

export interface SecurityHeadersConfig {
    contentSecurityPolicy?: boolean;
    strictTransportSecurity?: boolean;
    xFrameOptions?: boolean;
    xContentTypeOptions?: boolean;
    referrerPolicy?: boolean;
    permissionsPolicy?: boolean;
}

/**
 * Default security headers configuration
 */
const DEFAULT_CONFIG: SecurityHeadersConfig = {
    contentSecurityPolicy: true,
    strictTransportSecurity: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true,
};

/**
 * Get security headers based on configuration
 */
export function getSecurityHeaders(
    config: SecurityHeadersConfig = DEFAULT_CONFIG
): Record<string, string> {
    const headers: Record<string, string> = {};

    // X-Frame-Options: Prevents clickjacking attacks
    if (config.xFrameOptions) {
        headers['X-Frame-Options'] = 'DENY';
    }

    // X-Content-Type-Options: Prevents MIME type sniffing
    if (config.xContentTypeOptions) {
        headers['X-Content-Type-Options'] = 'nosniff';
    }

    // Referrer-Policy: Controls referrer information
    if (config.referrerPolicy) {
        headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    }

    // Permissions-Policy: Controls browser features
    if (config.permissionsPolicy) {
        headers['Permissions-Policy'] =
            'camera=(), microphone=(), geolocation=(), interest-cohort=()';
    }

    // Strict-Transport-Security: Enforces HTTPS (only in production)
    if (config.strictTransportSecurity && process.env.NODE_ENV === 'production') {
        headers['Strict-Transport-Security'] =
            'max-age=31536000; includeSubDomains; preload';
    }

    // Content-Security-Policy: Prevents XSS and other injection attacks
    if (config.contentSecurityPolicy) {
        const cspDirectives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://accounts.google.com",
            "frame-src 'self' https://accounts.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests"
        ];

        headers['Content-Security-Policy'] = cspDirectives.join('; ');
    }

    return headers;
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(
    response: Response,
    config?: SecurityHeadersConfig
): Response {
    const headers = getSecurityHeaders(config);

    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

/**
 * Middleware wrapper to add security headers to API routes
 */
export function withSecurityHeaders(
    handler: (request: Request) => Promise<Response>,
    config?: SecurityHeadersConfig
) {
    return async (request: Request): Promise<Response> => {
        const response = await handler(request);
        return applySecurityHeaders(response, config);
    };
}

/**
 * CORS configuration
 */
export interface CORSConfig {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
}

/**
 * Default CORS configuration
 */
const DEFAULT_CORS_CONFIG: CORSConfig = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.NEXTAUTH_URL
        : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
    maxAge: 86400, // 24 hours
};

/**
 * Get CORS headers
 */
export function getCORSHeaders(
    request: Request,
    config: CORSConfig = DEFAULT_CORS_CONFIG
): Record<string, string> {
    const headers: Record<string, string> = {};
    const origin = request.headers.get('origin');

    // Access-Control-Allow-Origin
    if (config.origin) {
        if (Array.isArray(config.origin)) {
            if (origin && config.origin.includes(origin)) {
                headers['Access-Control-Allow-Origin'] = origin;
            }
        } else if (config.origin === '*') {
            headers['Access-Control-Allow-Origin'] = '*';
        } else if (origin === config.origin) {
            headers['Access-Control-Allow-Origin'] = origin;
        }
    }

    // Access-Control-Allow-Methods
    if (config.methods) {
        headers['Access-Control-Allow-Methods'] = config.methods.join(', ');
    }

    // Access-Control-Allow-Headers
    if (config.allowedHeaders) {
        headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
    }

    // Access-Control-Expose-Headers
    if (config.exposedHeaders) {
        headers['Access-Control-Expose-Headers'] = config.exposedHeaders.join(', ');
    }

    // Access-Control-Allow-Credentials
    if (config.credentials) {
        headers['Access-Control-Allow-Credentials'] = 'true';
    }

    // Access-Control-Max-Age
    if (config.maxAge) {
        headers['Access-Control-Max-Age'] = config.maxAge.toString();
    }

    return headers;
}

/**
 * Apply CORS headers to a response
 */
export function applyCORSHeaders(
    request: Request,
    response: Response,
    config?: CORSConfig
): Response {
    const headers = getCORSHeaders(request, config);

    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

/**
 * Handle OPTIONS preflight request
 */
export function handleCORSPreflight(
    request: Request,
    config?: CORSConfig
): Response {
    const headers = getCORSHeaders(request, config);

    return new Response(null, {
        status: 204,
        headers
    });
}
