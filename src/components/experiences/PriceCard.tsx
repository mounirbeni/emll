"use client";

import { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin } from "lucide-react";

interface PriceCardProps {
    activity: Activity;
}

/**
 * PriceCard Component
 * 
 * Enhanced booking sidebar with price, quick stats, and prominent CTA.
 * Sticky positioning for better UX.
 */
export function PriceCard({ activity }: PriceCardProps) {
    return (
        <div className="border border-border rounded-xl p-6 shadow-lg bg-card space-y-6">
            {/* Price */}
            <div className="border-b border-border pb-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                        €{activity.price}
                    </span>
                    <span className="text-muted-foreground">per person</span>
                </div>
                {activity.priceRange && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {activity.priceRange}
                    </p>
                )}
            </div>

            {/* Quick Info */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-5 w-5 text-[#FF5F00]" />
                    <span className="text-muted-foreground">{activity.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Users className="h-5 w-5 text-[#FF5F00]" />
                    <span className="text-muted-foreground">
                        Max {activity.maxGroupSize} guests
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-5 w-5 text-[#FF5F00]" />
                    <span className="text-muted-foreground">{activity.location}</span>
                </div>
                {activity.languages && activity.languages.length > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-5 w-5 text-[#FF5F00]" />
                        <span className="text-muted-foreground">
                            {activity.languages.join(", ")}
                        </span>
                    </div>
                )}
            </div>

            {/* CTA Button */}
            <Button
                onClick={() => {
                    // Open WhatsApp for booking inquiries
                    window.open(`https://wa.me/212600000000?text=Hi, I'm interested in booking: ${encodeURIComponent(activity.title)}`, '_blank');
                }}
                className="w-full bg-[#FF5F00] hover:bg-[#E55500] text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
                Book Now
            </Button>

            {/* Trust Indicators */}
            <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Mobile ticket accepted</span>
                </div>
            </div>

            {/* Contact Support */}
            <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                    Need help?{" "}
                    <button className="text-[#FF5F00] hover:underline font-medium">
                        Contact us
                    </button>
                </p>
            </div>
        </div>
    );
}
