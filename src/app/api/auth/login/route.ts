
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import { UnauthorizedError } from '@/lib/errors';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
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
        return NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });

    } catch (error) {
        return errorResponse(error);
    }
}
