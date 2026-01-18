'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Notification } from '@prisma/client';
import { NotificationItem } from '@/components/dashboard/notification-item';
import { markAllNotificationsRead } from '@/app/client/actions';

interface NotificationsClientProps {
    notifications: Notification[];
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');
    const [markingAll, setMarkingAll] = useState(false);

    const filterNotifications = (filter: string) => {
        switch (filter) {
            case 'unread':
                return notifications.filter((n) => !n.read);
            case 'read':
                return notifications.filter((n) => n.read);
            default:
                return notifications;
        }
    };

    const handleMarkAllAsRead = async () => {
        setMarkingAll(true);
        try {
            const result = await markAllNotificationsRead();
            if (result.success) {
                toast.success(`Marked ${result.data.count} notifications as read`);
                router.refresh(); // Immediate UI refresh
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to mark all notifications as read');
        } finally {
            setMarkingAll(false);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                        Stay updated with your booking activities
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={markingAll}
                        className="rounded-xl"
                    >
                        {markingAll ? 'Marking...' : 'Mark all as read'}
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100/50 p-1 rounded-2xl">
                    <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#FF5F00]">
                        All ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#FF5F00]">
                        Unread ({notifications.filter((n) => !n.read).length})
                    </TabsTrigger>
                    <TabsTrigger value="read" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#FF5F00]">
                        Read ({notifications.filter((n) => n.read).length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filterNotifications(activeTab).length > 0 ? (
                        <div className="space-y-3">
                            {filterNotifications(activeTab).map((notification) => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No {activeTab} notifications
                                </h3>
                                <p className="text-gray-600">
                                    {activeTab === 'unread'
                                        ? "You're all caught up!"
                                        : 'No notifications to show'}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
