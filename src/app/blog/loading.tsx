"use client";

import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Skeleton */}
            <div className="bg-white pt-24 pb-12 px-4 shadow-sm relative z-10">
                <div className="max-w-[1400px] mx-auto text-center">
                    <Skeleton className="h-12 w-80 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto mb-8" />
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                        <Skeleton className="h-12 w-full md:w-64 rounded-full" />
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="h-10 w-20 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-12">
                    {/* Featured Post Skeleton */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Skeleton className="w-2 h-8 rounded-full" />
                            <Skeleton className="h-7 w-40" />
                        </div>
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl flex flex-col md:flex-row">
                            <Skeleton className="md:w-1/2 min-h-[300px] md:min-h-[400px] rounded-none" />
                            <div className="md:w-1/2 p-8 md:p-12 space-y-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-4/5" />
                                <Skeleton className="h-20 w-full" />
                                <div className="flex items-center gap-4 pt-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Grid Skeleton */}
                    <section>
                        <Skeleton className="h-7 w-40 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
