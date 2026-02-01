
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

/**
 * Authentication Utilities
 * 
 * IMPORTANT: This module provides low-level authentication utilities.
 * For user authentication, use NextAuth v5 (see @/auth.ts).
 * 
 * These utilities are for:
 * - Password hashing (used by NextAuth and user registration)
 * - JWT signing/verification (for potential API tokens or custom integrations)
 */

// JWT Secret - validate at runtime when needed, not at build time
const RAW_JWT_SECRET = process.env.JWT_SECRET || '';

function getEncodedJWTSecret(): Uint8Array {
    if (!RAW_JWT_SECRET) {
        throw new Error('❌ JWT_SECRET environment variable is required but not set.\nGenerate one with: openssl rand -base64 32');
    }
    return new TextEncoder().encode(RAW_JWT_SECRET);
}

/**
 * Hash password with bcrypt (12 rounds for production-grade security)
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
}

export interface UserPayload {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    [key: string]: unknown;
}

/**
 * Sign JWT token with 1 hour expiration
 * Use for API tokens or custom integrations, NOT for session management (use NextAuth)
 */
export async function signJWT(payload: UserPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(getEncodedJWTSecret());
}

/**
 * Verify JWT token
 * Use for API tokens or custom integrations, NOT for session management (use NextAuth)
 */
export async function verifyJWT(token: string): Promise<UserPayload> {
    try {
        const { payload } = await jwtVerify(token, getEncodedJWTSecret());
        return payload as UserPayload;
    } catch {
        throw new Error('Invalid or expired token');
    }
}
