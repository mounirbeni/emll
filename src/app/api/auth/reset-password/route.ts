import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, password } = resetPasswordSchema.parse(body);

        // Verify token
        const verificationToken = await (prisma as any).verificationToken.findFirst({
            where: {
                token,
                expires: { gt: new Date() }
            }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update User
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword }
        });

        // Delete token
        await (prisma as any).verificationToken.deleteMany({
            where: { identifier: verificationToken.identifier }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
