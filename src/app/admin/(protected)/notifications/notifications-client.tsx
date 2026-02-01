'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, ExternalLink, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { SwipeableNotificationItem } from "./swipeable-item";

// Local type definitions matching Prisma schema
type AdminNotificationType = 'BOOKING' | 'CANCELLATION' | 'REVIEW' | 'MESSAGE' | 'SYSTEM' | 'ALERT';

interface AdminNotification {
    id: string;
    type: AdminNotificationType;
    title: string;
    message: string;
    link: string | null;
    read: boolean;
    createdAt: Date | string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

const NOTIFICATION_TYPES: Array<{ value: AdminNotificationType | undefined; label: string; color: string }> = [
    { value: undefined, label: 'All', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { value: 'BOOKING', label: 'Bookings', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { value: 'CANCELLATION', label: 'Cancellations', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
    { value: 'MESSAGE', label: 'Messages', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { value: 'REVIEW', label: 'Reviews', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { value: 'SYSTEM', label: 'System', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { value: 'ALERT', label: 'Alerts', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
];

function getTypeColor(type: AdminNotificationType): string {
    const colors: Record<AdminNotificationType, string> = {
        BOOKING: 'bg-orange-100 text-orange-700',
        CANCELLATION: 'bg-red-100 text-red-700',
        MESSAGE: 'bg-green-100 text-green-700',
        REVIEW: 'bg-gray-100 text-gray-700',
        SYSTEM: 'bg-gray-100 text-gray-700',
        ALERT: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
}

interface AdminNotificationsClientProps {
    initialNotifications: AdminNotification[];
    currentFilter?: AdminNotificationType;
}

export function AdminNotificationsClient({ initialNotifications, currentFilter }: AdminNotificationsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMarking, setIsMarking] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Use SWR for polling with initial data
    const apiUrl = currentFilter
        ? `/api/admin/notifications?type=${currentFilter}`
        : '/api/admin/notifications';

    const { data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: { notifications: initialNotifications, unreadCount: 0 },
        refreshInterval: 10000, // Poll every 10 seconds
        revalidateOnFocus: true,
    });

    const notifications = data?.notifications || initialNotifications;

    const handleFilterChange = (type: AdminNotificationType | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type) {
            params.set('type', type);
        } else {
            params.delete('type');
        }
        router.push(`/admin/notifications?${params.toString()}`);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            });
            if (!res.ok) throw new Error('Failed to mark as read');
            mutate();
            toast.success("Marked as read");
        } catch {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        setIsMarking(true);
        try {
            const res = await fetch('/api/admin/notifications', {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error('Failed');
            mutate();
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Failed to mark all as read");
        } finally {
            setIsMarking(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/notifications/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed');
            mutate();
            toast.success("Notification deleted");
        } catch {
            toast.error("Failed to delete notification");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleNotificationClick = (notification: AdminNotification) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
        }
    };

    const unreadCount = notifications.filter((n: AdminNotification) => !n.read).length;

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 border-b">
                {NOTIFICATION_TYPES.map((type) => (
                    <Button
                        key={type.label}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange(type.value)}
                        className={cn(
                            "rounded-full text-xs font-medium transition-all",
                            currentFilter === type.value || (!currentFilter && !type.value)
                                ? type.color + " ring-2 ring-offset-1 ring-primary/20"
                                : "bg-muted/50 hover:bg-muted"
                        )}
                    >
                        {type.label}
                    </Button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    {unreadCount > 0 && ` (${unreadCount} unread)`}
                </p>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarking}
                    >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No notifications{currentFilter ? ` of type "${currentFilter}"` : ''}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification: AdminNotification) => (
                        <SwipeableNotificationItem
                            key={notification.id}
                            onSwipeLeft={() => handleMarkAsRead(notification.id)}
                            onSwipeRight={() => handleDelete(notification.id)}
                        >
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer bg-background", // Ensure bg-background for swipe reveal
                                    "hover:shadow-sm active:scale-[0.99]",
                                    "min-h-[72px]",
                                    notification.read
                                        ? "opacity-70"
                                        : "border-primary/20"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                {/* Unread indicator */}
                                <div className={cn(
                                    "mt-2 h-2 w-2 rounded-full flex-shrink-0",
                                    notification.read ? "bg-transparent" : "bg-primary"
                                )} />

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <h4 className={cn(
                                                "text-sm font-semibold truncate",
                                                notification.read ? "text-muted-foreground" : "text-foreground"
                                            )}>
                                                {notification.title}
                                            </h4>
                                            <Badge
                                                variant="secondary"
                                                className={cn("text-[10px] px-1.5 py-0", getTypeColor(notification.type))}
                                            >
                                                {notification.type}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                    {notification.link && (
                                        <div className="flex items-center gap-1 text-xs text-primary">
                                            <ExternalLink className="h-3 w-3" />
                                            <span>View details</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(notification.id)}
                                        disabled={isDeleting === notification.id}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </SwipeableNotificationItem>
                    ))}
                </div>
            )}
        </div>
    );
}
