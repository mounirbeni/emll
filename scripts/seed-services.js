const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create or update some sample services
    const services = [
        {
            title: "Atlas Mountains & 3 Valleys Day Trip",
            description: "Discover the Berber villages of the Atlas Mountains on a full-day trip from Marrakech. Explore the 3 Valleys, visit a traditional Argan oil cooperative, and enjoy a traditional lunch.",
            price: 45.00,
            rating: 4.9,
            reviews: 128,
            category: "Nature",
            duration: "8 hours",
            location: "Atlas Mountains",
            features: "Hotel pickup,Lunch included,Guide",
            included: "Transport,Lunch,Tea",
            whatToBring: "Walking shoes,Sunscreen,Camera",
            itinerary: "9:00 AM Departure -> 11:00 AM Valley Visit -> 1:00 PM Lunch -> 5:00 PM Return",
            host: "Marrakech Tours",
            tags: "Mountains,Nature,Culture",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1553531384-397c80973a63?q=80&w=2000&auto=format&fit=crop"
            ])
        },
        {
            title: "Agafay Desert Sunset Camel Ride",
            description: "Experience the magic of the Agafay Desert with a sunset camel ride. Enjoy a traditional dinner under the stars in a luxury desert camp.",
            price: 65.00,
            rating: 4.8,
            reviews: 85,
            category: "Desert",
            duration: "5 hours",
            location: "Agafay Desert",
            features: "Dinner,Camel Ride,Music",
            included: "Transport,Dinner,Show",
            whatToBring: "Jacket,Sunscreen",
            itinerary: "4:00 PM Pickup -> 5:30 PM Camel Ride -> 7:00 PM Dinner -> 9:00 PM Return",
            host: "Desert Magic",
            tags: "Desert,Sunset,Dinner",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1542044896-309805c1b83c?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1682687220509-61b8a906ca19?q=80&w=2000&auto=format&fit=crop"
            ])
        },
        {
            title: "Marrakech Medina Food Tour",
            description: "Taste your way through the streets of Marrakech on a guided food tour. Sample local delicacies including tagine, olives, pastries, and mint tea.",
            price: 35.00,
            rating: 5.0,
            reviews: 42,
            category: "Food",
            duration: "3 hours",
            location: "Medina",
            features: "Tastings,Guide,Small Group",
            included: "All food tastings,Guide",
            whatToBring: "Appetite",
            itinerary: "6:00 PM Meeting -> 6:30 PM Olive Tasting -> 7:30 PM Dinner -> 9:00 PM Pastries",
            host: "Foodie Hub",
            tags: "Food,Culture,Walking",
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1512101111624-945761a2be10?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1588612502843-f66f9de2723c?q=80&w=2000&auto=format&fit=crop"
            ])
        }
    ];

    for (const s of services) {
        await prisma.service.create({
            data: s
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
