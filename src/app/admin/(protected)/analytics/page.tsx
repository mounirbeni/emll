'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar, Users, Package } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'sonner';

interface AnalyticsData {
    revenue: {
        today: number;
        week: number;
        month: number;
        total: number;
        change: number;
    };
    bookings: {
        today: number;
        week: number;
        month: number;
        total: number;
        change: number;
    };
    users: {
        total: number;
        newThisWeek: number;
        change: number;
    };
    topServices: Array<{
        id: string;
        title: string;
        bookings: number;
        revenue: number;
    }>;
    recentTrends: Array<{
        date: string;
        bookings: number;
        revenue: number;
    }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/analytics?range=${dateRange}`);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData?.error?.message || `HTTP ${res.status}: Failed to fetch analytics`;
                console.error('Analytics API error:', errorMessage, errorData);
                toast.error(`Failed to load analytics: ${errorMessage}`);
                // Set empty data structure to show error state
                setData({
                    revenue: { today: 0, week: 0, month: 0, total: 0, change: 0 },
                    bookings: { today: 0, week: 0, month: 0, total: 0, change: 0 },
                    users: { total: 0, newThisWeek: 0, change: 0 },
                    topServices: [],
                    recentTrends: []
                });
                return;
            }
            
            const analyticsData = await res.json();
            // Handle both wrapped and unwrapped responses
            const data = analyticsData.data || analyticsData;
            
            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid analytics data format');
            }
            
            setData(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Failed to load analytics: ${errorMessage}`);
            // Set empty data structure to show error state
            setData({
                revenue: { today: 0, week: 0, month: 0, total: 0, change: 0 },
                bookings: { today: 0, week: 0, month: 0, total: 0, change: 0 },
                users: { total: 0, newThisWeek: 0, change: 0 },
                topServices: [],
                recentTrends: []
            });
        } finally {
            setLoading(false);
        }
    };

    const exportBookings = async () => {
        try {
            const res = await fetch('/api/admin/bookings/export');
            if (!res.ok) throw new Error('Failed to export');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div>No data available</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
                </div>
                <Button onClick={exportBookings}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Bookings
                </Button>
            </div>

            <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as '7d' | '30d' | '90d')}>
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
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{data.revenue.total.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            {data.revenue.change >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                            )}
                            <span className={data.revenue.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {Math.abs(data.revenue.change).toFixed(1)}%
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
                            {data.bookings.change >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                            )}
                            <span className={data.bookings.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {Math.abs(data.bookings.change).toFixed(1)}%
                            </span>
                            <span className="ml-1">vs previous period</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
                        <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            €{data.bookings.total > 0 
                                ? (data.revenue.total / data.bookings.total).toFixed(2)
                                : '0.00'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Per booking
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Over Time Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Over Time</CardTitle>
                    <CardDescription>Daily booking trends for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.recentTrends && data.recentTrends.length > 0 ? (
                            data.recentTrends.map((trend, index) => {
                                const maxBookings = Math.max(...data.recentTrends.map(t => t.bookings), 1)
                                const height = (trend.bookings / maxBookings) * 100
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col items-center">
                                            <div
                                                className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                                                style={{ height: `${height}%`, minHeight: '4px' }}
                                                title={`${trend.date}: ${trend.bookings} bookings`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground transform -rotate-45 origin-top-left whitespace-nowrap">
                                            {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No booking data available for this period</p>
                                    <p className="text-sm mt-1">Bookings will appear here as they are created</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Services</CardTitle>
                    <CardDescription>Services ranked by revenue and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.topServices.length > 0 ? (
                            data.topServices.map((service, index) => (
                                <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                            'bg-primary/10 text-primary'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{service.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {service.bookings} {service.bookings === 1 ? 'booking' : 'bookings'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">€{service.revenue.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No service data available</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

