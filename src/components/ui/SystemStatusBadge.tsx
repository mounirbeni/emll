import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Clock, Circle } from 'lucide-react';

export type SystemStatus = 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'NEUTRAL';

interface SystemStatusBadgeProps {
    status: SystemStatus;
    label?: string;
    className?: string;
    icon?: boolean;
}

const statusConfig = {
    SUCCESS: {
        color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200',
        icon: CheckCircle
    },
    WARNING: {
        color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200',
        icon: Clock
    },
    CRITICAL: {
        color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200',
        icon: AlertCircle
    },
    NEUTRAL: {
        color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200',
        icon: Circle
    }
};

export const SystemStatusBadge = ({ status, label, className, icon = true }: SystemStatusBadgeProps) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn("gap-1.5 border py-1 px-2.5", config.color, className)}
        >
            {icon && <Icon className="w-3.5 h-3.5" />}
            {label || status}
        </Badge>
    );
};
