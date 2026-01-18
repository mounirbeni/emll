import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ExperiencesLoading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="bg-white p-4 rounded-xl border">
                <Skeleton className="h-10 w-64" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/50 flex gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-24" />
                    ))}
                </div>
                <div className="p-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30">
                            <Skeleton className="h-10 w-16 rounded" />
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Skeleton key={j} className="h-6 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
