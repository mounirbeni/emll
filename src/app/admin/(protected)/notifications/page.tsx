import { auth } from "@/auth";
import { notificationService } from "@/services/notification.service";
import { NotificationsClient } from "./notifications-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const session = await auth();
    // Assuming requireAdmin middleware protects this, session.user exists.
    // If not, it returns null and we handle/error.
    if (!session?.user?.id) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">Unauthorized</h2>
            </div>
        );
    }

    const notifications = await notificationService.getUserNotifications(session.user.id);
    const unreadCount = await notificationService.getUnreadCount(session.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with system activity and alerts.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Notifications</CardTitle>
                        <CardDescription>
                            You have {unreadCount} unread notifications.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <NotificationsClient initialNotifications={notifications.map(n => ({ ...n, isRead: n.read }))} userId={session.user.id} />
                </CardContent>
            </Card>
        </div>
    );
}
