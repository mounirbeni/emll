import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Get messages for a specific conversation
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Verify user owns this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id }
        });

        if (!conversation || conversation.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// Send a message in a conversation
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { content } = await request.json();

        // Verify user owns this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id }
        });

        if (!conversation || conversation.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Block messages if conversation is closed
        if (conversation.status === 'CLOSED') {
            return NextResponse.json({
                error: 'This conversation has been closed by support. Please create a new ticket if you need further assistance.'
            }, { status: 403 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content,
                sender: 'USER',
                conversationId: id,
                userId: session.user.id as string
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
