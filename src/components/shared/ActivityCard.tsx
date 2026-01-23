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
            <div className="bg-white h-full flex flex-col rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/20 hover:-translate-y-1 relative">

                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
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
                            "absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 z-10",
                            inWishlist
                                ? "bg-primary text-white shadow-md"
                                : "bg-white/90 text-gray-500 hover:bg-white hover:text-primary shadow-sm"
                        )}
                    >
                        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                    </button>

                    {/* Category Tag - Floating Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-primary text-xs font-bold shadow-sm border border-gray-100 uppercase tracking-wide">
                            {activity.category || "Experience"}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">

                    {/* Header: Rating & Reviews */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-bold text-gray-900">{activity.rating}</span>
                        <span className="text-xs text-gray-400">({activity.reviews} reviews)</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {activity.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {activity.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-5 mt-auto">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{activity.duration}</span>
                        </div>
                        {activity.location && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md truncate max-w-[140px]">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span className="truncate">{activity.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer: Price & CTA */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">From</span>
                            <span className="text-xl font-black text-primary">
                                €{activity.price}
                            </span>
                        </div>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-5 h-10 shadow-lg shadow-orange-500/20"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
