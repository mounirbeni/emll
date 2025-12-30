
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const messages = await (prisma as any).message.findMany({
            where: { userId: session.user.id as string },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content } = await request.json();

        // Check if user is allowed to message
        const user = await (prisma as any).user.findUnique({
            where: { id: session.user.id as string },
            select: { canMessage: true, conversationStatus: true }
        });

        if (!user?.canMessage) {
            return NextResponse.json({
                error: 'This conversation has been closed by support. Please contact us through other channels if you need assistance.'
            }, { status: 403 });
        }

        // Check conversation status
        if (user.conversationStatus === 'CLOSED') {
            return NextResponse.json({
                error: 'This support ticket is closed. Please submit a new ticket if you need further assistance.'
            }, { status: 403 });
        }

        // If conversation is NONE, this is a new ticket submission
        const isNewTicket = user.conversationStatus === 'NONE';

        // Only allow messaging if conversation is OPEN or if it's a new ticket
        if (user.conversationStatus !== 'OPEN' && !isNewTicket) {
            return NextResponse.json({
                error: user.conversationStatus === 'CLOSED'
                    ? 'This support ticket is closed. Please submit a new ticket if you need further assistance.'
                    : 'Unable to send message at this time.'
            }, { status: 403 });
        }

        // Check for duplicate message (same content as last message)
        const recentMessages = await (prisma as any).message.findMany({
            where: {
                userId: session.user.id as string,
                sender: 'USER'
            },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

        if (recentMessages.length > 0 && recentMessages[0].content === content) {
            return NextResponse.json({
                error: 'You cannot send the same message twice. Please provide different details or wait for our response.'
            }, { status: 400 });
        }

        // Create user message
        const message = await (prisma as any).message.create({
            data: {
                content,
                sender: 'USER',
                userId: session.user.id as string,
            }
        });

        // Check if this is the first message in conversation (auto-acknowledge)
        const messageCount = await (prisma as any).message.count({
            where: { userId: session.user.id as string }
        });

        if (messageCount === 1) {
            // Set conversation to OPEN immediately (client can reply)
            await (prisma as any).user.update({
                where: { id: session.user.id as string },
                data: { conversationStatus: 'OPEN' }
            });

            // Send automatic acknowledgment
            await (prisma as any).message.create({
                data: {
                    content: "Thank you for submitting your support ticket. We've received your request and will respond as soon as possible. Feel free to add any additional information below.",
                    sender: 'ADMIN',
                    userId: session.user.id as string,
                    read: true
                }
            });
        }

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
