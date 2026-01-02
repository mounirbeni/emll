"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      status: {
        confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        pending: "bg-amber-50 text-amber-700 border border-amber-200",
        cancelled: "bg-red-50 text-red-700 border border-red-200",
        completed: "bg-blue-50 text-blue-700 border border-blue-200",
        processing: "bg-purple-50 text-purple-700 border border-purple-200",
        paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        unpaid: "bg-amber-50 text-amber-700 border border-amber-200",
        refunded: "bg-gray-50 text-gray-700 border border-gray-200",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-xs px-3 py-1",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  }
);

const statusIcons = {
  confirmed: CheckCircle,
  pending: Clock,
  cancelled: XCircle,
  completed: CheckCircle,
  processing: Loader2,
  paid: CheckCircle,
  unpaid: AlertCircle,
  refunded: XCircle,
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
  processing: "Processing",
  paid: "Paid",
  unpaid: "Unpaid",
  refunded: "Refunded",
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean;
  label?: string;
}

export function StatusBadge({
  className,
  status,
  size,
  showIcon = true,
  label,
  ...props
}: StatusBadgeProps) {
  const statusKey = status || "pending";
  const Icon = statusIcons[statusKey];
  const displayLabel = label || statusLabels[statusKey] || statusKey;

  return (
    <span
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {showIcon && Icon && (
        <Icon
          className={cn(
            "shrink-0",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
            statusKey === "processing" && "animate-spin"
          )}
        />
      )}
      {displayLabel}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase() as
    | "confirmed"
    | "pending"
    | "cancelled"
    | "completed";
  return <StatusBadge status={normalizedStatus} />;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase() as "paid" | "unpaid" | "refunded";
  return <StatusBadge status={normalizedStatus} size="sm" />;
}
