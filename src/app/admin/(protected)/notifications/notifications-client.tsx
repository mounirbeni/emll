'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, MailOpen } from "lucide-react";
import { markNotificationAsRead, clearAllNotifications } from "@/app/actions/admin-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    type: string;
    link?: string | null;
}

export function NotificationsClient({ initialNotifications, userId }: { initialNotifications: Notification[], userId: string }) {
    // Note: We use optimistic updates or just router.refresh since we have actions.
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleMarkRead = (id: string) => {
        startTransition(async () => {
            const res = await markNotificationAsRead(id);
            if (res.success) {
                router.refresh(); // Fetch fresh data
                toast.success("Marked as read");
            } else {
                toast.error("Failed to mark as read");
            }
        });
    };

    const handleClearAll = () => {
        if (!confirm("Clear all notifications?")) return;
        startTransition(async () => {
            const res = await clearAllNotifications();
            if (res.success) {
                router.refresh();
                toast.success("All notifications cleared");
            } else {
                toast.error("Failed to clear notifications");
            }
        });
    };

    if (initialNotifications.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={isPending || initialNotifications.length === 0}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                </Button>
            </div>

            <div className="space-y-4">
                {initialNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${notification.isRead ? 'bg-background opacity-70' : 'bg-muted/30 border-primary/20'}`}
                    >
                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-primary'}`} />

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-semibold ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                    {notification.title}
                                </h4>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {notification.message}
                            </p>
                            {notification.link && (
                                <a href={notification.link} className="text-xs text-primary hover:underline block mt-1">
                                    View Details →
                                </a>
                            )}
                        </div>

                        {!notification.isRead && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleMarkRead(notification.id)}
                                disabled={isPending}
                                title="Mark as read"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
