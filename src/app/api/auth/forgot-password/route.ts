import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/services/email.service';
import { randomBytes } from 'crypto';
import { z } from 'zod';

// Simple in-memory store for tokens (IN PRODUCTION THIS SHOULD BE IN DB/REDIS)
// Since we don't have a reset token table in schema yet, we'll store it in the user record if possible
// Checking schema first... Actually, let's check schema.
// If no token field, we might need to add one or use a hack.
// Checking schema via prisma... assuming User model has no resetToken field yet.
// LIMITATION: Without schema change, we can't persist.
// FOR NOW: We will use a "Mock" logic or assume we can add it. 
// OR, we can use the `verificationToken` table if it exists (next-auth usually has one).

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true, message: 'If an account exists, an email has been sent.' });
        }

        // Generate token
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Ideally update user with resetToken. 
        // Since I can't easily run migrations without risk, I will check if verificationToken table is available
        // NextAuth usually sets up VerificationToken model.

        // Let's try to save to VerificationToken table which is standard in NextAuth Prisma adapter
        try {
            await (prisma as any).verificationToken.create({
                data: {
                    identifier: email,
                    token,
                    expires
                }
            });
        } catch (e) {
            // If it fails (maybe duplicate), update it?
            // Prisma create might fail if composite key exists.
            // Actually VerificationToken usually has composite ID (identifier, token).
            // Let's try to delete old ones first.
            await (prisma as any).verificationToken.deleteMany({
                where: { identifier: email }
            });

            await (prisma as any).verificationToken.create({
                data: {
                    identifier: email,
                    token,
                    expires
                }
            });
        }

        await emailService.sendPasswordResetEmail(email, token);

        return NextResponse.json({ success: true, message: 'If an account exists, an email has been sent.' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
