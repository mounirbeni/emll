'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types/admin'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Services</h1>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading services...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Services</h1>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">{error}</p>
                    <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">Our Services</h1>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Explore our wide range of luxury services and experiences.
            </p>
            
            {services.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No services available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {services.map((service) => (
                        <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                            {service.images && service.images[0] && (
                                <div className="relative h-48 sm:h-56 w-full">
                                    <Image
                                        src={service.images[0]}
                                        alt={service.title || 'Service image'}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg sm:text-xl line-clamp-2">{service.title}</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">{service.category}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow pb-3">
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3">
                                    {service.description}
                                </p>
                                <div className="mt-2 sm:mt-4">
                                    <span className="text-lg sm:text-xl font-bold">€{service.price.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-3">
                                <Button asChild className="w-full text-sm sm:text-base">
                                    <Link href={`/services/${service.id}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}