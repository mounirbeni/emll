'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';

interface TopService {
    id: string;
    title: string;
    bookingsCount: number;
    revenue: number;
    rating: number;
}

interface EngagementIndexProps {
    topServices?: TopService[];
}

export function EngagementIndex({ topServices }: EngagementIndexProps) {
    if (!topServices || topServices.length === 0) return null;

    return (
        <Card className="col-span-12 lg:col-span-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Engagement Index
                </CardTitle>
                <p className="text-sm text-muted-foreground">Top performing experiences</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topServices.map((service, idx) => (
                        <div key={service.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{service.title}</p>
                                    <p className="text-xs text-muted-foreground">{service.bookingsCount} bookings</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">€{service.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 justify-end text-xs text-amber-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>{service.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
