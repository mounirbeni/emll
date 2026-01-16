"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { X, Filter } from "lucide-react";

const CATEGORIES = [
    { id: "adventures", label: "Adventures" },
    { id: "city-tours", label: "City Tours" },
    { id: "food", label: "Food & Drink" },
    { id: "wellness", label: "Wellness" },
    { id: "excursions", label: "Excursions" },
    { id: "culture", label: "Culture & History" },
];

const DURATIONS = [
    { id: "0-3", label: "0-3 hours" },
    { id: "3-6", label: "3-6 hours" },
    { id: "6-12", label: "Half day (6-12h)" },
    { id: "12-24", label: "Full day" },
    { id: "24+", label: "Multi-day" },
];

const RATINGS = [
    { id: "5", label: "5 ★", min: 5 },
    { id: "4", label: "4+ ★", min: 4 },
    { id: "3", label: "3+ ★", min: 3 },
];

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    // Initialize filters from URL params
    useEffect(() => {
        const categories = searchParams.get("categories")?.split(",") || [];
        const durations = searchParams.get("durations")?.split(",") || [];
        const ratings = searchParams.get("ratings")?.split(",") || [];
        const minPrice = parseInt(searchParams.get("minPrice") || "0");
        const maxPrice = parseInt(searchParams.get("maxPrice") || "500");

        setSelectedCategories(categories.filter(Boolean));
        setSelectedDurations(durations.filter(Boolean));
        setSelectedRatings(ratings.filter(Boolean));
        setPriceRange([minPrice, maxPrice]);

        // Check if any filters are active
        const hasFilters = categories.length > 0 || durations.length > 0 || ratings.length > 0 || minPrice > 0 || maxPrice < 500;
        setHasActiveFilters(hasFilters);
    }, [searchParams]);

    const handleApplyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
        if (selectedDurations.length) params.set("durations", selectedDurations.join(","));
        if (selectedRatings.length) params.set("ratings", selectedRatings.join(","));
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 500) params.set("maxPrice", priceRange[1].toString());

        router.push(`/search?${params.toString()}`);
    }, [router, selectedCategories, selectedDurations, selectedRatings, priceRange]);

    const handleResetFilters = useCallback(() => {
        setSelectedCategories([]);
        setSelectedDurations([]);
        setSelectedRatings([]);
        setPriceRange([0, 500]);
        router.push('/search');
    }, [router]);

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleDuration = (id: string) => {
        setSelectedDurations(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const toggleRating = (id: string) => {
        setSelectedRatings(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    return (
        <>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    className="w-full"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    {isOpen ? 'Hide Filters' : 'Show Filters'}
                    {hasActiveFilters && <span className="ml-2 bg-primary text-white px-2 py-1 rounded-full text-xs">Active</span>}
                </Button>
            </div>

            {/* Filters Panel */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-8 p-6 bg-card rounded-xl border shadow-sm sticky top-24`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Filters</h3>
                    {hasActiveFilters && (
                        <Button
                            onClick={handleResetFilters}
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-accent"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Price Range */}
                <div>
                    <Label className="text-base font-semibold mb-3 block">Price Range</Label>
                    <div className="space-y-3">
                        <Slider
                            min={0}
                            max={500}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <Label className="text-base font-semibold mb-3 block">Category</Label>
                    <div className="space-y-2">
                        {CATEGORIES.map(category => (
                            <div key={category.id} className="flex items-center">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={() => toggleCategory(category.id)}
                                />
                                <Label
                                    htmlFor={`category-${category.id}`}
                                    className="ml-2 cursor-pointer text-sm font-normal"
                                >
                                    {category.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <Label className="text-base font-semibold mb-3 block">Duration</Label>
                    <div className="space-y-2">
                        {DURATIONS.map(duration => (
                            <div key={duration.id} className="flex items-center">
                                <Checkbox
                                    id={`duration-${duration.id}`}
                                    checked={selectedDurations.includes(duration.id)}
                                    onCheckedChange={() => toggleDuration(duration.id)}
                                />
                                <Label
                                    htmlFor={`duration-${duration.id}`}
                                    className="ml-2 cursor-pointer text-sm font-normal"
                                >
                                    {duration.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <Label className="text-base font-semibold mb-3 block">Rating</Label>
                    <div className="space-y-2">
                        {RATINGS.map(rating => (
                            <div key={rating.id} className="flex items-center">
                                <Checkbox
                                    id={`rating-${rating.id}`}
                                    checked={selectedRatings.includes(rating.id)}
                                    onCheckedChange={() => toggleRating(rating.id)}
                                />
                                <Label
                                    htmlFor={`rating-${rating.id}`}
                                    className="ml-2 cursor-pointer text-sm font-normal"
                                >
                                    {rating.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Apply Filters Button */}
                <Button
                    onClick={handleApplyFilters}
                    className="w-full bg-primary hover:bg-accent"
                >
                    Apply Filters
                </Button>
            </div>
        </>
    );
}
