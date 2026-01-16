"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Clock, Loader2 } from "lucide-react";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    rating: number;
    reviewCount: number;
    image?: string;
    location: string;
    maxGuests: number;
}

interface SearchResultsProps {
    services: Service[];
    isLoading?: boolean;
    sortBy?: "relevant" | "price-low" | "price-high" | "rating" | "newest";
}

type SortOption = "relevant" | "price-low" | "price-high" | "rating" | "newest";

export function SearchResults({ services, isLoading = false, sortBy = "relevant" }: SearchResultsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentSort, setCurrentSort] = useState<SortOption>(sortBy);

    // Apply sorting
    const sortedServices = useMemo(() => {
        const sorted = [...services];
        
        switch (currentSort) {
            case "price-low":
                return sorted.sort((a, b) => a.price - b.price);
            case "price-high":
                return sorted.sort((a, b) => b.price - a.price);
            case "rating":
                return sorted.sort((a, b) => b.rating - a.rating);
            case "newest":
                return sorted.reverse();
            case "relevant":
            default:
                return sorted;
        }
    }, [services, currentSort]);

    const handleSortChange = (newSort: SortOption) => {
        setCurrentSort(newSort);
    };

    // Get active filters for display
    const getActiveFilters = () => {
        const filters = [];
        const categories = searchParams.get("categories");
        const durations = searchParams.get("durations");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        if (categories) filters.push(`Categories: ${categories}`);
        if (durations) filters.push(`Duration: ${durations}`);
        if (minPrice || maxPrice) {
            const min = minPrice || "0";
            const max = maxPrice || "500";
            filters.push(`Price: $${min} - $${max}`);
        }
        return filters;
    };

    const activeFilters = getActiveFilters();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-muted-foreground">Loading experiences...</p>
            </div>
        );
    }

    // Empty state
    if (services.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
                    <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or searching for something different.
                    </p>
                    <Button
                        onClick={() => router.push('/search')}
                        className="bg-primary hover:bg-accent"
                    >
                        Clear filters
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        {sortedServices.length} Experience{sortedServices.length !== 1 ? 's' : ''} Found
                    </h2>
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {activeFilters.map((filter, idx) => (
                                <span
                                    key={idx}
                                    className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                                >
                                    {filter}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex gap-2">
                    <select
                        value={currentSort}
                        onChange={(e) => handleSortChange(e.target.value as SortOption)}
                        className="px-4 py-2 border rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="relevant">Most Relevant</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service) => (
                    <Link
                        key={service.id}
                        href={`/experiences/${service.id}`}
                        className="group"
                    >
                        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                            {/* Image */}
                            <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                                {service.image ? (
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <span className="text-muted-foreground">No image</span>
                                    </div>
                                )}
                                {/* Category Badge */}
                                <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {service.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                {/* Title */}
                                <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {service.description}
                                </p>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{service.location}</span>
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-4 w-4 flex-shrink-0" />
                                        <span>{service.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="h-4 w-4 flex-shrink-0" />
                                        <span>Up to {service.maxGuests}</span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < Math.floor(service.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({service.reviewCount} reviews)
                                    </span>
                                </div>

                                {/* Price and CTA - Spacer makes this stick to bottom */}
                                <div className="mt-auto space-y-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-primary">
                                            ${service.price}
                                        </span>
                                        <span className="text-sm text-muted-foreground">per person</span>
                                    </div>
                                    <Button
                                        className="w-full bg-primary hover:bg-accent"
                                        size="sm"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination or Load More (Optional) */}
            {sortedServices.length > 9 && (
                <div className="flex justify-center pt-6">
                    <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10"
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
}
