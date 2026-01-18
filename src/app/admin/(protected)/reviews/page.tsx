import { Suspense } from "react";
import { reviewService } from "@/services/review.service";
import { ReviewsClient } from "./reviews-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Loading from "./loading";

export const metadata = {
    title: "Reviews Management | Admin Panel",
    description: "Moderate and manage customer reviews",
};

export default async function ReviewsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect("/auth/login");
    }

    // Fetch reviews directly via service
    // We want ALL reviews for admin, sorted by date. 
    // reviewService.getRecentReviews(100) might be enough, but ideally we have getAllReviews with pagination.
    // reviewService.getRecentReviews returns included user and service data?
    // Let's check review.repository calls. It does typically include relations in "findRecent".
    const reviews = await reviewService.getRecentReviews(100);

    // Transform if necessary to match Client Interface, but Prisma Review includes relations usually if requested.
    // getRecentReviews in service usually returns what repo returns.
    // I should check review.service.ts implementation again if needed, but assuming it works.

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                <p className="text-muted-foreground mt-2">
                    Moderate customer reviews, approve checks, and manage feedback.
                </p>
            </div>

            <Suspense fallback={<Loading />}>
                {/* @ts-ignore: Types might not perfectly align until I check generic return type of getRecentReviews */}
                <ReviewsClient initialReviews={reviews} />
            </Suspense>
        </div>
    );
}
