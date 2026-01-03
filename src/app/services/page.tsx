'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Star, Users } from 'lucide-react'

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services')
                if (!response.ok) {
                    throw new Error('Failed to fetch services')
                }
                const data = await response.json()
                // Handle both wrapped and unwrapped responses
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
    }, [])

    if (loading) {
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

    if (error) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Discover Experiences</h1>
                        <p className="text-medium-gray">Explore our curated collection of authentic Marrakech adventures</p>
                    </div>
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
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Discover Experiences</h1>
                    <p className="text-medium-gray">Explore our curated collection of authentic Marrakech adventures</p>
                </div>

                {services.length === 0 ? (
                    <EmptyState
                        icon="services"
                        title="No experiences available yet"
                        description="We're preparing amazing experiences for you. Check back soon!"
                        action={{
                            label: "Back to Home",
                            onClick: () => window.location.href = '/'
                        }}
                    />
                ) : (
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
                                            <span className="bg-white/95 backdrop-blur-sm text-charcoal text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
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
    )
}