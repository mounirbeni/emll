import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await request.json();
        const action: 'close' | 'reopen' = body.action;

        if (action !== 'close' && action !== 'reopen') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({ where: { id } });
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const updated = await prisma.conversation.update({
            where: { id },
            data: { status: action === 'close' ? 'CLOSED' : 'OPEN' },
        });

        return NextResponse.json({ success: true, status: updated.status });
    } catch (error) {
        console.error('[admin/conversations/close PATCH]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
