"use client"

import { Service } from "@/types/admin"
import { MobileFiltersSheet } from "@/components/mobile/MobileFiltersSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin } from "lucide-react"

interface MobileServicesLayoutProps {
    services: Service[]
    loading: boolean
    error: string | null
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    sortBy: string
    setSortBy: (sort: string) => void
    priceRange: { min: number; max: number }
    setPriceRange: (range: { min: number; max: number }) => void
    appliedFilters: number
    clearFilters: () => void
    categories: string[]
    showFilters: boolean
    setShowFilters: (show: boolean) => void
}

export function MobileServicesLayout({
    services,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    appliedFilters,
    clearFilters,
    categories,
    showFilters,
    setShowFilters
}: MobileServicesLayoutProps) {
    return (
        <div className="min-h-screen bg-beige-50 pb-20">
            {/* Mobile Header */}
            <div className="bg-white px-4 py-4 sticky top-14 z-30 border-b">
                <h1 className="text-2xl font-bold text-charcoal mb-1">Explore</h1>
                <p className="text-sm text-gray-600">Discover Marrakech experiences</p>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-4 bg-white border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 rounded-full border-gray-200"
                    />
                </div>
            </div>

            {/* Quick Filters */}
            <div className="px-4 py-3 bg-white border-b flex items-center gap-2 overflow-x-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="rounded-full flex-shrink-0 h-9"
                >
                    <Filter className="mr-1.5 h-4 w-4" />
                    Filters
                    {appliedFilters > 0 && (
                        <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                            {appliedFilters}
                        </span>
                    )}
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 rounded-full flex-shrink-0 w-auto border-gray-200">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevant">Relevant</SelectItem>
                        <SelectItem value="price-low">Price: Low-High</SelectItem>
                        <SelectItem value="price-high">Price: High-Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="px-4 py-3 text-sm text-gray-600">
                    {services.length} {services.length === 1 ? 'experience' : 'experiences'}
                </div>
            )}

            {/* Services List - 1 Column */}
            <div className="px-4 space-y-4 pb-4">
                {!loading && !error && services.length > 0 && services.map((service) => (
                    <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block"
                    >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform">
                            {/* Image */}
                            <div className="relative h-48 w-full">
                                {service.images && service.images[0] ? (
                                    <Image
                                        src={service.images[0]}
                                        alt={service.title || 'Experience'}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                        <span className="text-5xl">🏛️</span>
                                    </div>
                                )}
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/95 backdrop-blur-sm text-charcoal text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                        {service.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-base text-charcoal mb-2 line-clamp-2">
                                    {service.title}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < Math.floor(service.rating || 0)
                                                    ? 'text-orange-500 fill-orange-500'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-charcoal">
                                        {(service.rating || 0).toFixed(1)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({service.reviews || 0})
                                    </span>
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                                    {service.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {service.duration}
                                        </span>
                                    )}
                                    {service.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {service.location.split(',')[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <span className="text-xs text-gray-500">From</span>
                                        <p className="text-xl font-bold text-orange-500">€{service.price.toFixed(0)}</p>
                                    </div>
                                    <Button size="sm" className="rounded-full bg-orange-500 hover:bg-orange-600 h-9 px-5">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && services.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-charcoal mb-2">No experiences found</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            {appliedFilters > 0 ? "Try adjusting your filters" : "Check back soon for new experiences"}
                        </p>
                        {appliedFilters > 0 && (
                            <Button onClick={clearFilters} variant="outline" className="rounded-full">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-lg font-semibold text-charcoal mb-2">Unable to load</h3>
                        <p className="text-gray-600 text-sm mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} className="rounded-full bg-orange-500">
                            Try Again
                        </Button>
                    </div>
                )}
            </div>

            {/* Filters Bottom Sheet */}
            <MobileFiltersSheet
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                appliedCount={appliedFilters}
                onClear={clearFilters}
            >
                <div className="space-y-6">
                    {/* Category */}
                    <div>
                        <label className="text-sm font-semibold text-charcoal mb-3 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="text-sm font-semibold text-charcoal mb-3 block">Price Range</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-600 mb-1.5 block">Min (€)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="1000"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) || 0 })}
                                    className="h-12"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 mb-1.5 block">Max (€)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="1000"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 1000 })}
                                    className="h-12"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </MobileFiltersSheet>
        </div>
    )
}
