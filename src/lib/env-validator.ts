/**
 * Environment Variable Validator
 * Validates all required environment variables on application startup
 * Fails fast if any required variables are missing
 */

interface EnvConfig {
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';

    // Optional OAuth
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
}

/**
 * Validate required environment variables
 * Throws error if any required variable is missing or invalid
 */
export function validateEnv(): EnvConfig {
    const errors: string[] = [];

    // Required variables
    const required = {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
    };

    // Check for missing required variables
    Object.entries(required).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            errors.push(`Missing required environment variable: ${key}`);
        }
    });

    // Validate NEXTAUTH_SECRET strength (minimum 32 characters)
    if (required.NEXTAUTH_SECRET && required.NEXTAUTH_SECRET.length < 32) {
        errors.push('NEXTAUTH_SECRET must be at least 32 characters long');
    }

    // Validate DATABASE_URL format
    if (required.DATABASE_URL && !required.DATABASE_URL.startsWith('postgresql://')) {
        errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
    }

    // Validate NODE_ENV
    if (required.NODE_ENV && !['development', 'production', 'test'].includes(required.NODE_ENV)) {
        errors.push('NODE_ENV must be one of: development, production, test');
    }

    // Check OAuth configuration (both or neither)
    const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
    const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;

    if (hasGoogleClientId !== hasGoogleClientSecret) {
        errors.push('Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together');
    }

    // If there are errors, throw with detailed message
    if (errors.length > 0) {
        const errorMessage = [
            '❌ Environment Configuration Error:',
            '',
            ...errors.map(err => `  • ${err}`),
            '',
            'Please check your .env file and ensure all required variables are set.',
            'See .env.example for reference.',
        ].join('\n');

        throw new Error(errorMessage);
    }

    // Return validated config
    return {
        DATABASE_URL: required.DATABASE_URL!,
        NEXTAUTH_SECRET: required.NEXTAUTH_SECRET!,
        NEXTAUTH_URL: required.NEXTAUTH_URL!,
        NODE_ENV: required.NODE_ENV as 'development' | 'production' | 'test',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    };
}

/**
 * Get validated environment configuration
 * Call this once at application startup
 */
let envConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
    if (!envConfig) {
        envConfig = validateEnv();
    }
    return envConfig;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
    return getEnvConfig().NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
    return getEnvConfig().NODE_ENV === 'development';
}

/**
 * Check if OAuth is configured
 */
export function isOAuthEnabled(): boolean {
    const config = getEnvConfig();
    return !!(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET);
}
