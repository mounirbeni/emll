"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, MapPin, Star, Users } from "lucide-react";
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
        <Link href={`/experiences/${encodeURIComponent(activity.id)}`} className="block h-full group">
            <div className="bg-white h-full flex flex-row sm:flex-col rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
                {/* Image Container */}
                <div className="relative w-32 h-auto aspect-square sm:w-full sm:aspect-[4/3] shrink-0 overflow-hidden">
                    {activity.image ? (
                        <Image
                            src={activity.image}
                            alt={activity.title}
                            fill
                            sizes="(max-width: 768px) 128px, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Price Badge - Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 bg-white text-primary font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
                            From €{activity.price.toString()}
                        </span>
                    </div>

                    {/* Wishlist button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute top-3 right-3 h-9 w-9 rounded-full transition-all duration-300 z-10 shadow-lg",
                            inWishlist
                                ? "bg-primary text-white hover:bg-primary/90 scale-110"
                                : "bg-white text-gray-600 hover:bg-white hover:text-primary hover:scale-110"
                        )}
                        onClick={toggleWishlist}
                    >
                        <Heart className={cn("h-4 w-4 transition-transform", inWishlist && "fill-current")} />
                    </Button>

                    {/* Popular Badge */}
                    {activity.rating >= 4.8 && (
                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                                <Star className="h-3 w-3 fill-current" />
                                Popular
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow w-full min-w-0">
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-2.5">
                        <RatingBubble rating={activity.rating} size="sm" />
                        <span className="font-semibold text-sm text-foreground">{getReviewLabel(activity.rating)}</span>
                        <span className="text-muted-foreground text-xs">({activity.reviews} reviews)</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg leading-snug text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {activity.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm mb-3">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration}</span>
                        </div>
                        {activity.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate max-w-[120px]">{activity.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Price - Only show on mobile since desktop has badge */}
                    <div className="sm:hidden mt-auto">
                        <div className="text-primary font-bold text-lg">
                            €{activity.price.toString()} <span className="text-muted-foreground text-sm font-normal">per person</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button - Desktop only */}
                <div className="hidden sm:block px-4 pb-4">
                    <Button className="w-full rounded-xl bg-primary hover:bg-accent text-white font-semibold py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                        Check Availability
                    </Button>
                </div>
            </div>
        </Link>
    );
}
