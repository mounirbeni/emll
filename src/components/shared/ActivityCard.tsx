"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/lib/types";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { RatingBubble, getReviewLabel } from "@/components/shared/RatingBubble";

interface ActivityCardProps {
    activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    if (!activity || !activity.id) return null;

    const inWishlist = isInWishlist(activity.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) removeFromWishlist(activity.id);
        else addToWishlist(activity.id);
    };

    return (
        <Link href={`/experiences/${activity.id}`} className="block h-full group">
            <div className="card-tripadvisor h-full flex flex-row sm:flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Image */}
                <div className="relative w-32 h-auto aspect-square sm:w-full sm:aspect-[4/3] shrink-0 overflow-hidden">
                    {activity.image ? (
                        <Image
                            src={activity.image}
                            alt={activity.title}
                            fill
                            sizes="(max-width: 768px) 128px, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-text-muted">
                            No Image
                        </div>
                    )}

                    {/* Wishlist button - Only show on desktop for cleaner mobile view, or keep if crucial */}
                    {/* Hiding on very small screens if it overlaps content too much, but keeping for now */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all z-10",
                            inWishlist
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-white/90 text-black hover:bg-white"
                        )}
                        onClick={toggleWishlist}
                    >
                        <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", inWishlist && "fill-current")} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-3 sm:card-padding flex flex-col flex-grow justify-between sm:justify-start w-full min-w-0">
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-2">
                        <RatingBubble rating={activity.rating} size="sm" />
                        <span className="font-bold text-sm">{getReviewLabel(activity.rating)}</span>
                        <span className="text-text-muted text-xs">({activity.reviews})</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base leading-tight text-black mb-2 line-clamp-2">
                        {activity.title}
                    </h3>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-text-muted text-sm mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                    </div>

                    {/* Price - TripAdvisor style */}
                    <div className="mt-auto">
                        <div className="price-text text-base">
                            From €{activity.price} per adult
                        </div>
                    </div>
                </div>

                {/* CTA Button - Desktop only */}
                <div className="hidden sm:block card-padding pt-0">
                    <Button className="btn-tripadvisor w-full text-sm">
                        See availability
                    </Button>
                </div>
            </div>
        </Link>
    );
}
