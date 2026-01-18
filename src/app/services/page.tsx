'use client'

import { useState, useEffect, useMemo } from 'react'
import { Service } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SkeletonCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Star, Users, Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MobileServicesLayout } from '@/components/mobile/MobileServicesLayout'

type SortOption = 'relevant' | 'price-low' | 'price-high' | 'rating' | 'newest'

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<SortOption>('relevant')
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
    const [showFilters, setShowFilters] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState(0)

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                setError(null)

                // Build query params
                const params = new URLSearchParams()
                if (searchQuery.trim()) {
                    params.set('search', searchQuery.trim())
                }
                if (selectedCategory && selectedCategory !== 'all') {
                    params.set('category', selectedCategory)
                }
                if (priceRange.min > 0) {
                    params.set('minPrice', priceRange.min.toString())
                }
                if (priceRange.max < 1000) {
                    params.set('maxPrice', priceRange.max.toString())
                }

                // Map sort options to API params
                let sortByParam: string | undefined
                let sortOrderParam: 'asc' | 'desc' | undefined
                switch (sortBy) {
                    case 'price-low':
                        sortByParam = 'price'
                        sortOrderParam = 'asc'
                        break
                    case 'price-high':
                        sortByParam = 'price'
                        sortOrderParam = 'desc'
                        break
                    case 'rating':
                        sortByParam = 'rating'
                        sortOrderParam = 'desc'
                        break
                    case 'newest':
                        sortByParam = 'newest'
                        sortOrderParam = 'desc'
                        break
                    default:
                        // 'relevant' - no sort param, let backend decide
                        break
                }

                if (sortByParam) {
                    params.set('sortBy', sortByParam)
                    if (sortOrderParam) {
                        params.set('sortOrder', sortOrderParam)
                    }
                }

                const response = await fetch(`/api/services?${params.toString()}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch services')
                }
                const data = await response.json()
                const servicesData = Array.isArray(data) ? data : (data.data || data)
                setServices(Array.isArray(servicesData) ? servicesData : [])
            } catch (err) {
                setError('Failed to load services')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [searchQuery, selectedCategory, sortBy, priceRange])

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>()
        services.forEach(s => {
            if (s.category) cats.add(s.category)
        })
        return Array.from(cats).sort()
    }, [services])

    // Count applied filters
    useEffect(() => {
        let count = 0
        if (searchQuery.trim()) count++
        if (selectedCategory && selectedCategory !== 'all') count++
        if (priceRange.min > 0 || priceRange.max < 1000) count++
        if (sortBy !== 'relevant') count++
        setAppliedFilters(count)
    }, [searchQuery, selectedCategory, priceRange, sortBy])

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategory('all')
        setSortBy('relevant')
        setPriceRange({ min: 0, max: 1000 })
    }

    if (loading && services.length === 0) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Discover Experiences</h1>
                        <p className="text-medium-gray">Explore our curated collection of authentic Marrakech adventures</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Mobile Layout */}
            <div className="md:hidden">
                <MobileServicesLayout
                    services={services}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    appliedFilters={appliedFilters}
                    clearFilters={clearFilters}
                    categories={categories}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                />
            </div>

            {/* Desktop Layout - Unchanged */}
            <div className="hidden md:block min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Discover Experiences</h1>
                        <p className="text-medium-gray">Explore our curated collection of authentic Marrakech adventures</p>
                    </div>

                    {/* Search and Filters Bar */}
                    <Card className="mb-6 border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-gray" />
                                    <Input
                                        placeholder="Search experiences..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-11"
                                    />
                                </div>

                                {/* Filters Row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Category Filter */}
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full sm:w-[180px] h-11">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Sort Filter */}
                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                        <SelectTrigger className="w-full sm:w-[180px] h-11">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="relevant">Most Relevant</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Price Range Toggle */}
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="h-11"
                                    >
                                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                                        Price Range
                                        {appliedFilters > 0 && (
                                            <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                                                {appliedFilters}
                                            </span>
                                        )}
                                    </Button>

                                    {/* Clear Filters */}
                                    {appliedFilters > 0 && (
                                        <Button
                                            variant="ghost"
                                            onClick={clearFilters}
                                            className="h-11"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                    )}
                                </div>

                                {/* Price Range Slider (Expanded) */}
                                {showFilters && (
                                    <div className="pt-4 border-t border-border">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-charcoal mb-2 block">
                                                    Min Price (€)
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) || 0 })}
                                                    className="h-10"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-charcoal mb-2 block">
                                                    Max Price (€)
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 1000 })}
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Count */}
                    {!loading && (
                        <div className="mb-6 text-sm text-medium-gray">
                            {services.length} {services.length === 1 ? 'experience' : 'experiences'} found
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-white rounded-xl border border-border p-8 text-center max-w-md mx-auto">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-charcoal mb-2">Unable to load services</h3>
                            <p className="text-medium-gray text-sm mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && services.length === 0 && (
                        <EmptyState
                            icon="services"
                            title="No experiences found"
                            description={appliedFilters > 0
                                ? "Try adjusting your filters to see more results."
                                : "We're preparing amazing experiences for you. Check back soon!"
                            }
                            action={appliedFilters > 0 ? {
                                label: "Clear Filters",
                                onClick: clearFilters
                            } : {
                                label: "Back to Home",
                                onClick: () => window.location.href = '/'
                            }}
                        />
                    )}

                    {/* Services Grid */}
                    {!loading && !error && services.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
                                        {/* Image Container */}
                                        <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                                            {service.images && service.images[0] ? (
                                                <Image
                                                    src={service.images[0]}
                                                    alt={service.title || 'Experience image'}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <span className="text-4xl">🏛️</span>
                                                </div>
                                            )}
                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white text-charcoal text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                                                    {service.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-charcoal text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {service.title}
                                            </h3>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < Math.floor(service.rating || 0)
                                                                ? 'text-primary fill-primary'
                                                                : 'text-border'
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="text-xs font-semibold text-charcoal ml-1">
                                                        {(service.rating || 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-medium-gray">
                                                    {(service.reviews || 0) > 0 ? `${service.reviews} reviews` : 'New'}
                                                </span>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 text-xs text-medium-gray mb-3">
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

                                            <p className="text-sm text-medium-gray line-clamp-2 mb-4">
                                                {service.description}
                                            </p>

                                            {/* Price & CTA */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                <div>
                                                    <span className="text-xs text-medium-gray">From</span>
                                                    <p className="text-lg font-bold text-primary">€{service.price.toFixed(0)}</p>
                                                </div>
                                                <Button size="sm" className="rounded-full px-4 shadow-md shadow-primary/20">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
        </>
    )
}
