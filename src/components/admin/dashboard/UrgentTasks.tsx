'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, MessageSquare, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface UrgentStats {
    pendingBookings: number;
    pendingSupport: number;
    pendingReviews: number;
}

interface UrgentTasksProps {
    stats?: UrgentStats;
}

export function UrgentTasks({ stats }: UrgentTasksProps) {
    if (!stats) return null;

    const tasks = [
        {
            label: 'Pending Bookings',
            count: stats.pendingBookings,
            href: '/admin/bookings?status=PENDING',
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            label: 'Support Requests',
            count: stats.pendingSupport,
            href: '/admin/support',
            icon: MessageSquare,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Review Moderation',
            count: stats.pendingReviews,
            href: '/admin/reviews',
            icon: ShieldAlert,
            color: 'text-red-500',
            bg: 'bg-red-500/10'
        }
    ];

    const totalUrgent = tasks.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <Card className="col-span-12 lg:col-span-3 border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Urgent Tasks
                    </CardTitle>
                    {totalUrgent > 0 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground animate-pulse">
                            {totalUrgent}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-2">
                    {tasks.map((task, idx) => (
                        <Link
                            key={idx}
                            href={task.href}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${task.bg}`}>
                                    <task.icon className={`h-4 w-4 ${task.color}`} />
                                </div>
                                <span className="text-sm font-medium">{task.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{task.count}</span>
                                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform text-xs">→</span>
                            </div>
                        </Link>
                    ))}
                    {totalUrgent === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                            No urgent tasks! 🎉
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
