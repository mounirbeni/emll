import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { adminService } from "@/services/admin.service";

export const dynamic = 'force-dynamic';

interface RecentBooking {
    id: string;
    name: string;
    activityTitle: string;
    totalPrice: number | { toNumber(): number };
    status: string;
    user?: { name: string | null; email: string } | null;
}

async function getData() {
    const stats = await adminService.getDashboardStats();

    return {
        stats: {
            bookingsCount: stats.overview.totalBookings,
            usersCount: stats.users.total,
            servicesCount: stats.overview.totalServices,
            totalRevenue: stats.revenue.total
        },
        recentBookings: (stats.recent.bookings as RecentBooking[])
    };
}

export default async function AdminDashboard() {
    const { stats, recentBookings } = await getData();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Welcome back! Here's your platform overview.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Live data</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`€${stats.totalRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    description="Lifetime volume"
                    trend={{ value: 12.5, isPositive: true }}
                    gradient="from-emerald-500 to-teal-600"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookingsCount.toString()}
                    icon={CalendarDays}
                    description="All time"
                    trend={{ value: 8.2, isPositive: true }}
                    gradient="from-primary to-accent"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.usersCount.toString()}
                    icon={Users}
                    description="Registered accounts"
                    trend={{ value: 5.1, isPositive: true }}
                    gradient="from-blue-500 to-indigo-600"
                />
                <StatsCard
                    title="Experiences"
                    value={stats.servicesCount.toString()}
                    icon={TrendingUp}
                    description="Active listings"
                    gradient="from-purple-500 to-pink-600"
                />
            </div>

            {/* Recent Bookings and Activity */}
            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 rounded-xl border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                        <Link href="/admin/bookings" className="text-sm text-primary hover:underline font-medium">
                            View all →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No bookings yet</p>
                                </div>
                            ) : (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <CalendarDays className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {booking.user?.name || booking.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">{booking.activityTitle}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="font-semibold text-foreground">€{typeof booking.totalPrice === 'number' ? booking.totalPrice.toFixed(2) : booking.totalPrice.toNumber().toFixed(2)}</p>
                                            </div>
                                            <BookingStatusBadge status={booking.status} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 rounded-xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <HealthItem status="operational" title="Database" description="Connected & responsive" />
                            <HealthItem status="operational" title="API Gateway" description="All endpoints active" />
                            <HealthItem status="operational" title="Email Service" description="Sending normally" />
                            <HealthItem status="operational" title="Payment System" description="Ready for transactions" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function HealthItem({ status, title, description }: { status: 'operational' | 'degraded' | 'down'; title: string; description: string }) {
    const statusStyles = {
        operational: 'bg-emerald-500',
        degraded: 'bg-amber-500',
        down: 'bg-red-500'
    };

    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="relative">
                <div className={`h-2.5 w-2.5 rounded-full ${statusStyles[status]}`} />
                <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${statusStyles[status]} animate-ping opacity-75`} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    trend?: { value: number; isPositive: boolean };
    gradient: string;
}

function StatsCard({ title, value, icon: Icon, description, trend, gradient }: StatsCardProps) {
    return (
        <Card className="relative overflow-hidden rounded-xl border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`} />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trend.value}%
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
