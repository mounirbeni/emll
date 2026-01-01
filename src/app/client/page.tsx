"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    MessageSquare,
    Bell,
    ArrowRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
    bookings: {
        total: number;
        upcoming: number;
        completed: number;
        cancelled: number;
    };
    notifications: {
        unread: number;
    };
    nextBooking: {
        id: string;
        activityTitle: string;
        date: string;
        status: string;
    } | null;
}

export default function ClientDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const [bookingsRes, notificationsRes] = await Promise.all([
                fetch("/api/bookings"),
                fetch("/api/notifications"),
            ]);

            if (!bookingsRes.ok || !notificationsRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const bookingsData = await bookingsRes.json();
            const notificationsData = await notificationsRes.json();
            
            // Handle wrapped responses
            const bookings = bookingsData.data || bookingsData;
            const notifications = notificationsData.data || notificationsData;

            const now = new Date();
            const upcoming = bookings.filter(
                (b: any) =>
                    (b.status === "PENDING" || b.status === "CONFIRMED") &&
                    new Date(b.date) > now
            );
            const completed = bookings.filter((b: any) => b.status === "COMPLETED");
            const cancelled = bookings.filter(
                (b: any) => b.status === "CANCELLED" || b.status === "REJECTED"
            );

            const nextBooking = upcoming.length > 0 ? upcoming[0] : null;

            setStats({
                bookings: {
                    total: bookings.length,
                    upcoming: upcoming.length,
                    completed: completed.length,
                    cancelled: cancelled.length,
                },
                notifications: {
                    unread: notifications.filter((n: any) => !n.read).length,
                },
                nextBooking,
            });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#FF5F00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Here's what's happening with your bookings
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Bookings
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.bookings.total || 0}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.bookings.upcoming || 0}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.bookings.completed || 0}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Notifications
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.notifications.unread || 0}
                                </p>
                            </div>
                            <Bell className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Next Booking Card */}
            {stats?.nextBooking ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Next Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {stats.nextBooking.activityTitle}
                                </h3>
                                <span className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-500 mr-2">
                                    {stats.nextBooking.id}
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                    {new Date(stats.nextBooking.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </p>
                                <span
                                    className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${stats.nextBooking.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {stats.nextBooking.status}
                                </span>
                            </div>
                            <Link href={`/client/bookings/${stats.nextBooking.id}`}>
                                <Button>
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No upcoming bookings
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Ready to explore Marrakesh? Book your next adventure!
                        </p>
                        <Link href="/search">
                            <Button>Browse Activities</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/client/bookings">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">View All Bookings</h3>
                                    <p className="text-sm text-gray-600">
                                        Manage your past and upcoming trips
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/client/messages">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">Contact Support</h3>
                                    <p className="text-sm text-gray-600">
                                        Get help with your bookings
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
