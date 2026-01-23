"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/lib/types";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { cn } from "@/lib/utils";

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
            <div className="bg-white h-full flex flex-col rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:border-primary/20 hover:-translate-y-0.5 relative">

                {/* Image Container - Compact Aspect Ratio */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50">
                    {activity.image ? (
                        <Image
                            src={activity.image}
                            alt={activity.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}

                    {/* Wishlist Button - Floating */}
                    <button
                        onClick={toggleWishlist}
                        className={cn(
                            "absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 z-10",
                            inWishlist
                                ? "bg-primary text-white shadow-md"
                                : "bg-white/90 text-gray-500 hover:bg-white hover:text-primary shadow-sm"
                        )}
                    >
                        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                    </button>

                    {/* Category Tag - Floating Top Left */}
                    <div className="absolute top-2 left-2 z-10">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold shadow-sm border border-gray-100 uppercase tracking-wide">
                            {activity.category || "Experience"}
                        </span>
                    </div>
                </div>

                {/* Content - Compact Padding */}
                <div className="p-4 flex flex-col flex-grow">

                    {/* Header: Rating & Reviews */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-xs font-bold text-gray-900">{activity.rating}</span>
                        <span className="text-[10px] text-gray-400">({activity.reviews})</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                        {activity.title}
                    </h3>

                    {/* Description - Truncated */}
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {activity.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500 mb-4 mt-auto">
                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-primary" />
                            <span>{activity.duration}</span>
                        </div>
                        {activity.location && (
                            <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span className="truncate">{activity.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer: Price & CTA */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">From</span>
                            <span className="text-lg font-black text-primary leading-none">
                                €{activity.price}
                            </span>
                        </div>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-4 h-8 text-xs shadow-md shadow-orange-500/10"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
