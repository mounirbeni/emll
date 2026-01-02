import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-muted/60 relative overflow-hidden",
                "before:absolute before:inset-0",
                "before:-translate-x-full",
                "before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r",
                "before:from-transparent before:via-white/20 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="border-b border-border p-4">
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="border-b border-border last:border-0 p-4">
                    <div className="flex gap-4 items-center">
                        {[1, 2, 3, 4, 5].map((j) => (
                            <Skeleton key={j} className="h-4 flex-1" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonStatsCard() {
    return (
        <div className="bg-white rounded-xl border border-border p-6 space-y-3">
            <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

export function SkeletonBookingCard() {
    return (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="flex">
                <Skeleton className="w-16 h-full min-h-[100px]" />
                <div className="flex-1 p-4 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-7 w-7 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonForm() {
    return (
        <div className="bg-white rounded-xl border border-border p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
        </div>
    );
}
