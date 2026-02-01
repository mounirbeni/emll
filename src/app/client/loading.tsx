import { Skeleton } from "@/components/ui/skeleton"

export default function ClientLoading() {
    return (
        <div className="container py-8 space-y-8 animate-pulse">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[350px]" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-3xl border border-gray-100 p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[120px]" />
                                <Skeleton className="h-4 w-[80px]" />
                            </div>
                        </div>
                        <Skeleton className="h-[2px] w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4 mt-8">
                <Skeleton className="h-8 w-[200px]" />
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-3xl bg-gray-50 flex p-4 gap-4">
                            <Skeleton className="h-full w-32 rounded-2xl" />
                            <div className="flex-1 space-y-3 py-2">
                                <Skeleton className="h-6 w-[60%]" />
                                <Skeleton className="h-4 w-[40%]" />
                                <Skeleton className="h-4 w-[20%]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
