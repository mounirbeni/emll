
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Star, Clock, Users, Languages, CheckCircle, Package, Info, Calendar as CalendarIcon, Shield, XCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { Service } from "@prisma/client";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/lib/types";
import { activities } from "@/lib/data/activities-data";
import { ImageGallery } from "@/components/experiences/ImageGallery";
import { ReviewsSection } from "@/components/experiences/ReviewsSection";
import { BookingForm } from "@/components/experiences/BookingForm";
import { InfoCard } from "@/components/experiences/InfoCard";
import { mockReviews, calculateAverageRating } from "@/lib/data/mock-reviews";
import { getTravelerIdentity } from "@/lib/reviews/traveler-identity";
import { reviewService } from "@/services/review.service";

interface PageProps {
    params: Promise<{ id: string }>;
}

type ServiceWithExtras = Service & Partial<{
    exclusions: unknown;
    meetingPoint: unknown;
    endingPoint: unknown;
    cancellationPolicy: unknown;
    requirements: unknown;
    ageRestrictions: unknown;
    experienceHighlights: unknown;
    additionalInfo: unknown;
    minGroupSize: unknown;
    maxGroupSize: unknown;
}>;

const safeParse = (data: unknown, fallback: unknown) => {
    if (!data) return fallback;
    if (typeof data !== 'string') return data; // Handle already parsed arrays/objects
    try {
        return JSON.parse(data);
    } catch {
        return fallback;
    }
};

async function getActivity(id: string): Promise<Activity | null> {
    if (!id) return null;

    // Always try to fetch from database first (this ensures we have a valid service ID)
    let service: Service | null = null;
    try {
        service = await prisma.service.findUnique({
            where: { id }
        });
    } catch (error) {
        console.error("Database error in getActivity:", error);
    }

    // If service found in database, use it (this is the correct path)
    if (service) {
        const parsedImages = safeParse(service.images, []);
        return {
            id: service.id, // Use the database ID - critical for bookings!
            title: service.title,
            price: Number(service.price),
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
            itinerary: safeParse(service.itinerary, []),
            minGroupSize: 1,
            maxGroupSize: 10,
            whatToBring: safeParse(service.whatToBring, []),
            packages: [],
            packageCategories: [],
            languages: ["English", "French", "Arabic"],
        };
    }

    // Fallback: Try to find static activity and then look it up in DB by title
    const staticActivity = activities.find(a => a.id === id);
    if (staticActivity) {
        // Try to find the service in database by title (for static activities that were seeded)
        try {
            const serviceByTitle = await prisma.service.findFirst({
                where: { title: staticActivity.title }
            });

            if (serviceByTitle) {
                // Found in DB by title, use the database ID
                const parsedImages = safeParse(serviceByTitle.images, []);
                return {
                    id: serviceByTitle.id, // Use database ID for bookings!
                    title: serviceByTitle.title,
                    price: Number(serviceByTitle.price),
                    rating: serviceByTitle.rating,
                    reviews: serviceByTitle.reviews || 0,
                    category: serviceByTitle.category,
                    image: parsedImages[0] || staticActivity.image,
                    duration: serviceByTitle.duration,
                    features: safeParse(serviceByTitle.features, staticActivity.features),
                    location: serviceByTitle.location,
                    tags: safeParse(serviceByTitle.tags, staticActivity.tags),
                    images: parsedImages.length > 0 ? parsedImages : (staticActivity.images || [staticActivity.image]),
                    host: safeParse(serviceByTitle.host, staticActivity.host),
                    description: serviceByTitle.description,
                    included: safeParse(serviceByTitle.included, staticActivity.included),
                    exclusions: staticActivity.exclusions || [],
                    meetingPoint: staticActivity.meetingPoint || "",
                    endingPoint: staticActivity.endingPoint || "",
                    cancellationPolicy: staticActivity.cancellationPolicy || "Free cancellation up to 24 hours before the experience",
                    requirements: staticActivity.requirements || [],
                    ageRestrictions: staticActivity.ageRestrictions || "",
                    experienceHighlights: staticActivity.experienceHighlights || [],
                    additionalInfo: staticActivity.additionalInfo || "",
                    itinerary: safeParse(serviceByTitle.itinerary, staticActivity.itinerary),
                    minGroupSize: staticActivity.minGroupSize || 1,
                    maxGroupSize: staticActivity.maxGroupSize || 10,
                    whatToBring: safeParse(serviceByTitle.whatToBring, staticActivity.whatToBring),
                    packages: staticActivity.packages || [],
                    packageCategories: staticActivity.packageCategories || [],
                    languages: staticActivity.languages || ["English", "French", "Arabic"],
                };
            }
        } catch (error) {
            console.error("Error looking up service by title:", error);
        }

        // If not found in DB by title, try to create it automatically
        // This ensures the service exists for bookings
        try {
            console.log(`Service not found in database. Creating service for: ${staticActivity.title}`);
            const { generateShortId, ShortIdPrefix } = await import('@/lib/id-generator');

            const newService = await prisma.service.create({
                data: {
                    id: generateShortId(ShortIdPrefix.SERVICE),
                    title: staticActivity.title,
                    description: staticActivity.description || `Experience: ${staticActivity.title}`,
                    price: staticActivity.price,
                    category: staticActivity.category,
                    rating: staticActivity.rating || 0,
                    reviews: staticActivity.reviews || 0,
                    duration: staticActivity.duration || 'TBD',
                    location: staticActivity.location || 'Marrakech',
                    images: staticActivity.images || (staticActivity.image ? [staticActivity.image] : []),
                    features: staticActivity.features || [],
                    included: staticActivity.included || [],
                    whatToBring: staticActivity.whatToBring || [],
                    tags: staticActivity.tags || [],
                    itinerary: staticActivity.itinerary ? (typeof staticActivity.itinerary === 'string' ? JSON.parse(staticActivity.itinerary) : staticActivity.itinerary) : [],
                    host: typeof staticActivity.host === 'object' ? JSON.stringify(staticActivity.host) : (staticActivity.host || 'Explore Marrakesh'),
                }
            });

            console.log(`Created service in database with ID: ${newService.id}`);

            // Return the newly created service
            const parsedImages = safeParse(newService.images, []);
            return {
                id: newService.id, // Use database ID for bookings!
                title: newService.title,
                price: Number(newService.price),
                rating: newService.rating,
                reviews: newService.reviews || 0,
                category: newService.category,
                image: parsedImages[0] || staticActivity.image,
                duration: newService.duration,
                features: safeParse(newService.features, staticActivity.features),
                location: newService.location,
                tags: safeParse(newService.tags, staticActivity.tags),
                images: parsedImages.length > 0 ? parsedImages : (staticActivity.images || [staticActivity.image]),
                host: safeParse(newService.host, staticActivity.host),
                description: newService.description,
                included: safeParse(newService.included, staticActivity.included),
                exclusions: staticActivity.exclusions || [],
                meetingPoint: staticActivity.meetingPoint || "",
                endingPoint: staticActivity.endingPoint || "",
                cancellationPolicy: staticActivity.cancellationPolicy || "Free cancellation up to 24 hours before the experience",
                requirements: staticActivity.requirements || [],
                ageRestrictions: staticActivity.ageRestrictions || "",
                experienceHighlights: staticActivity.experienceHighlights || [],
                additionalInfo: staticActivity.additionalInfo || "",
                itinerary: safeParse(newService.itinerary, staticActivity.itinerary),
                minGroupSize: staticActivity.minGroupSize || 1,
                maxGroupSize: staticActivity.maxGroupSize || 10,
                whatToBring: safeParse(newService.whatToBring, staticActivity.whatToBring),
                packages: staticActivity.packages || [],
                packageCategories: staticActivity.packageCategories || [],
                languages: staticActivity.languages || ["English", "French", "Arabic"],
            };
        } catch (error) {
            console.error("Error creating service automatically:", error);
            // If creation fails, return static activity (booking will be handled by booking service)
            console.warn(`Service with ID ${id} and title "${staticActivity.title}" not found in database. Service will be created during booking if needed.`);
            return staticActivity;
        }
    }

    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const activity = await getActivity(id);

    if (!activity) {
        return {
            title: "Experience Not Found",
        };
    }

    return {
        title: `${activity.title} | Explore Marrakech`,
        description: activity.description,
        openGraph: {
            images: [activity.image],
        },
    };
}

export default async function ActivityPage({ params }: PageProps) {
    const { id } = await params;
    const activity = await getActivity(id);

    if (!activity) {
        notFound();
    }

    if (!activity.id) {
        notFound();
    }

    // Get related activities
    let relatedServices: ServiceWithExtras[] = [];
    try {
        relatedServices = await prisma.service.findMany({
            where: {
                category: activity.category,
                id: { not: activity.id }
            },
            take: 3
        });
    } catch (error) {
        console.error("Failed to fetch related services:", error);
        relatedServices = [];
    }

    const relatedActivities: Activity[] = relatedServices.map((service) => {
        if (!service.id) return null;

        const parsedImages = safeParse(service.images, []);
        return {
            id: service.id,
            title: service.title,
            price: Number(service.price),
            rating: service.rating,
            reviews: service.reviews,
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
            exclusions: safeParse(service.exclusions, []),
            meetingPoint: String(service.meetingPoint || ""),
            endingPoint: String(service.endingPoint || ""),
            cancellationPolicy: String(service.cancellationPolicy || ""),
            requirements: safeParse(service.requirements, []),
            ageRestrictions: String(service.ageRestrictions || ""),
            whatToBring: safeParse(service.whatToBring, []),
            experienceHighlights: safeParse(service.experienceHighlights, []),
            additionalInfo: String(service.additionalInfo || ""),
            itinerary: safeParse(service.itinerary, []),
            minGroupSize: Number(service.minGroupSize || 1),
            maxGroupSize: Number(service.maxGroupSize || 8),
            packages: [],
            packageCategories: []
        };
    }).filter(Boolean) as Activity[];

    // Prepare images for gallery
    const galleryImages = activity.images && activity.images.length > 0
        ? activity.images
        : [activity.image];

    // Fetch real reviews from database
    let realReviews: any[] = [];
    try {
        const dbReviews = await reviewService.getServiceReviews(activity.id, 10);
        realReviews = dbReviews.map((review: any) => ({
            id: review.id,
            ...(() => {
                const name = (review.user as unknown as { name?: string | null } | null)?.name
                if (name && name.trim().length > 0) {
                    return { author: name, nationality: 'Traveler', countryCode: 'MA' }
                }
                return getTravelerIdentity(String(review.id || review.userId || review.serviceId))
            })(),
            rating: review.rating,
            date: new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            comment: review.comment,
            verified: true,
            helpful: 0
        }));
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }

    // Use real reviews if available, otherwise fallback to mock reviews
    const reviewsToDisplay = realReviews.length > 0 ? realReviews : mockReviews;
    const averageRating = realReviews.length > 0
        ? realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length
        : activity.rating;
    const totalReviews = realReviews.length > 0 ? realReviews.length : activity.reviews;
    const hasReviews = totalReviews > 0;

    return (
        <section className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer">Home</span>
                    <span className="mx-2">/</span>
                    <span className="hover:text-foreground cursor-pointer">{activity.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{activity.title}</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        {activity.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-primary text-primary" />
                            <span className="font-semibold text-foreground">{activity.rating.toFixed(1)}</span>
                            <span>({activity.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                            <MapPin className="h-5 w-5" />
                            <span className="underline underline-offset-4">{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-5 w-5" />
                            <span>{activity.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">

                    {/* Left Column: Images & Details */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-12">

                        {/* Image Gallery */}
                        <ImageGallery images={galleryImages} title={activity.title} />

                        {/* Host Info */}
                        <div className="flex items-center justify-between border-b border-border pb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Hosted by a Local Expert
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Languages className="h-4 w-4" />
                                        <span>{activity.languages?.join(", ") || "English, French, Arabic"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>Max {activity.maxGroupSize} guests</span>
                                    </div>
                                </div>
                            </div>
                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                <AvatarImage src={activity.host?.image} />
                                <AvatarFallback>{activity.host?.name?.[0] || 'H'}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">About this experience</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {activity.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {activity.features?.map((feature) => (
                                    <Badge key={feature} variant="secondary" className="text-sm py-1.5 px-4">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* What's Included / Not Included */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard icon={CheckCircle} title="What's Included">
                                <ul className="space-y-2">
                                    {activity.included?.slice(0, 5).map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>

                            <InfoCard icon={XCircle} title="What's Not Included">
                                <ul className="space-y-2">
                                    {activity.exclusions?.slice(0, 5).map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </div>

                        {/* Itinerary */}
                        {activity.itinerary && activity.itinerary.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-foreground">Itinerary</h3>
                                <div className="relative pl-6 border-l-2 border-primary/30 space-y-8">
                                    {activity.itinerary.map((stop, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-[29px] top-1 h-6 w-6 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-semibold text-primary">{stop.time}</span>
                                                <h4 className="text-lg font-semibold text-foreground">{stop.title}</h4>
                                                <p className="text-muted-foreground">{stop.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                            <InfoCard icon={MapPin} title="Meeting Point">
                                <p className="text-sm">{activity.meetingPoint || "Details provided upon booking"}</p>
                            </InfoCard>

                            <InfoCard icon={CalendarIcon} title="Cancellation Policy">
                                <p className="text-sm">{activity.cancellationPolicy || "Free cancellation up to 24 hours before the experience"}</p>
                            </InfoCard>

                            <InfoCard icon={Users} title="Group Size">
                                <p className="text-sm">Minimum: {activity.minGroupSize} | Maximum: {activity.maxGroupSize}</p>
                            </InfoCard>

                            <InfoCard icon={Shield} title="Age Restrictions">
                                <p className="text-sm">{activity.ageRestrictions || "Suitable for all ages"}</p>
                            </InfoCard>
                        </div>

                        {/* Reviews Section */}
                        {hasReviews && (
                            <ReviewsSection
                                reviews={reviewsToDisplay}
                                averageRating={averageRating}
                                totalReviews={totalReviews}
                            />
                        )}
                    </div>

                    {/* Right Column: Booking Form */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-24">
                            <BookingForm activity={activity} />
                        </div>
                    </div>
                </div>

                {/* Related Experiences */}
                {relatedActivities.length > 0 && (
                    <div className="border-t border-border pt-12">
                        <h2 className="text-3xl font-bold mb-8">You might also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedActivities.filter(activity => activity.id).map((related) => (
                                <ActivityCard key={related.id} activity={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
