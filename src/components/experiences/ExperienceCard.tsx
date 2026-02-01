'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';

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
    reviews?: number; // Mock data for now
    rating?: number;  // Mock data for now
}

interface ExperienceCardProps {
    experience: Experience;
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
        shortDescription,
        gallery,
        reviews = Math.floor(Math.random() * 500) + 50,
        rating = 4.8,
    } = experience;

    return (
        <Link
            href={`/experiences/${id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                    src={gallery[0] || '/placeholders/experience-placeholder.jpg'}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Category Pill - Top Left */}
                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-600 shadow-sm">
                    {category}
                </div>

                {/* Duration Pill - Bottom Left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-orange-500" />
                    <span>{duration}</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-5">
                {/* Header: Rating & Location */}
                <div className="mb-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="flex items-center font-bold text-orange-500">
                            ★ {rating}
                        </span>
                        <span className="text-xs text-gray-400">({reviews})</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>

                {/* Optional Description (Mobile/Tablet only maybe? kept for now) */}
                <p className="mb-4 line-clamp-1 text-sm text-gray-500">
                    {shortDescription}
                </p>

                {/* Footer: Price & CTA */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">From</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">
                                {currency === 'EUR' ? '€' : currency} {price}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">per person</span>
                        </div>
                    </div>

                    <div className="rounded-full bg-gray-50 px-4 py-2 text-sm font-bold text-orange-600 group-hover:bg-orange-50 transition-colors">
                        View Details
                    </div>
                </div>
            </div>
        </Link>
    );
}

const ExperienceCard = memo(ExperienceCardComponent);
export default ExperienceCard;
