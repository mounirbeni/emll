import prisma from "@/lib/prisma";
import ExperiencesClient from "./ExperiencesClient";
import { Activity } from "@/lib/types";
import { activities as staticActivities } from "@/lib/data/activities-data";

export const dynamic = 'force-dynamic'; // Ensure real-time updates

const safeParse = (data: any, fallback: any) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data; // Handle already parsed arrays/objects
    try {
        return JSON.parse(data);
    } catch {
        return fallback;
    }
};

export default async function ExperiencesPage() {
    let activities: Activity[] = [];

    try {
        // Fetch services from database
        const services = await prisma.service.findMany({
            orderBy: { createdAt: 'desc' }
        });

        if (services.length > 0) {
            // Map Prisma Service to Activity type
            activities = services.map(service => {
                const parsedImages = safeParse(service.images, []);
                return {
                    id: service.id, // Use database ID - this is critical for bookings!
                    title: service.title,
                    price: service.price,
                    rating: service.rating,
                    reviews: service.reviews || 0,
                    category: service.category,
                    image: parsedImages[0] || "",
                    duration: service.duration,
                    features: safeParse(service.features, []),
                    location: service.location,
                    tags: safeParse(service.tags, []),
                    images: parsedImages,
                    host: safeParse(service.host, { name: "Marrakech Host", image: "/localexpert.jpg" }),
                    description: service.description,
                    included: safeParse(service.included, []),
                    exclusions: [],
                    meetingPoint: "",
                    endingPoint: "",
                    cancellationPolicy: "Free cancellation up to 24 hours before the experience",
                    requirements: [],
                    ageRestrictions: "",
                    experienceHighlights: [],
                    additionalInfo: "",
                    minGroupSize: 1,
                    maxGroupSize: 10,
                    whatToBring: safeParse(service.whatToBring, []),
                    itinerary: safeParse(service.itinerary, []),
                    packages: [],
                    packageCategories: [],
                    languages: ["English", "French", "Arabic"],
                };
            });
        } else {
            // Fallback to static activities if database is empty
            activities = staticActivities;
        }
    } catch (error) {
        console.warn("Database connection failed, using static data fallback.", error);
        // Fallback to static activities on error
        activities = staticActivities;
    }

    return <ExperiencesClient initialActivities={activities} />;
}