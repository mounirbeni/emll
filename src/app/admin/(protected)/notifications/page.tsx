import { adminNotificationService } from "@/services/admin-notification.service";
import { AdminNotificationsClient } from "./notifications-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Local type definition matching Prisma schema
type AdminNotificationType = 'BOOKING' | 'CANCELLATION' | 'REVIEW' | 'MESSAGE' | 'SYSTEM' | 'ALERT';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ type?: string }>;
}

export default async function AdminNotificationsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const typeFilter = params.type as AdminNotificationType | undefined;

    const notifications = await adminNotificationService.getAll({
        type: typeFilter,
        limit: 100,
    });
    const unreadCount = await adminNotificationService.getUnreadCount();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Notifications</h1>
                <p className="text-muted-foreground">Track bookings, messages, and system alerts.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle>All Notifications</CardTitle>
                        <CardDescription>
                            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <AdminNotificationsClient
                        initialNotifications={notifications}
                        currentFilter={typeFilter}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
