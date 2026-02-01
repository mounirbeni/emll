import { prisma } from '@/lib/prisma';

export async function logEmail({
    userId,
    type,
    status,
    metadata
}: {
    userId?: string;
    type: string;
    status: 'SENT' | 'FAILED';
    metadata?: Record<string, unknown>;
}) {
    try {
        await prisma.emailLog.create({
            data: {
                userId,
                type,
                status,
                metadata: metadata ? JSON.stringify(metadata) : undefined
            }
        });
    } catch (error) {
        console.error('Failed to log email:', error);
    }
}
