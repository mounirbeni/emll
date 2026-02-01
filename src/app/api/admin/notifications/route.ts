/**
 * Admin Notifications API
 * GET - List all admin notifications
 * PATCH - Mark all as read
 * DELETE - Clear all notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminNotificationService } from '@/services/admin-notification.service';
import { AdminNotificationType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/notifications
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as AdminNotificationType | null;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const notifications = await adminNotificationService.getAll({
            type: type || undefined,
            limit,
            offset,
        });

        const unreadCount = await adminNotificationService.getUnreadCount();

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('[ADMIN_NOTIFICATIONS_GET]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/admin/notifications - Mark all as read
export async function PATCH() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const count = await adminNotificationService.markAllAsRead();

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('[ADMIN_NOTIFICATIONS_PATCH]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/notifications - Clear all notifications
export async function DELETE() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const count = await adminNotificationService.deleteAll();

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('[ADMIN_NOTIFICATIONS_DELETE]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
