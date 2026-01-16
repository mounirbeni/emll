'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReviewsSection, type Review as DisplayReview } from '@/components/experiences/ReviewsSection'
import { mockReviews } from '@/lib/data/mock-reviews'
import { getTravelerIdentity } from '@/lib/reviews/traveler-identity'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { BookingWizard } from '@/components/bookings/BookingWizard'
import { Clock, MapPin, Users, Star, Shield, CheckCircle, ArrowLeft, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react'

export default function ServiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [service, setService] = useState<Service | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState(false)

    const [reviews, setReviews] = useState<DisplayReview[]>([])
    const [reviewsLoading, setReviewsLoading] = useState(false)

    // Image carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return
            setReviewsLoading(true)
            try {
                const res = await fetch(`/api/reviews?serviceId=${encodeURIComponent(id)}&limit=10`)
                if (!res.ok) throw new Error('Failed to fetch reviews')
                const data = await res.json()

                const mapped: DisplayReview[] = Array.isArray(data)
                    ? data.map((r: any) => {
                        const rawName = (r?.user as { name?: string | null } | null)?.name
                        const identity = rawName && rawName.trim().length > 0
                            ? { author: rawName, nationality: 'Traveler', countryCode: 'MA' }
                            : getTravelerIdentity(String(r?.id || r?.userId || r?.serviceId || id))

                        return {
                            id: String(r?.id || cryptoRandomFallback()),
                            author: identity.author,
                            nationality: identity.nationality,
                            countryCode: identity.countryCode,
                            rating: Number(r?.rating || 0),
                            date: new Date(r?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }),
                            comment: String(r?.comment || ''),
                            verified: true,
                            helpful: 0,
                        }
                    })
                    : []

                setReviews(mapped)
            } catch (e) {
                setReviews([])
            } finally {
                setReviewsLoading(false)
            }
        }

        fetchReviews()
    }, [id])

    const reviewsToDisplay = reviews.length > 0 ? reviews : mockReviews
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : (service?.rating || 0)
    const totalReviews = reviews.length > 0 ? reviews.length : (service?.reviews || 0)
    const hasReviews = totalReviews > 0

    function cryptoRandomFallback() {
        try {
            return Math.random().toString(36).slice(2)
        } catch {
            return 'id'
        }
    }

    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    const { data: session, status } = useSession()
    const isGuest = status === 'unauthenticated'

    const handleBookNow = () => {
        if (isGuest) {
            const callbackUrl = encodeURIComponent(`/services/${id}`)
            router.push(`/login?callbackUrl=${callbackUrl}`)
            return
        }
        setIsBookingModalOpen(true)
    }

    // Image carousel handlers
    const images = service?.images || []
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    const goToImage = (index: number) => {
        setCurrentImageIndex(index)
    }

    // Get map URL for location
    const getMapUrl = () => {
        if (service?.latitude && service?.longitude) {
            return `https://www.google.com/maps?q=${service.latitude},${service.longitude}&output=embed`
        }
        if (service?.location) {
            return `https://www.google.com/maps?q=${encodeURIComponent(service.location)}&output=embed`
        }
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <Skeleton className="h-8 w-24 mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-[400px] w-full rounded-xl" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <Skeleton className="h-[350px] w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (notFound || (!service && !loading)) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="bg-white rounded-xl border border-border p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h1 className="text-2xl font-bold text-charcoal mb-3">Experience Not Found</h1>
                        <p className="text-medium-gray mb-6">This experience may have been removed or the link is incorrect.</p>
                        <Button onClick={() => router.push('/services')} size="lg" className="rounded-full px-8">
                            Explore Other Experiences
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="bg-white rounded-xl border border-border p-8 text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-charcoal mb-2">Something went wrong</h3>
                        <p className="text-medium-gray text-sm mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                            <Button onClick={() => router.push('/services')}>
                                Browse Experiences
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl border border-border shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-2">Booking Confirmed!</h1>
                    <p className="text-medium-gray mb-6">
                        Your reservation for <span className="font-semibold text-charcoal">{service?.title}</span> has been placed successfully.
                    </p>
                    <div className="bg-cream-dark rounded-xl p-4 mb-6">
                        <p className="text-sm text-medium-gray">What's next?</p>
                        <p className="text-sm text-charcoal">Check your email for confirmation details and prepare for an amazing experience!</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            size="lg"
                            className="rounded-full px-6"
                            onClick={() => router.push('/client')}
                        >
                            View My Bookings
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-6"
                            onClick={() => setBookingSuccess(false)}
                        >
                            Back to Experience
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream pb-24 lg:pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-medium-gray hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to experiences</span>
                </button>

                {service && (
                    <BookingWizard
                        isOpen={isBookingModalOpen}
                        onClose={() => setIsBookingModalOpen(false)}
                        serviceTitle={service.title}
                        servicePrice={Number(service.price)}
                        serviceId={service.id}
                        onBookingSuccess={() => setBookingSuccess(true)}
                        user={session?.user}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Category & Rating */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                {service?.category}
                            </span>
                            {service?.rating && (
                                <span className="flex items-center gap-1 text-sm text-charcoal">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span className="font-semibold">{service.rating}</span>
                                    <span className="text-medium-gray">({service.reviews || 0} reviews)</span>
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal mb-4">{service?.title}</h1>

                        {/* Quick Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-medium-gray">
                            {service?.duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {service.duration}
                                </span>
                            )}
                            {service?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {service.location}
                                </span>
                            )}
                        </div>

                        {/* Hero Image Carousel */}
                        {images.length > 0 && (
                            <div className="relative h-64 sm:h-80 lg:h-[500px] w-full rounded-2xl overflow-hidden mb-6 shadow-lg group">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${service?.title || 'Experience'} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-cover transition-opacity duration-300"
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    priority={currentImageIndex === 0}
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>

                                        {/* Image Indicators */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => goToImage(idx)}
                                                    className={`h-2 rounded-full transition-all ${idx === currentImageIndex
                                                            ? 'w-8 bg-white'
                                                            : 'w-2 bg-white/50 hover:bg-white/75'
                                                        }`}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Image Counter */}
                                        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Highlights / What's Included */}
                        {((service?.highlights?.length ?? 0) > 0 || (service?.included?.length ?? 0) > 0) && (
                            <Card className="mb-6 border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl text-charcoal">Highlights & What's Included</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {service?.highlights && service.highlights.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-charcoal mb-3">Highlights</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {service.highlights.map((highlight, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-medium-gray">{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {service?.included && service.included.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-charcoal mb-3">What's Included</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {service.included.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-medium-gray">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Description Card */}
                        <Card className="mb-6 border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl text-charcoal">About this experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-medium-gray leading-relaxed whitespace-pre-wrap">{service?.description}</p>
                            </CardContent>
                        </Card>

                        {/* Itinerary */}
                        {service?.itinerary && Array.isArray(service.itinerary) && service.itinerary.length > 0 && (
                            <Card className="mb-6 border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl text-charcoal">What to expect</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {service.itinerary.map((item: any, index: number) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    {index < (service.itinerary?.length || 0) - 1 && (
                                                        <div className="w-0.5 h-full bg-primary/20 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="text-xs text-primary font-medium mb-1">{item.time}</p>
                                                    <h4 className="font-semibold text-charcoal mb-1">{item.title}</h4>
                                                    <p className="text-sm text-medium-gray">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Map / Location Section */}
                        {getMapUrl() && (
                            <Card className="mb-6 border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl text-charcoal flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg overflow-hidden h-64 sm:h-80">
                                        <iframe
                                            src={getMapUrl() || ''}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    {service?.location && (
                                        <p className="mt-4 text-sm text-medium-gray flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {service.location}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Trust Badges */}
                        <div className="bg-white rounded-xl p-5 border border-border mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-charcoal">Free Cancellation</p>
                                        <p className="text-xs text-medium-gray">Up to 24h before</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-charcoal">Local Experts</p>
                                        <p className="text-xs text-medium-gray">Certified guides</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-info" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-charcoal">Reserve Now</p>
                                        <p className="text-xs text-medium-gray">Pay later option</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {hasReviews && (
                            <div className="mt-12">
                                <ReviewsSection
                                    reviews={reviewsToDisplay}
                                    averageRating={averageRating}
                                    totalReviews={totalReviews}
                                />
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar (Desktop) - Sticky */}
                    <div className="hidden lg:block lg:sticky lg:top-6 lg:h-fit">
                        <Card className="border-0 shadow-xl">
                            <CardContent className="p-6">
                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-sm text-medium-gray mb-1">From</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-primary">€{Number(service?.price).toFixed(0)}</span>
                                        <span className="text-medium-gray">per person</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 mb-4"
                                    variant="premium"
                                    onClick={handleBookNow}
                                    disabled={bookingLoading}
                                >
                                    {isGuest ? 'Login to Book' : (bookingLoading ? 'Checking...' : 'Book Now')}
                                </Button>

                                <p className="text-center text-xs text-medium-gray mb-6">You won't be charged yet</p>

                                {/* Details */}
                                <div className="border-t border-border pt-4 space-y-3">
                                    {service?.duration && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-medium-gray">
                                                <Clock className="w-4 h-4" /> Duration
                                            </span>
                                            <span className="font-medium text-charcoal">{service.duration}</span>
                                        </div>
                                    )}
                                    {service?.location && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-medium-gray">
                                                <MapPin className="w-4 h-4" /> Meeting point
                                            </span>
                                            <span className="font-medium text-charcoal text-right max-w-[150px] truncate">{service.location}</span>
                                        </div>
                                    )}
                                    {service?.rating && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-medium-gray">
                                                <Star className="w-4 h-4" /> Rating
                                            </span>
                                            <span className="font-medium text-charcoal">{service.rating}/5 ({service.reviews || 0})</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border lg:hidden z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                    <div>
                        <p className="text-xs text-medium-gray">From</p>
                        <p className="text-xl font-bold text-primary">€{Number(service?.price).toFixed(0)}</p>
                    </div>
                    <Button
                        size="lg"
                        variant="premium"
                        onClick={handleBookNow}
                        disabled={bookingLoading}
                        className="flex-1 h-12 font-bold text-base rounded-xl shadow-lg shadow-primary/30"
                    >
                        {isGuest ? 'Login to Book' : (bookingLoading ? 'Checking...' : 'Book Now')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
