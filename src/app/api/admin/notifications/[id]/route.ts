/**
 * Single Admin Notification API
 * PATCH - Mark as read
 * DELETE - Delete notification
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminNotificationService } from '@/services/admin-notification.service';

// PATCH /api/admin/notifications/[id] - Mark as read
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const notification = await adminNotificationService.markAsRead(id);

        return NextResponse.json({ success: true, notification });
    } catch (error) {
        console.error('[ADMIN_NOTIFICATION_PATCH]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/notifications/[id] - Delete notification
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await adminNotificationService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_NOTIFICATION_DELETE]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
