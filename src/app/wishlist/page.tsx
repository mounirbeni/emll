"use client";

import { useWishlist } from "@/lib/contexts/WishlistContext";
import { activitiesData } from "@/lib/data/activities-data";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    // Filter activities that are in wishlist
    const allActivities = Object.values(activitiesData).flat();
    const wishlistActivities = allActivities.filter(activity =>
        wishlist.includes(activity.id)
    );

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-12 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        Your favorite experiences saved for later
                    </p>
                </div>

                {/* Wishlist Content */}
                {wishlistActivities.length > 0 ? (
                    <div>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                            {wishlistActivities.length} {wishlistActivities.length === 1 ? 'experience' : 'experiences'} saved
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {wishlistActivities.filter(activity => activity.id).map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-3">Your wishlist is empty</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
                            Start adding experiences you love by clicking the heart icon on any activity card
                        </p>
                        <Link href="/search">
                            <Button size="lg" className="rounded-full">
                                Browse Experiences
                            </Button>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
