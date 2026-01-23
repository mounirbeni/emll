"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search } from "lucide-react";
import { Activity } from "@/lib/types";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { FilterBar } from "@/components/experiences/FilterBar";
import { CategoryPills } from "@/components/experiences/CategoryPills";
import { MobileFilterDrawer } from "@/components/experiences/MobileFilterDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExperiencesClientProps {
    initialActivities: Activity[];
}

const CATEGORIES = ["All", "Adventures", "City Tours", "Food & Drink", "Culture", "Wellness", "Excursions", "Transport"];

export default function ExperiencesClient({ initialActivities }: ExperiencesClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // -- State --
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

    // Filters
    const [priceRange, setPriceRange] = useState([0, searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 600]);
    const [selectedDuration, setSelectedDuration] = useState(searchParams.get("duration") || "all");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
        searchParams.get("features") ? searchParams.get("features")?.split(",") || [] : []
    );

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // -- Sync URL --
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
        if (priceRange[1] < 600) params.set("maxPrice", priceRange[1].toString());
        if (selectedDuration && selectedDuration !== "all") params.set("duration", selectedDuration);
        if (selectedFeatures.length > 0) params.set("features", selectedFeatures.join(","));

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [searchQuery, selectedCategory, priceRange, selectedDuration, selectedFeatures, pathname, router]);

    // -- Filtering Logic --
    const filteredActivities = useMemo(() => {
        return initialActivities.filter((activity) => {
            if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) && !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            if (selectedCategory !== "All") {
                const matchesCategory = activity.category === selectedCategory || activity.tags?.includes(selectedCategory);
                if (!matchesCategory) return false;
            }

            if (Number(activity.price) < priceRange[0] || Number(activity.price) > priceRange[1]) return false;

            if (selectedDuration !== "all") {
                const durationHours = parseInt(activity.duration);
                if (selectedDuration === "half-day" && durationHours > 4) return false;
                if (selectedDuration === "full-day" && durationHours <= 4) return false;
            }

            if (selectedFeatures.length > 0) {
                const hasAllFeatures = selectedFeatures.every((f) => activity.features?.includes(f));
                if (!hasAllFeatures) return false;
            }

            return true;
        });
    }, [initialActivities, searchQuery, selectedCategory, priceRange, selectedDuration, selectedFeatures]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* -- Mobile "App" Header (Sticky) -- */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow-sm">
                <div className="relative flex-1 mr-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-full h-10 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/20 text-gray-800 placeholder:text-gray-400"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className={cn("text-gray-600 hover:text-primary relative",
                        (priceRange[1] < 600 || selectedDuration !== "all" || selectedFeatures.length > 0) && "text-primary"
                    )}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    {(priceRange[1] < 600 || selectedDuration !== "all" || selectedFeatures.length > 0) && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-white" />
                    )}
                </Button>
            </div>

            {/* -- Desktop Header (Title Only) -- */}
            <div className="hidden lg:block bg-white pt-28 pb-8 px-8">
                <div className="max-w-[1400px] mx-auto flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            Explore <span className="text-primary">Experiences</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl">
                            Curated adventures in Marrakech. Strictly premium.
                        </p>
                    </div>
                    {/* Desktop Search */}
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm text-gray-800"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* -- Sticky Category Pills -- */}
            <CategoryPills
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {/* -- Desktop Filter Bar -- */}
            <div className="border-b border-gray-100 bg-white sticky top-[136px] z-20 hidden lg:block">
                <div className="max-w-[1400px] mx-auto px-8">
                    <FilterBar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedFeatures={selectedFeatures}
                        setSelectedFeatures={setSelectedFeatures}
                    />
                </div>
            </div>

            {/* -- Main Content Grid -- */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 hidden lg:block">
                        {filteredActivities.length} {filteredActivities.length === 1 ? 'Experience' : 'Experiences'}
                    </h2>
                    {/* Mobile Results Count */}
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide lg:hidden">
                        {filteredActivities.length} Results
                    </span>
                </div>

                {filteredActivities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredActivities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Try adjusting your search or filters to find what you&apos;re looking for.
                        </p>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-8"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                                setPriceRange([0, 600]);
                                setSelectedFeatures([]);
                                setSelectedDuration("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>

            {/* -- Mobile Filter Drawer -- */}
            <MobileFilterDrawer
                open={isMobileFilterOpen}
                onOpenChange={setIsMobileFilterOpen}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                selectedFeatures={selectedFeatures}
                setSelectedFeatures={setSelectedFeatures}
                totalResults={filteredActivities.length}
            />
        </div>
    );
}
