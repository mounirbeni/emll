import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { safeJsonParse } from '@/lib/api-utils';
import { sanitizeString } from '@/lib/sanitize';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';
import { UnauthorizedError, BadRequestError, ForbiddenError } from '@/lib/errors';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            throw new UnauthorizedError();
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                userId: session.user.id as string,
                status: 'OPEN'
            },
            orderBy: { updatedAt: 'desc' }
        });

        if (!conversation) {
            return successResponse([]);
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' }
        });

        return successResponse(messages);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            throw new UnauthorizedError();
        }

        const body = await safeJsonParse<{ content: string }>(request);

        if (!body.content || typeof body.content !== 'string') {
            throw new BadRequestError('Content is required');
        }

        // Sanitize content
        const content = sanitizeString(body.content);

        // Check if user is allowed to message
        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: { canMessage: true, conversationStatus: true }
        });

        const conversationStatus = String(user?.conversationStatus ?? 'NONE');

        if (!user?.canMessage) {
            throw new ForbiddenError('This conversation has been closed by support. Please contact us through other channels if you need assistance.');
        }

        // Check conversation status
        if (conversationStatus === 'CLOSED') {
            throw new ForbiddenError('This support ticket is closed. Please submit a new ticket if you need further assistance.');
        }

        // If conversation is NONE, this is a new ticket submission
        const isNewTicket = conversationStatus === 'NONE';

        // Only allow messaging if conversation is OPEN or if it's a new ticket
        if (conversationStatus !== 'OPEN' && !isNewTicket) {
            throw new ForbiddenError(
                conversationStatus === 'CLOSED'
                    ? 'This support ticket is closed. Please submit a new ticket if you need further assistance.'
                    : 'Unable to send message at this time.'
            );
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
            throw new BadRequestError('You cannot send the same message twice. Please provide different details or wait for our response.');
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

        return createdResponse(message);
    } catch (error) {
        return errorResponse(error);
    }
}
