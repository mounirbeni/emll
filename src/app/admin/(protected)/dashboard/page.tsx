import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, CreditCard, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Sparkles, Clock, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { adminService } from "@/services/admin.service";

export const dynamic = 'force-dynamic';

async function getData() {
    const [stats, dailyStats] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getDailyStats()
    ]);

    return {
        stats,
        dailyStats
    };
}

export default async function AdminDashboard() {
    const { stats, dailyStats } = await getData();
    const health = await adminService.getSystemHealth();

    // Timeline merging
    const timeline = [
        ...(stats?.recent?.bookings || []).map((b: any) => ({
            id: b.id,
            type: 'BOOKING',
            title: `New booking: ${b.activityTitle}`,
            subtitle: `${b.name} • ${format(new Date(b.createdAt), 'MMM d, HH:mm')}`,
            date: new Date(b.createdAt),
            status: b.status,
            amount: Number(b.totalPrice)
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Platform overview & real-time statistics.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Real-time Data</span>
                </div>
            </div>

            {/* Primary Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`€${stats.revenue.total.toLocaleString()}`}
                    icon={CreditCard}
                    description="Lifetime generated"
                    trend={{ value: stats.revenue.growth, isPositive: stats.revenue.growth >= 0 }}
                    bgColor="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.overview.totalBookings.toString()}
                    icon={CalendarDays}
                    description="All time"
                    bgColor="bg-gray-50"
                    iconColor="text-gray-600"
                />
                <StatsCard
                    title="Today's Bookings"
                    value={dailyStats.bookingsToday.toString()}
                    icon={Clock}
                    description={`Approx. €${dailyStats.revenueToday.toLocaleString()} today`}
                    bgColor="bg-orange-50"
                    iconColor="text-orange-600"
                    highlight
                />
                <StatsCard
                    title="Active Customers"
                    value={stats.users.active.toString()}
                    icon={Users}
                    description={`+${stats.users.new} new this month`}
                    bgColor="bg-gray-50"
                    iconColor="text-gray-600"
                />
            </div>

            {/* Booking Breakdown */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatusCard
                    title="Pending"
                    value={stats.bookings.pending}
                    icon={Clock}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    href="/admin/bookings?status=PENDING"
                />
                <StatusCard
                    title="Confirmed"
                    value={stats.bookings.confirmed}
                    icon={CheckCircle2}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                    href="/admin/bookings?status=CONFIRMED"
                />
                <StatusCard
                    title="Completed"
                    value={stats.bookings.completed}
                    icon={CheckCircle2}
                    color="text-primary"
                    bg="bg-primary/10"
                    href="/admin/bookings?status=COMPLETED"
                />
                <StatusCard
                    title="Cancelled"
                    value={stats.bookings.cancelled}
                    icon={RotateCcw}
                    color="text-red-500"
                    bg="bg-red-500/10"
                    href="/admin/bookings?status=CANCELLED"
                />
            </div>

            {/* Recent Activity Timeline */}
            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 rounded-xl border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                            <CardDescription>Latest system events and updates</CardDescription>
                        </div>
                        <Link href="/admin/bookings" className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors">
                            View Bookings
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-muted ml-3 space-y-6">
                            {timeline.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm ml-4">No recent activity</div>
                            ) : (
                                timeline.map((item, index) => (
                                    <div key={`${item.type}-${item.id}`} className="mb-8 ml-6 relative">
                                        <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${item.type === 'BOOKING' ? 'bg-orange-100 text-orange-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {item.type === 'BOOKING' ? <CalendarDays className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                        </span>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                            <div>
                                                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                                                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                                            </div>
                                            {item.amount && (
                                                <span className="text-sm font-medium">€{Number(item.amount).toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Health */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                            <CardDescription>Operational status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <HealthItem
                                    status={health.database as any}
                                    title="Database"
                                    description={health.database === 'operational' ? "Connected & Responding" : "Connection Failed"}
                                />
                                <HealthItem
                                    status={health.server as any}
                                    title="Server Actions"
                                    description={health.server === 'operational' ? "Unified Mutations Active" : "Degraded Performance"}
                                />
                                <HealthItem
                                    status="operational"
                                    title="Cache"
                                    description="Revalidation Enabled"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link href="/admin/notifications" className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-all text-center">
                                <AlertCircle className="h-6 w-6 text-primary" />
                                <span className="text-xs font-medium">Send Alert</span>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ title, value, icon: Icon, color, bg, href }: any) {
    return (
        <Link href={href}>
            <Card className="rounded-xl border-border hover:shadow-md transition-all cursor-pointer hover:border-primary/50">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                </CardContent>
            </Card>
        </Link>
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
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, description, trend, bgColor, iconColor, highlight }: any) {
    return (
        <Card className={`relative overflow-hidden rounded-xl border-border hover:shadow-lg transition-all duration-300 ${highlight ? 'ring-2 ring-primary/20' : ''}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className={`h-10 w-10 rounded-xl ${bgColor} flex items-center justify-center shadow-sm`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(trend.value)}%
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
