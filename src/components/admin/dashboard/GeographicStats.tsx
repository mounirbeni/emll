'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Globe, MapPin } from 'lucide-react';
import { Booking } from '@/types/admin';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface GeographicStatsProps {
    bookings: Booking[];
}

export function GeographicStats({ bookings }: GeographicStatsProps) {
    // Group by language
    const stats: Record<string, number> = {};
    bookings.forEach(b => {
        const lang = b.language || 'Unknown';
        stats[lang] = (stats[lang] || 0) + 1;
    });

    const data = Object.entries(stats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#64748b'];

    return (
        <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Visitor Demographics
                </CardTitle>
                <CardDescription>Based on booking languages</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Not enough data to display demographics.
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="h-4 w-4" /> Top Locations
                    </h4>
                    {/* Placeholder for top locations since we don't have geo data yet */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-primary/5 p-2 rounded flex justify-between">
                            <span>Medina</span>
                            <span className="font-bold">45%</span>
                        </div>
                        <div className="bg-primary/5 p-2 rounded flex justify-between">
                            <span>Gueliz</span>
                            <span className="font-bold">30%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
