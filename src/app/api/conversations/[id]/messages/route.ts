import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { safeJsonParse } from '@/lib/api-utils';
import { sanitizeString } from '@/lib/sanitize';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            throw new UnauthorizedError();
        }

        const { id: conversationId } = await params;
        const body = await safeJsonParse<{ content: string }>(request);
        
        if (!body.content || typeof body.content !== 'string') {
            throw new Error('Content is required');
        }

        // Sanitize content
        const content = sanitizeString(body.content);

        // Verify conversation ownership
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            throw new NotFoundError('Conversation', conversationId);
        }

        if (session.user.role !== 'ADMIN' && conversation.userId !== session.user.id) {
            throw new ForbiddenError();
        }

        const message = await prisma.message.create({
            data: {
                content,
                conversationId,
                userId: session.user.id as string,
                sender: session.user.role === 'ADMIN' ? 'ADMIN' : 'USER'
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return createdResponse(message);
    } catch (error) {
        return errorResponse(error);
    }
}
