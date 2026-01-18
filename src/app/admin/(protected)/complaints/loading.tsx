
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                </div>
            </div>

            <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
