"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar, Users, Package } from 'lucide-react'


interface AnalyticsData {
    revenue: { total: number; change: number };
    bookings: { total: number; change: number };
    users: { total: number; newThisWeek: number };
    recentTrends: { date: string; bookings: number; revenue: number }[];
    topServices: { id: string; title: string; bookings: number; revenue: number }[];
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dateRange = searchParams.get('range') || '30d'

    const handleRangeChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('range', val)
        router.push(`?${params.toString()}`)
    }

    const exportBookings = async () => {
        if (!data?.recentTrends) return;

        const headers = ['Date', 'Bookings', 'Revenue'];
        const rows = data.recentTrends.map((t: any) => [t.date, t.bookings, t.revenue.toFixed(2)]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row: any[]) => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Comprehensive insights into platform performance</p>
                </div>
                <Button variant="outline" onClick={exportBookings}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                </Button>
            </div>

            <Tabs value={dateRange} onValueChange={handleRangeChange}>
                <TabsList>
                    <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                    <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                    <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue ({dateRange})</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{data.revenue.total.toFixed(2)}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className={data.revenue.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {data.revenue.change}%
                            </span>
                            <span className="ml-1">vs previous period</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.bookings.total}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className={data.bookings.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {data.bookings.change.toFixed(1)}%
                            </span>
                            <span className="ml-1">vs previous period</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.users.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.users.newThisWeek} new this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            €{data.bookings.total > 0 ? (data.revenue.total / data.bookings.total).toFixed(2) : '0.00'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.recentTrends.map((trend: any, i: number) => {
                            const max = Math.max(...data.recentTrends.map((t: any) => t.bookings), 1);
                            const h = (trend.bookings / max) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div className="w-full bg-primary/20 rounded-t h-full relative flex items-end">
                                        <div style={{ height: `${h}%` }} className="w-full bg-primary rounded-t transition-all group-hover:bg-primary/80"></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">{trend.date.split('-')[2]}</span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.topServices.map((service: any, i: number) => (
                            <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium">{service.title}</p>
                                        <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">€{service.revenue.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
