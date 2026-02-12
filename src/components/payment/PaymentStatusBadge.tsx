'use client';

import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  Loader2,
  CreditCard,
} from 'lucide-react';

export type PaymentStatusType =
  | 'PAID'
  | 'PENDING'
  | 'UNPAID'
  | 'PENDING_VERIFICATION'
  | 'CASH_ON_ARRIVAL'
  | 'REFUNDED';

interface PaymentStatusBadgeProps {
  status: PaymentStatusType;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  PaymentStatusType,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PAID: {
    label: 'Paid',
    className: 'bg-green-50 text-green-700 border-green-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
  },
  UNPAID: {
    label: 'Unpaid',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: <CreditCard className="w-4 h-4" />,
  },
  PENDING_VERIFICATION: {
    label: 'Pending Verification',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  CASH_ON_ARRIVAL: {
    label: 'Cash on Arrival',
    className: 'bg-primary/10 text-primary border-primary/20',
    icon: <Banknote className="w-4 h-4" />,
  },
  REFUNDED: {
    label: 'Refunded',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

export function PaymentStatusBadge({
  status,
  className,
  showIcon = true,
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.UNPAID;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
