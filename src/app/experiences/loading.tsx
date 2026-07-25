"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ExperiencesLoading() {
    return (
        <div className="min-h-screen bg-background app-section-sm">
            {/* Hero Section Skeleton */}
            <div className="bg-gray-50 py-16 text-center md:py-24">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-14 w-96 mx-auto mb-4" />
                    <Skeleton className="h-6 w-[500px] max-w-full mx-auto" />
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Filter Bar Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <Skeleton className="h-11 w-64 rounded-xl" />
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-10 w-24 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <Skeleton className="h-48 w-full rounded-none" />
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-6 w-4/5" />
                                <Skeleton className="h-4 w-2/3" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-7 w-24" />
                                    <Skeleton className="h-10 w-28 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
