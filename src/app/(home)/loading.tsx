"use client";

import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Skeleton */}
            <div className="relative h-[90vh] min-h-[600px] bg-gray-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <Skeleton className="h-16 w-96 max-w-full mb-4" />
                    <Skeleton className="h-6 w-80 max-w-full mb-8" />
                    <Skeleton className="h-14 w-48 rounded-xl" />
                </div>
            </div>

            {/* Categories Skeleton */}
            <div className="py-20 px-4">
                <div className="max-w-[1400px] mx-auto">
                    <Skeleton className="h-10 w-64 mx-auto mb-12" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="text-center">
                                <Skeleton className="h-20 w-20 rounded-2xl mx-auto mb-4" />
                                <Skeleton className="h-5 w-24 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Experiences Skeleton */}
            <div className="py-20 px-4 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <Skeleton className="h-10 w-72 mx-auto mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
