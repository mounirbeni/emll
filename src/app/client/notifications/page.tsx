"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            // Handle wrapped response
            const notificationsData = data.data || data;
            setNotifications(notificationsData);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: "PATCH",
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                // Handle error response
                const errorMessage = data.error?.message || data.error || `Failed to mark as read (${res.status})`;
                throw new Error(errorMessage);
            }
            
            // Handle success response (may be wrapped in data field)
            const notification = data.data || data;
            
            // Optimistically update the notification in the list
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            
            toast.success("Notification marked as read");
        } catch (error: any) {
            console.error("Error marking notification as read:", error);
            toast.error(error.message || "Failed to update notification");
        }
    };

    const filterNotifications = (filter: string) => {
        switch (filter) {
            case "unread":
                return notifications.filter((n) => !n.read);
            case "read":
                return notifications.filter((n) => n.read);
            default:
                return notifications;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "BOOKING_CONFIRMED":
            case "BOOKING_COMPLETED":
                return "bg-green-100 text-green-600";
            case 'BOOKING':
                return "bg-blue-100 text-blue-600";
            case "BOOKING_CANCELLED":
            case "BOOKING_REJECTED":
                return "bg-red-100 text-red-600";
            default:
                return "bg-blue-100 text-blue-600";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#FF5F00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                    Stay updated with your booking activities
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">
                        All ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread ({notifications.filter((n) => !n.read).length})
                    </TabsTrigger>
                    <TabsTrigger value="read">
                        Read ({notifications.filter((n) => n.read).length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filterNotifications(activeTab).length > 0 ? (
                        <div className="space-y-3">
                            {filterNotifications(activeTab).map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`${!notification.read ? "border-l-4 border-l-[#FF5F00]" : ""
                                        }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationIcon(
                                                    notification.type
                                                )}`}
                                            >
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3
                                                            className={`font-semibold ${!notification.read
                                                                ? "text-gray-900"
                                                                : "text-gray-600"
                                                                }`}
                                                        >
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {new Date(
                                                                notification.createdAt
                                                            ).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Mark as read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
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
                                    {activeTab === "unread"
                                        ? "You're all caught up!"
                                        : "No notifications to show"}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
