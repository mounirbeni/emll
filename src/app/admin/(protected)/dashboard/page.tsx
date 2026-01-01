import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { adminService } from "@/services/admin.service";

export const dynamic = 'force-dynamic';

async function getData() {
    // Fetch stats concurrently
    const stats = await adminService.getDashboardStats();

    return {
        stats: {
            bookingsCount: stats.overview.totalBookings,
            usersCount: stats.users.total,
            servicesCount: stats.overview.totalServices,
            totalRevenue: stats.revenue.total
        },
        recentBookings: stats.recent.bookings
    };
}

export default async function AdminDashboard() {
    const { stats, recentBookings } = await getData();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your platform performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`€${stats.totalRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    description="Lifetime volume"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookingsCount.toString()}
                    icon={CalendarDays}
                    description="All time"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.usersCount.toString()}
                    icon={Users}
                    description="Registered accounts"
                />
                <StatsCard
                    title="Experiences"
                    value={stats.servicesCount.toString()}
                    icon={TrendingUp}
                    description="Active listings"
                />
            </div>

            {/* Recent Bookings and Activity */}
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No bookings yet.</p>
                            ) : (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {booking.user?.name || booking.name}
                                                <span className="ml-2 text-xs font-mono text-muted-foreground bg-gray-100 px-1 rounded">
                                                    {booking.id}
                                                </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{booking.activityTitle}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="font-medium">€{booking.totalPrice}</div>
                                            <Badge variant={
                                                booking.status === 'CONFIRMED' ? 'default' :
                                                    booking.status === 'CANCELLED' ? 'destructive' : 'secondary'
                                            } className="text-xs">
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">Database</p>
                                    <p className="text-xs text-muted-foreground">Connected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">API Gateway</p>
                                    <p className="text-xs text-muted-foreground">Operational</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">Email Service</p>
                                    <p className="text-xs text-muted-foreground">Operational</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, description }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
