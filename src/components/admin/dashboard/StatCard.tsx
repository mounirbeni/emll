import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
}

export const StatCard = ({ title, value, trend, trendDirection = 'neutral', icon, className }: StatCardProps) => {
    return (
        <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow", className)}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    {icon || <Activity className="w-5 h-5" />}
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                        trendDirection === 'up' && "text-emerald-700 bg-emerald-50",
                        trendDirection === 'down' && "text-rose-700 bg-rose-50",
                        trendDirection === 'neutral' && "text-slate-600 bg-slate-50",
                    )}>
                        {trendDirection === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {trendDirection === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
};
