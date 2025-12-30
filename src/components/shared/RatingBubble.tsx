"use client";

interface RatingBubbleProps {
    rating: number;
    size?: "sm" | "md" | "lg";
    showNumber?: boolean;
}

export function RatingBubble({ rating, size = "md", showNumber = true }: RatingBubbleProps) {
    // Ensure rating is valid
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    const fullCircles = Math.floor(safeRating);
    const hasHalfCircle = safeRating % 1 >= 0.5;
    const emptyCircles = 5 - fullCircles - (hasHalfCircle ? 1 : 0);

    return (
        <div className="flex items-center gap-0.5" title={`${safeRating.toFixed(1)} of 5 bubbles`}>
            {[...Array(fullCircles)].map((_, i) => (
                <div key={`full-${i}`} className={`rounded-full bg-[#FF5F00] ${size === "sm" ? "w-3 h-3" : "w-4 h-4"} border border-[#FF5F00]`} />
            ))}
            {hasHalfCircle && (
                <div className={`rounded-full relative overflow-hidden bg-white border border-[#FF5F00] ${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`}>
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-[#FF5F00]" />
                </div>
            )}
            {[...Array(emptyCircles)].map((_, i) => (
                <div key={`empty-${i}`} className={`rounded-full bg-white border border-[#FF5F00] ${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
            ))}
        </div>
    );
}

// Review quality labels based on rating
export function getReviewLabel(rating: number): string {
    if (rating >= 5.0) return "Excellent";
    if (rating >= 4.5) return "Very Good";
    if (rating >= 4.0) return "Good";
    if (rating >= 3.0) return "Average";
    if (rating >= 2.0) return "Poor";
    return "Terrible";
}
