import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { action } = await request.json();
        const { id: conversationId } = await params;

        if (!action || (action !== 'close' && action !== 'reopen')) {
            return NextResponse.json(
                { error: 'Invalid action. Must be "close" or "reopen"' },
                { status: 400 }
            );
        }

        // Update conversation status
        const updatedConversation = await (prisma as any).conversation.update({
            where: { id: conversationId },
            data: {
                status: action === 'close' ? 'CLOSED' : 'OPEN',
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            conversation: updatedConversation
        });
    } catch (error: any) {
        console.error('Close conversation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to update conversation status',
                details: error.message
            },
            { status: 500 }
        );
    }
}
