'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { Notification, NotificationType } from '@prisma/client';
import { markNotificationRead } from '@/app/client/actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
    notification: Notification;
}

const notificationIconStyles: Record<NotificationType, string> = {
    BOOKING: 'bg-orange-100 text-orange-600',
    SUCCESS: 'bg-green-100 text-green-600',
    WARNING: 'bg-amber-100 text-amber-600',
    ERROR: 'bg-red-100 text-red-600',
    INFO: 'bg-gray-100 text-gray-600',
    REVIEW: 'bg-gray-100 text-gray-600',
};

export function NotificationItem({ notification }: NotificationItemProps) {
    const router = useRouter();
    const [isMarking, setIsMarking] = useState(false);
    const iconStyle = notificationIconStyles[notification.type] || 'bg-gray-100 text-gray-600';

    const handleMarkAsRead = async () => {
        setIsMarking(true);
        try {
            const result = await markNotificationRead(notification.id);
            if (result.success) {
                toast.success('Notification marked as read');
                router.refresh(); // Immediate UI refresh
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to mark notification as read');
        } finally {
            setIsMarking(false);
        }
    };

    return (
        <Card className={`${!notification.read ? 'border-l-4 border-l-[#FF5F00]' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                        <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {!notification.read && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAsRead}
                                    disabled={isMarking}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    {isMarking ? 'Marking...' : 'Mark as read'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function NotificationItemSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
