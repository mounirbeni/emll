"use client";

import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const { data, mutate } = useSWR<{ data?: Notification[] } | Notification[]>(
        "/api/notifications",
        fetcher
    );

    const notifications = Array.isArray(data) ? data : data?.data || [];
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: "PATCH",
            });

            if (!res.ok) throw new Error("Failed to mark as read");

            // Optimistically update
            mutate(
                (current) => {
                    if (!current) return current;
                    const notifications = Array.isArray(current) ? current : current.data || [];
                    return Array.isArray(current)
                        ? notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
                        : { ...current, data: notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) };
                },
                false
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to update notification");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
            if (unreadIds.length === 0) return;

            await Promise.all(
                unreadIds.map((id) =>
                    fetch(`/api/notifications/${id}/read`, {
                        method: "PATCH",
                    })
                )
            );

            mutate();
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("Failed to update notifications");
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "BOOKING":
            case "BOOKING_CONFIRMED":
                return "bg-green-100 text-green-600";
            case "BOOKING_CANCELLED":
                return "bg-red-100 text-red-600";
            case "ERROR":
                return "bg-red-100 text-red-600";
            case "WARNING":
                return "bg-yellow-100 text-yellow-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="py-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllAsRead();
                            }}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.slice(0, 5).map((notification) => {
                            const notificationContent = (
                                <>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationIcon(
                                            notification.type
                                        )}`}
                                    >
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"
                                                }`}
                                        >
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                    )}
                                </>
                            );

                            return (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                                    onClick={() => {
                                        if (!notification.read) {
                                            handleMarkAsRead(notification.id);
                                        }
                                        if (notification.link) {
                                            setIsOpen(false);
                                        }
                                    }}
                                    asChild={notification.link ? true : undefined}
                                >
                                    {notification.link ? (
                                        <Link href={notification.link} className="flex items-start gap-3 w-full">
                                            {notificationContent}
                                        </Link>
                                    ) : (
                                        <div className="flex items-start gap-3 w-full">
                                            {notificationContent}
                                        </div>
                                    )}
                                </DropdownMenuItem>
                            );
                        })
                    )}
                </div>
                {notifications.length > 5 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5">
                            <Link href="/client/notifications">
                                <Button
                                    variant="ghost"
                                    className="w-full text-xs"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all notifications
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

