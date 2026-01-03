import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/authorization';

export async function GET() {
    try {
        await requireAdmin();

        // Get all conversations with user info and messages
        const conversations = await prisma.conversation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format response
        const formattedConversations = conversations.map((conv) => {
            const unreadCount = conv.messages.filter((m) => m.sender === 'USER' && !m.read).length;
            const lastMessage = conv.messages[0];

            return {
                id: conv.id,
                subject: conv.subject,
                status: conv.status,
                userId: conv.userId,
                userName: conv.user.name,
                userEmail: conv.user.email,
                lastMessage: lastMessage?.content || '',
                lastMessageTime: conv.updatedAt,
                messageCount: conv.messages.length,
                unreadCount,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt
            };
        });

        return NextResponse.json(formattedConversations);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

