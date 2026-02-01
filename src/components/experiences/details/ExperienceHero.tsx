'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Star, Share2, Heart, ShieldCheck, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileImageGallery } from '@/components/mobile/MobileImageGallery';

interface ExperienceHeroProps {
    title: string;
    category: string;
    location: string;
    duration: string;
    rating: number;
    reviews: number;
    pickupAvailable: boolean;
    languages: string[];
    images: string[];
}

export default function ExperienceHero({
    title,
    category,
    location,
    duration,
    rating,
    reviews,
    pickupAvailable,
    languages,
    images
}: ExperienceHeroProps) {
    // Filter out placeholders
    const validImages = images.filter(img => img && img !== 'IMAGE_PLACEHOLDER_PENDING_UPLOAD');
    const displayImages = validImages.length > 0 ? validImages : ['/images/placeholder-experience.svg'];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <div className="relative">
            {/* Breadcrumb/Top Nav Placeholder (usually handled by page layout, but good to have spacing) */}

            {/* Header Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Category & Badges */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                        {category}
                    </span>
                    {pickupAvailable && (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Pickup Included
                        </span>
                    )}
                </div>

                {/* Title & Actions */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-orange-50 hover:text-orange-600">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Key Info Row */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 md:text-base">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-gray-900">{rating}</span>
                        <span className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-orange-600">
                            ({reviews} reviews)
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="underline decoration-dotted decoration-gray-400 underline-offset-4">
                            {location}
                        </span>
                    </div>
                    {languages.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span>{languages.join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Carousel / Desktop Hidden (Desktop usually uses Grid Gallery below) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden md:hidden" onClick={() => setIsGalleryOpen(true)}>
                <Image
                    src={displayImages[currentImageIndex] || '/images/placeholder-experience.svg'}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows (Stop propagation to prevent opening gallery when clicking arrows) */}
                <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="pointer-events-auto rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-900" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="pointer-events-auto rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-900" />
                    </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 pointer-events-none">
                    {images.slice(0, 5).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                        />
                    ))}
                </div>

                {/* Full screen hint icon */}
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md rounded-full p-2 pointer-events-none">
                    <Share2 className="h-4 w-4 text-white" />
                </div>
            </div>

            <MobileImageGallery
                images={displayImages}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                initialIndex={currentImageIndex}
            />
        </div>
    );
}
