import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon?: LucideIcon;
    iconColor?: string;
}

export function StatsCard({ label, value, icon: Icon, iconColor = 'text-gray-400' }: StatsCardProps) {
    return (
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                {Icon && (
                    <div className={`mb-2 ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <span className="text-2xl font-bold text-gray-900 mb-1">
                    {value}
                </span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {label}
                </span>
            </CardContent>
        </Card>
    );
}

export function StatsCardSkeleton() {
    return (
        <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-8 w-12 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
        </Card>
    );
}
