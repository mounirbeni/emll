"use client"

import { Service } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Star, Clock, MapPin, Users, Shield, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MobileServiceDetailsProps {
    service: Service
    reviews: any[]
    onBookNow: () => void
}

export function MobileServiceDetails({ service, reviews, onBookNow }: MobileServiceDetailsProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [expandedSection, setExpandedSection] = useState<string | null>("about")

    const images = service.images && service.images.length > 0 ? service.images : ["/placeholder.jpg"]

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : service.rating || 0

    return (
        <div className="min-h-screen bg-beige-50 pb-24">
            {/* Image Gallery - Full Width */}
            <div className="relative h-[320px] bg-gray-900">
                <Image
                    src={images[currentImageIndex]}
                    alt={service.title || "Experience"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}

                {/* Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    index === currentImageIndex
                                        ? "bg-white w-6"
                                        : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="px-4 py-4 space-y-4">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-50 text-orange-600 border-orange-200">
                            {service.category}
                        </Badge>
                        {service.featured && (
                            <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                                ⭐ Featured
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-charcoal mb-2">
                        {service.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "w-4 h-4",
                                        i < Math.floor(averageRating)
                                            ? "text-orange-500 fill-orange-500"
                                            : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-charcoal">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        {service.duration && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {service.duration}
                            </span>
                        )}
                        {service.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {service.location.split(',')[0]}
                            </span>
                        )}
                        {service.maxGuests && (
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                Up to {service.maxGuests} guests
                            </span>
                        )}
                    </div>
                </div>

                {/* Price Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-gray-500">From</span>
                            <p className="text-3xl font-bold text-orange-500">€{service.price.toFixed(0)}</p>
                            <span className="text-xs text-gray-500">per person</span>
                        </div>
                        <Button
                            onClick={onBookNow}
                            className="bg-orange-500 hover:bg-orange-600 rounded-full px-6 h-11"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-2">
                    {/* About Section */}
                    <AccordionSection
                        title="About"
                        isExpanded={expandedSection === "about"}
                        onToggle={() => toggleSection("about")}
                    >
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {service.description}
                        </p>
                    </AccordionSection>

                    {/* Highlights Section */}
                    {service.highlights && service.highlights.length > 0 && (
                        <AccordionSection
                            title="Highlights"
                            isExpanded={expandedSection === "highlights"}
                            onToggle={() => toggleSection("highlights")}
                        >
                            <ul className="space-y-2">
                                {service.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionSection>
                    )}

                    {/* Included Section */}
                    {service.included && service.included.length > 0 && (
                        <AccordionSection
                            title="What's Included"
                            isExpanded={expandedSection === "included"}
                            onToggle={() => toggleSection("included")}
                        >
                            <ul className="space-y-2">
                                {service.included.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionSection>
                    )}

                    {/* Meeting Point Section */}
                    {service.meetingPoint && (
                        <AccordionSection
                            title="Meeting Point"
                            isExpanded={expandedSection === "meeting"}
                            onToggle={() => toggleSection("meeting")}
                        >
                            <p className="text-gray-700">{service.meetingPoint}</p>
                        </AccordionSection>
                    )}

                    {/* Reviews Section */}
                    {reviews.length > 0 && (
                        <AccordionSection
                            title={`Reviews (${reviews.length})`}
                            isExpanded={expandedSection === "reviews"}
                            onToggle={() => toggleSection("reviews")}
                        >
                            <div className="space-y-4">
                                {reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-charcoal">
                                                {review.userName || 'Anonymous'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn(
                                                            "w-3.5 h-3.5",
                                                            i < review.rating
                                                                ? "text-orange-500 fill-orange-500"
                                                                : "text-gray-300"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {review.comment}
                                        </p>
                                        {review.createdAt && (
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </AccordionSection>
                    )}

                    {/* Cancellation Policy */}
                    <AccordionSection
                        title="Cancellation Policy"
                        isExpanded={expandedSection === "policy"}
                        onToggle={() => toggleSection("policy")}
                    >
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-gray-700 mb-2">
                                    Free cancellation up to 24 hours before the experience starts.
                                </p>
                                <p className="text-sm text-gray-600">
                                    Cancel at least 24 hours before the start time for a full refund.
                                </p>
                            </div>
                        </div>
                    </AccordionSection>
                </div>
            </div>

            {/* Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-bottom z-40">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <span className="text-sm text-gray-500">From</span>
                        <p className="text-2xl font-bold text-orange-500">€{service.price.toFixed(0)}</p>
                    </div>
                    <Button
                        onClick={onBookNow}
                        className="bg-orange-500 hover:bg-orange-600 rounded-full px-8 h-12 text-base font-semibold flex-1 max-w-[200px]"
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Accordion Section Component
function AccordionSection({
    title,
    isExpanded,
    onToggle,
    children
}: {
    title: string
    isExpanded: boolean
    onToggle: () => void
    children: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <h3 className="font-semibold text-base text-charcoal">{title}</h3>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>
            {isExpanded && (
                <div className="px-4 pb-4">
                    {children}
                </div>
            )}
        </div>
    )
}
