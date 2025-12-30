import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/50 relative overflow-hidden",
                "before:absolute before:inset-0",
                "before:-translate-x-full",
                "before:animate-shimmer",
                "before:bg-gradient-to-r",
                "before:from-transparent before:via-white/10 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}
