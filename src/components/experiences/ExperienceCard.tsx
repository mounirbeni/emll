'use client';

import { memo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Experience {
    id: string;
    title: string;
    category: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    shortDescription: string;
    gallery: string[];
    reviewCount?: number;
    avgRating?: number;
    featured?: boolean;
}

interface ExperienceCardProps {
    experience: Experience;
    isWishlisted?: boolean;
}

function ExperienceCardComponent({ experience, isWishlisted = false }: ExperienceCardProps) {
    const {
        id,
        title,
        category,
        location,
        duration,
        price,
        currency,
        gallery,
        // Use real data, default to 0
        reviewCount = 0,
        avgRating = 0,
    } = experience;

    // Map to component variables for cleaner usage below
    const reviews = reviewCount;
    const rating = avgRating;

    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const handleWishlist = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlistLoading) return;
        setWishlistLoading(true);
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ experienceId: id }),
            });
            if (res.ok) {
                const data = await res.json();
                setWishlisted(data.inWishlist);
                toast.success(data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist');
            } else if (res.status === 401) {
                toast.error('Sign in to save experiences');
            } else {
                toast.error('Failed to update wishlist');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setWishlistLoading(false);
        }
    }, [id, wishlistLoading]);

    return (
        <Link
            href={`/experiences/${id}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-black/5 active:scale-[0.98]"
        >
            {/* Image Container - 16:9 Aspect Ratio */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                    src={(!gallery[0] || gallery[0] === 'IMAGE_PLACEHOLDER_PENDING_UPLOAD') ? '/images/placeholder-experience.svg' : gallery[0]}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={false}
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Category Badge - Top Left */}
                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center rounded-lg bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm backdrop-blur-sm">
                        {category}
                    </span>
                </div>

                {/* Wishlist heart button */}
                <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                    title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                    <Heart
                        className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-4 md:p-5">

                {/* Meta Info: Duration & Location */}
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="max-w-[120px] truncate">{location}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-gray-900">{rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">({reviews} reviews)</span>
                </div>

                {/* Footer: Price */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">From</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">
                                {currency === 'EUR' ? '€' : currency}{price}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">per person</span>
                        </div>
                    </div>

                    {/* Mobile CTA / Desktop Visual Indicator */}
                    <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white md:flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}

const ExperienceCard = memo(ExperienceCardComponent);
export default ExperienceCard;
