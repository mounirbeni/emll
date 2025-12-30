import { Review } from "@/components/experiences/ReviewsSection";

/**
 * Mock Reviews Data
 * 
 * Sample traveler reviews for demonstration purposes.
 * In production, this would come from an API or database.
 */
export const mockReviews: Review[] = [
    {
        id: "1",
        author: "Sarah Johnson",
        nationality: "United States",
        countryCode: "US",
        rating: 5,
        date: "December 2024",
        comment: "Absolutely incredible experience! Our guide was knowledgeable and passionate about Marrakech's history. The attention to detail and personalized service made this tour unforgettable. Highly recommend to anyone visiting Morocco!",
        verified: true,
        helpful: 24,
    },
    {
        id: "2",
        author: "Pierre Dubois",
        nationality: "France",
        countryCode: "FR",
        rating: 5,
        date: "November 2024",
        comment: "Une expérience magnifique! The blend of culture, history, and local cuisine was perfect. Our guide spoke excellent French and English, making everyone feel comfortable. Worth every euro!",
        verified: true,
        helpful: 18,
    },
    {
        id: "3",
        author: "Emma Thompson",
        nationality: "United Kingdom",
        countryCode: "GB",
        rating: 4,
        date: "November 2024",
        comment: "Great tour overall. The itinerary was well-planned and we saw all the major highlights. Only minor issue was the timing felt a bit rushed at some stops. But our guide was fantastic and very accommodating!",
        verified: true,
        helpful: 12,
    },
    {
        id: "4",
        author: "Carlos Rodriguez",
        nationality: "Spain",
        countryCode: "ES",
        rating: 5,
        date: "October 2024",
        comment: "Exceptional service from start to finish. The luxury touches really made a difference - comfortable transportation, premium lunch, and exclusive access to certain areas. This is how you experience Marrakech!",
        verified: true,
        helpful: 31,
    },
    {
        id: "5",
        author: "Yuki Tanaka",
        nationality: "Japan",
        countryCode: "JP",
        rating: 5,
        date: "October 2024",
        comment: "Perfect for first-time visitors to Marrakech. Our guide was patient with our questions and took amazing photos for us. The small group size made it feel very personal. Will definitely book again!",
        verified: true,
        helpful: 15,
    },
    {
        id: "6",
        author: "Michael Chen",
        nationality: "Canada",
        countryCode: "CA",
        rating: 4,
        date: "September 2024",
        comment: "Very good experience. The guide's local knowledge was impressive and we learned so much about Moroccan culture. Would have loved a bit more free time for shopping, but overall excellent value.",
        verified: false,
        helpful: 8,
    },
];

/**
 * Calculate average rating from reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}
