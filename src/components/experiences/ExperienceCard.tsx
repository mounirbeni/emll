'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Star } from 'lucide-react';

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
}

const PLACEHOLDER = '/images/placeholder-experience.svg';

/**
 * Only http(s) URLs and root-relative paths can actually resolve. Seeded rows
 * carry sentinel values like "IMAGE_PLACEHOLDER_PENDING_UPLOAD", which would
 * otherwise render as a broken image with the alt text spilling over the card.
 */
function resolveImage(src?: string) {
    if (!src) return PLACEHOLDER;
    const value = src.trim();
    if (!value) return PLACEHOLDER;
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return PLACEHOLDER;
}

function ExperienceCardComponent({ experience }: ExperienceCardProps) {
    const {
        id,
        title,
        category,
        location,
        duration,
        price,
        currency,
        gallery,
        reviewCount = 0,
        avgRating = 0,
    } = experience;

    const [imgSrc, setImgSrc] = useState(() => resolveImage(gallery?.[0]));

    const href = `/experiences/${id}`;
    const symbol = currency === 'EUR' ? '€' : currency;
    const hasReviews = reviewCount > 0;

    return (
        // The card is an <article> rather than a link so the booking CTA can be a
        // real, separate link. The title's stretched ::after keeps the whole card
        // clickable without nesting one anchor inside another.
        <article className="surface-card-interactive group relative flex h-full flex-col overflow-hidden">
            {/* Image */}
            <div className="bg-ink-100 relative aspect-[16/10] w-full overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={() => setImgSrc(PLACEHOLDER)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute left-3 top-3">
                    <span className="type-eyebrow text-brand-600 inline-flex items-center rounded-lg bg-white/95 px-3 py-1 shadow-sm backdrop-blur-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4 md:p-5">
                <div className="text-ink-500 mb-3 flex items-center justify-between gap-2 text-xs font-medium">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                </div>

                <h3 className="type-h4 group-hover:text-brand-600 mb-2 line-clamp-2 transition-colors">
                    <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                        {title}
                    </Link>
                </h3>

                {/* Rating — a bare "0 (0 reviews)" reads as a bad score, so new
                    experiences show a neutral label instead. */}
                <div className="mb-4 flex items-center gap-1.5">
                    {hasReviews ? (
                        <>
                            <Star className="fill-saffron-400 text-saffron-400 h-4 w-4" />
                            <span className="text-foreground font-bold">{avgRating.toFixed(1)}</span>
                            <span className="text-ink-400 text-sm">({reviewCount} reviews)</span>
                        </>
                    ) : (
                        <span className="bg-mint-50 text-mint-700 rounded-md px-2 py-0.5 text-xs font-semibold">
                            New experience
                        </span>
                    )}
                </div>

                {/* Price + booking CTA */}
                <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
                    <div className="flex flex-col">
                        <span className="text-ink-400 text-xs">From</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-foreground text-lg font-bold">
                                {symbol}{price}
                            </span>
                            <span className="text-ink-500 text-xs font-medium">per person</span>
                        </div>
                    </div>

                    <Link
                        href={href}
                        aria-label={`Book ${title}`}
                        className="bg-primary hover:bg-brand-600 relative z-10 shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors active:scale-[0.97]"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </article>
    );
}

const ExperienceCard = memo(ExperienceCardComponent);
export default ExperienceCard;
