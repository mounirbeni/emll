
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const conversation = await prisma.conversation.findFirst({
            where: {
                userId: session.user.id as string,
                status: 'OPEN'
            },
            orderBy: { updatedAt: 'desc' }
        });

        if (!conversation) {
            return NextResponse.json([]);
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: conversation.id },
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

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Content required' }, { status: 400 });
        }

        // Check if user is allowed to message
        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: { canMessage: true, conversationStatus: true }
        });

        const conversationStatus = String(user?.conversationStatus ?? 'NONE');

        if (!user?.canMessage) {
            return NextResponse.json({
                error: 'This conversation has been closed by support. Please contact us through other channels if you need assistance.'
            }, { status: 403 });
        }

        // Check conversation status
        if (conversationStatus === 'CLOSED') {
            return NextResponse.json({
                error: 'This support ticket is closed. Please submit a new ticket if you need further assistance.'
            }, { status: 403 });
        }

        // If conversation is NONE, this is a new ticket submission
        const isNewTicket = conversationStatus === 'NONE';

        // Only allow messaging if conversation is OPEN or if it's a new ticket
        if (conversationStatus !== 'OPEN' && !isNewTicket) {
            return NextResponse.json({
                error: conversationStatus === 'CLOSED'
                    ? 'This support ticket is closed. Please submit a new ticket if you need further assistance.'
                    : 'Unable to send message at this time.'
            }, { status: 403 });
        }

        // Find the most recent open conversation for this user
        let conversation = await prisma.conversation.findFirst({
            where: {
                userId: session.user.id as string,
                status: 'OPEN'
            },
            orderBy: { updatedAt: 'desc' }
        });

        // If there is no open conversation, create one
        const createdNewConversation = !conversation;
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    subject: 'Support Ticket',
                    userId: session.user.id as string,
                    status: 'OPEN'
                }
            });

            await prisma.user.update({
                where: { id: session.user.id as string },
                data: { conversationStatus: 'OPEN' }
            });
        }

        // Check for duplicate message (same content as last message)
        const lastUserMessage = await prisma.message.findFirst({
            where: {
                conversationId: conversation.id,
                sender: 'USER'
            },
            orderBy: { createdAt: 'desc' }
        });

        if (lastUserMessage && lastUserMessage.content === content) {
            return NextResponse.json({
                error: 'You cannot send the same message twice. Please provide different details or wait for our response.'
            }, { status: 400 });
        }

        // Create user message
        const message = await prisma.message.create({
            data: {
                content,
                sender: 'USER',
                userId: session.user.id as string,
                conversationId: conversation.id,
            }
        });

        // Send automatic acknowledgment on new ticket creation
        if (createdNewConversation) {
            await prisma.message.create({
                data: {
                    content: "Thank you for submitting your support ticket. We've received your request and will respond as soon as possible. Feel free to add any additional information below.",
                    sender: 'ADMIN',
                    userId: session.user.id as string,
                    conversationId: conversation.id,
                    read: true
                }
            });
        }

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
