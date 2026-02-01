import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const logs = await prisma.emailLog.findMany({
            take: limit,
            orderBy: { sentAt: 'desc' },
            // We might want to include User info if linked
            // But EmailLog schema has `userId` strictly as string maybe?
            // Let's check schema.
            // model EmailLog { userId String? ... }
            // We didn't add relation to User in EmailLog model in Step 55.
            // It was just `userId String?`.
            // So we can't `include: { user: true }` unless we add relation.
            // For now, just return logs. Frontend can fetch user if needed or we just show userId/email from metadata.
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch email logs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
