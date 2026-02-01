import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { notificationService } from '@/services/notification.service';
import { NotificationsClient } from './notifications-client';

export const dynamic = 'force-dynamic';

async function getUserNotifications(userId: string) {
    const notifications = await notificationService.getUserNotifications(userId);
    return notifications;
}

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const notifications = await getUserNotifications(session.user.id);

    return <NotificationsClient notifications={notifications} />;
}
