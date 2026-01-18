import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div>
                        <Skeleton className="h-8 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-border">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 flex-1 max-w-md" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="space-y-3 md:hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden rounded-xl border-border">
                        <CardContent className="p-0 flex h-24">
                            <Skeleton className="w-20 h-full" />
                            <div className="flex-1 p-3 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <div className="flex justify-between items-end mt-2">
                                    <Skeleton className="h-4 w-8" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/50 flex gap-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-24" />
                    ))}
                </div>
                <div className="p-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
                            {Array.from({ length: 7 }).map((_, j) => (
                                <Skeleton key={j} className="h-6 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
