"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonStatsCard, SkeletonBookingCard } from "@/components/ui/skeleton";
import {
    Calendar,
    MessageSquare,
    Bell,
    ArrowRight,
    Clock,
    CheckCircle,
    Compass,
    Sparkles,
    MapPin
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
                fetch("/api/bookings", { cache: "no-store" }),
                fetch("/api/notifications", { cache: "no-store" }),
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
                (b: { status: string; date: string | number | Date; }) =>
                    (b.status === "PENDING" || b.status === "CONFIRMED") &&
                    new Date(b.date) > now
            );
            const completed = bookings.filter((b: { status: string; }) => b.status === "COMPLETED");
            const cancelled = bookings.filter(
                (b: { status: string; }) => b.status === "CANCELLED" || b.status === "REJECTED"
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
                    unread: notifications.filter((n: { read: boolean; }) => !n.read).length,
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
            <div className="space-y-6">
                <div>
                    <div className="h-8 w-64 bg-muted/60 rounded-lg animate-pulse mb-2" />
                    <div className="h-5 w-48 bg-muted/40 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonStatsCard key={i} />
                    ))}
                </div>
                <SkeletonBookingCard />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/10">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">
                            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! 👋
                        </h1>
                        <p className="text-medium-gray mt-1">
                            Here&apos;s what&apos;s happening with your Marrakech adventures
                        </p>
                    </div>
                    <Link href="/services" className="hidden sm:block">
                        <Button className="rounded-full shadow-md shadow-primary/20">
                            <Compass className="w-4 h-4 mr-2" />
                            Explore
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-medium-gray uppercase tracking-wide">
                                    Total Bookings
                                </p>
                                <p className="text-2xl font-bold text-charcoal mt-1">
                                    {stats?.bookings.total || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-medium-gray uppercase tracking-wide">Upcoming</p>
                                <p className="text-2xl font-bold text-charcoal mt-1">
                                    {stats?.bookings.upcoming || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-warning" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-medium-gray uppercase tracking-wide">Completed</p>
                                <p className="text-2xl font-bold text-charcoal mt-1">
                                    {stats?.bookings.completed || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-medium-gray uppercase tracking-wide">
                                    Notifications
                                </p>
                                <p className="text-2xl font-bold text-charcoal mt-1">
                                    {stats?.notifications.unread || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                                <Bell className="w-6 h-6 text-info" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Next Booking Card */}
            {stats?.nextBooking ? (
                <Card className="border-0 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-accent h-1" />
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Your Next Adventure</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-charcoal mb-2">
                                    {stats.nextBooking.activityTitle}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-medium-gray">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        {new Date(stats.nextBooking.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {new Date(stats.nextBooking.date).toLocaleTimeString(
                                            "en-US",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>
                                </div>
                                <span
                                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${stats.nextBooking.status === "CONFIRMED"
                                        ? "bg-success/10 text-success"
                                        : "bg-warning/10 text-warning"
                                        }`}
                                >
                                    {stats.nextBooking.status}
                                </span>
                            </div>
                            <Link href={`/client/bookings/${stats.nextBooking.id}`}>
                                <Button size="lg" className="rounded-full shadow-md shadow-primary/20">
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-md bg-gradient-to-br from-cream to-white">
                    <CardContent className="py-12 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Compass className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-charcoal mb-2">
                            Ready for your next adventure?
                        </h3>
                        <p className="text-medium-gray mb-6 max-w-md mx-auto">
                            Discover authentic Marrakech experiences - from desert tours to cooking classes.
                        </p>
                        <Link href="/services">
                            <Button size="lg" className="rounded-full shadow-lg shadow-primary/30">
                                <MapPin className="w-4 h-4 mr-2" />
                                Explore Experiences
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/client/bookings" className="group">
                    <Card className="border-0 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-charcoal group-hover:text-primary transition-colors">View All Bookings</h3>
                                    <p className="text-sm text-medium-gray">
                                        Manage your past and upcoming trips
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-medium-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/client/messages" className="group">
                    <Card className="border-0 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center group-hover:bg-info/20 transition-colors">
                                    <MessageSquare className="w-6 h-6 text-info" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-charcoal group-hover:text-primary transition-colors">Contact Support</h3>
                                    <p className="text-sm text-medium-gray">
                                        Get help with your bookings
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-medium-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
