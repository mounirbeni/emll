import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminSession() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });
    if (user?.role !== 'ADMIN') return null;
    return session;
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = await params;

        const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            select: { id: true, content: true, sender: true, createdAt: true },
        });

        // Mark user messages as read
        await prisma.message.updateMany({
            where: { conversationId, sender: 'USER', read: false },
            data: { read: true },
        });

        return NextResponse.json(
            messages.map((m) => ({
                id: m.id,
                content: m.content,
                sender: m.sender,
                createdAt: m.createdAt.toISOString(),
            }))
        );
    } catch (error) {
        console.error('[admin/messages GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = await params;
        const body = await request.json();
        const content: string = (body.content ?? '').trim();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                sender: 'ADMIN',
                conversationId,
                userId: session.user.id,
                read: true,
            },
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({
            id: message.id,
            content: message.content,
            sender: message.sender,
            createdAt: message.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('[admin/messages POST]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
