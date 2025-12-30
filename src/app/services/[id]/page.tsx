'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { BookingModal } from '@/components/bookings/BookingModal'

export default function ServiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [service, setService] = useState<Service | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchService = async () => {
            if (!id) {
                setError('Invalid service ID')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`/api/services/${id}`)
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        return
                    }
                    throw new Error('Failed to fetch service')
                }
                const data = await response.json()
                // Handle both wrapped and unwrapped responses
                const serviceData = data.data || data
                setService(serviceData)
            } catch (err) {
                setError('Failed to load service')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchService()
    }, [id])

    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    const { data: session, status } = useSession()

    const handleBookNow = () => {
        if (status === 'unauthenticated') {
            // Redirect to login with return URL
            const returnUrl = encodeURIComponent(`/services/${id}`)
            window.location.href = `/login?from=${returnUrl}`
            return
        }

        // Authenticated - Open Booking Modal
        setIsBookingModalOpen(true)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading service...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (notFound || (!service && !loading)) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">Service Not Found</h1>
                    <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/services')}>
                        Back to Services
                    </Button>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive mb-4">{error}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/services')}>
                            Back to Services
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (bookingSuccess) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-md mx-auto text-center space-y-4 p-6 sm:p-8 border rounded-lg bg-green-50">
                    <h1 className="text-xl sm:text-2xl font-bold text-green-800">Booking Confirmed!</h1>
                    <p className="text-sm sm:text-base text-green-700">
                        Your reservation for <strong>{service?.title}</strong> has been placed successfully.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
                        <Button 
                            className="w-full sm:w-auto text-sm sm:text-base"
                            onClick={() => router.push('/client')}
                        >
                            View in Dashboard
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto text-sm sm:text-base"
                            onClick={() => setBookingSuccess(false)}
                        >
                            Back to Service
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Button 
                variant="outline" 
                className="mb-4 sm:mb-6 text-sm sm:text-base" 
                onClick={() => router.back()}
            >
                ← Back
            </Button>

            {service && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    serviceTitle={service.title}
                    servicePrice={service.price}
                    serviceId={service.id}
                    onBookingSuccess={() => setBookingSuccess(true)}
                    user={session?.user}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">{service?.title}</h1>
                    <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{service?.category}</p>

                    <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden mb-4 sm:mb-6">
                        {service?.images && service.images[0] ? (
                            <Image
                                src={service.images[0]}
                                alt={service.title || 'Service image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                priority
                            />
                        ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                                <span className="text-gray-500 text-sm sm:text-base">No image available</span>
                            </div>
                        )}
                    </div>

                    <Card className="mb-4 sm:mb-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm sm:text-base whitespace-pre-wrap">{service?.description}</p>
                        </CardContent>
                    </Card>

                    {service?.itinerary && (
                        <Card className="mb-4 sm:mb-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg sm:text-xl">Itinerary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 sm:space-y-4">
                                    {Array.isArray(service.itinerary) && service.itinerary.map((item: any, index: number) => (
                                        <li key={index} className="border-l-2 border-primary pl-3 sm:pl-4 py-1">
                                            <h3 className="font-semibold text-sm sm:text-base">{item.time} - {item.title}</h3>
                                            <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:sticky lg:top-4 lg:h-fit">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl">Booking Information</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Reserve your spot for this experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base sm:text-lg font-semibold">Price:</span>
                                <span className="text-xl sm:text-2xl font-bold">€{service?.price.toFixed(2)}</span>
                            </div>

                            <Button
                                className="w-full text-sm sm:text-base"
                                size="lg"
                                onClick={handleBookNow}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? 'Checking...' : 'Book Now'}
                            </Button>

                            <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-3 text-sm sm:text-base">Details</h3>
                                <ul className="space-y-2 text-xs sm:text-sm">
                                    <li className="flex justify-between items-start border-b pb-2 gap-2">
                                        <span className="text-muted-foreground">Activity ID:</span>
                                        <span className="font-mono font-medium text-right">{(service as any)?.shortId || 'N/A'}</span>
                                    </li>
                                    {service?.duration && (
                                        <li className="flex justify-between items-start gap-2">
                                            <span className="text-muted-foreground">Duration:</span>
                                            <span className="text-right">{service.duration}</span>
                                        </li>
                                    )}
                                    {service?.location && (
                                        <li className="flex justify-between items-start gap-2">
                                            <span className="text-muted-foreground">Location:</span>
                                            <span className="text-right break-words">{service.location}</span>
                                        </li>
                                    )}
                                    <li className="flex justify-between items-start gap-2">
                                        <span className="text-muted-foreground">Rating:</span>
                                        <span className="text-right">{service?.rating || 0}/5 ({service?.reviews || 0} reviews)</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}