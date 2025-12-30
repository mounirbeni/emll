
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { applyRateLimit, createRateLimitResponse, RATE_LIMITS } from '@/lib/middleware/rate-limiter';
import { errorResponse } from '@/lib/api-response';
import { UnauthorizedError } from '@/lib/errors';

export async function POST(request: Request) {
    try {
        // Apply strict rate limiting for auth endpoints (5 requests per minute)
        const { allowed, headers } = await applyRateLimit(request, RATE_LIMITS.auth);

        if (!allowed) {
            return createRateLimitResponse(headers);
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            const response = NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
            // Add rate limit headers even to error responses
            Object.entries(headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            return response;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password || !user.email || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // NOTE: This endpoint is for validation only
        // Actual authentication is handled by NextAuth via the auth provider
        // The client should use NextAuth's signIn() after successful validation here
        const response = NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });

        // Add rate limit headers to success response
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        return errorResponse(error);
    }
}
