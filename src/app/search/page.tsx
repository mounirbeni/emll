
import { Suspense } from "react";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <div className="flex flex-col mb-8">
                <h1 className="text-4xl font-serif text-[var(--color-secondary)] mb-2">Find Your Experience</h1>
                <p className="text-muted-foreground">Discover the best of Marrakech, guided by locals.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <SearchFilters />
                    </Suspense>
                </aside>

                {/* Results Grid */}
                <main className="lg:col-span-3">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-[300px]" /><Skeleton className="h-[300px]" /></div>}>
                        <SearchResults />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
