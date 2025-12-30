"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Review {
    id: string;
    author: string;
    nationality: string;
    countryCode: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
    helpful: number;
}

interface ReviewsSectionProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

/**
 * ReviewsSection Component
 * 
 * Displays traveler reviews with rating breakdown and individual review cards.
 * Luxury design with verified badges and helpful votes.
 */
export function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((r) => Math.floor(r.rating) === rating).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { rating, count, percentage };
    });

    return (
        <div className="space-y-8 border-t border-border pt-12">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Guest Reviews</h2>
                <p className="text-muted-foreground">
                    What travelers are saying about this experience
                </p>
            </div>

            {/* Rating Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border rounded-xl p-6">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center text-center border-r-0 md:border-r border-border">
                    <div className="text-6xl font-bold text-foreground mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(averageRating)
                                        ? "fill-[#FF5F00] text-[#FF5F00]"
                                        : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-muted-foreground">
                        Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-12">{rating} stars</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#FF5F00] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow bg-card"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-background">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} />
                                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-foreground">{review.author}</h4>
                                        {review.verified && (
                                            <Badge variant="secondary" className="text-xs">
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {review.nationality} • {review.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating
                                                ? "fill-[#FF5F00] text-[#FF5F00]"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            {review.comment}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <button className="hover:text-foreground transition-colors">
                                Helpful ({review.helpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
