import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const conversations = await prisma.conversation.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { content: true, createdAt: true },
                },
                _count: {
                    select: {
                        messages: { where: { read: false, sender: 'USER' } },
                    },
                },
            },
        });

        const result = conversations.map((conv) => ({
            id: conv.id,
            subject: conv.subject,
            status: conv.status,
            updatedAt: conv.updatedAt.toISOString(),
            lastMessage: conv.messages[0]?.content ?? '',
            lastMessageTime: (conv.messages[0]?.createdAt ?? conv.updatedAt).toISOString(),
            userName: conv.user.name ?? 'Unknown',
            userEmail: conv.user.email ?? '',
            unreadCount: conv._count.messages,
            userId: conv.user.id,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('[admin/conversations GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
