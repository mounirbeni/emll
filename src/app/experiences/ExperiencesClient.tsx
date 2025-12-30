"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { FilterSidebar } from "@/components/experiences/FilterSidebar";
import { Activity } from "@/lib/types";

interface ExperiencesClientProps {
    initialActivities: Activity[];
}

export default function ExperiencesClient({ initialActivities }: ExperiencesClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL or defaults
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

    const initialMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
    const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 600;
    const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

    const [selectedDuration, setSelectedDuration] = useState(searchParams.get("duration") || "all");

    const initialFeatures = searchParams.get("features") ? searchParams.get("features")?.split(",") || [] : [];
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);

    // Sync state with URL params (for external navigation like footer links)
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoryParam !== selectedCategory) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 600) params.set("maxPrice", priceRange[1].toString());
        if (selectedDuration && selectedDuration !== "all") params.set("duration", selectedDuration);
        if (selectedFeatures.length > 0) params.set("features", selectedFeatures.join(","));

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
    }, [searchQuery, selectedCategory, priceRange, selectedDuration, selectedFeatures, pathname, router]);

    const filteredActivities = useMemo(() => {
        return initialActivities.filter((activity) => {
            // Search Filter
            if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) && !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category Filter
            if (selectedCategory !== "All") {
                const matchesCategory = activity.category === selectedCategory;
                const matchesTag = activity.tags?.includes(selectedCategory);

                if (!matchesCategory && !matchesTag) {
                    return false;
                }
            }

            // Price Filter
            if (activity.price < priceRange[0] || activity.price > priceRange[1]) {
                return false;
            }

            // Duration Filter
            if (selectedDuration !== "all") {
                const durationHours = parseInt(activity.duration);
                if (selectedDuration === "half-day" && durationHours > 4) return false;
                if (selectedDuration === "full-day" && durationHours <= 4) return false;
            }

            // Features Filter
            if (selectedFeatures.length > 0) {
                const hasAllFeatures = selectedFeatures.every((feature) =>
                    activity.features?.includes(feature)
                );
                if (!hasAllFeatures) return false;
            }

            return true;
        });
    }, [initialActivities, searchQuery, selectedCategory, priceRange, selectedDuration, selectedFeatures]);

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-12 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
                        All Things to do
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-6">
                        Discover the magic of Marrakech with our curated selection of premium activities, tours, and adventures.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search things to do..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-10 rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Sidebar - Sticky on desktop */}
                    <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
                        <FilterSidebar
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedDuration={selectedDuration}
                            setSelectedDuration={setSelectedDuration}
                            selectedFeatures={selectedFeatures}
                            setSelectedFeatures={setSelectedFeatures}
                        />
                    </aside>

                    {/* Main Content - Grid */}
                    <main className="w-full lg:w-3/4">
                        {filteredActivities.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                {filteredActivities.filter(activity => activity.id).map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center bg-secondary/30 rounded-2xl border border-dashed border-border px-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                                    No Things to do Found
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                                    Try adjusting your search or filters to find what you&apos;re looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setPriceRange([0, 6000]);
                                        setSelectedDuration("all");
                                        setSelectedFeatures([]);
                                    }}
                                    className="mt-2 text-primary font-medium hover:underline text-sm sm:text-base"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
