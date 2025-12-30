
import { PrismaClient } from '@prisma/client';
import { activitiesData } from './src/lib/data/activities-data';
import { generateShortId, ShortIdPrefix } from './src/lib/id-generator';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Static Activities Seed...");

    const allActivities = Object.values(activitiesData).flat();
    console.log(`Found ${allActivities.length} static activities.`);

    for (const activity of allActivities) {
        if (!activity.id) {
            console.warn("Skipping activity without ID:", activity.title);
            continue;
        }

        const existing = await prisma.service.findUnique({
            where: { id: activity.id }
        });

        if (existing) {
            console.log(`Activity ${activity.id} already exists.`);
            // Optional: Update it? For now, we assume static data is source of truth if we want to sync.
            // Let's UPDATE it to ensure DB matches code.
            await prisma.service.update({
                where: { id: activity.id },
                data: {
                    title: activity.title,
                    description: activity.description,
                    price: activity.price,
                    category: activity.category,
                    rating: activity.rating,
                    reviews: activity.reviews,
                    duration: activity.duration,
                    location: activity.location,
                    images: activity.images || (activity.image ? [activity.image] : []),
                    features: activity.features,
                    included: activity.included,
                    whatToBring: activity.whatToBring,
                    tags: activity.tags,
                    // Handle complex objects as JSON
                    host: activity.host ? JSON.stringify(activity.host) : "Unknown",
                    itinerary: activity.itinerary ? JSON.stringify(activity.itinerary) : undefined,
                    // Extra fields stored in JSON or mapped if schema supports
                    // Schema doesn't have specific fields for 'programs' etc, so we might lose some data if not mapped effectively.
                    // But standard fields are covered.

                    // IMPORTANT: Ensure shortId exists
                    shortId: (existing as any).shortId || generateShortId(ShortIdPrefix.SERVICE),
                } as any
            });
            console.log(`Updated ${activity.id}`);
        } else {
            console.log(`Creating ${activity.id}...`);
            await prisma.service.create({
                data: {
                    id: activity.id, // KEEP the static ID
                    title: activity.title,
                    description: activity.description,
                    price: activity.price,
                    category: activity.category,
                    rating: activity.rating,
                    reviews: activity.reviews,
                    duration: activity.duration,
                    location: activity.location,
                    images: activity.images || (activity.image ? [activity.image] : []),
                    features: activity.features,
                    included: activity.included,
                    whatToBring: activity.whatToBring,
                    tags: activity.tags,
                    host: activity.host ? JSON.stringify(activity.host) : "Unknown",
                    itinerary: activity.itinerary ? JSON.stringify(activity.itinerary) : undefined,

                    shortId: generateShortId(ShortIdPrefix.SERVICE),
                } as any
            });
        }
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
