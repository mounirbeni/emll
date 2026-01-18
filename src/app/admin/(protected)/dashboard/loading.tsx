import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="relative overflow-hidden rounded-xl border-border">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 rounded-xl border-border">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 rounded-xl border-border">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
