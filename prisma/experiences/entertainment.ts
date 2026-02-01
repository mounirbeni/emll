import { RichExperience } from "./types";

export const entertainmentExperiences: RichExperience[] = [
    {
        title: "Fantasia Dinner Show - 1001 Nights",
        category: "Entertainment",
        location: "La Palmeraie (Chez Ali)",
        duration: "4 hours",
        price: 55,
        currency: "EUR",
        shortDescription: "A spectacular evening of Moroccan folklore, horsemen, belly dancers, and a traditional feast in a castle setting.",
        fullDescription: "Step into a legend. The Fantasia Dinner Show (famous at Chez Ali) is the biggest cultural spectacle in Marrakech. Located in a vast palm grove complex designed like a fortress, it brings together folklore troupes from every region of Morocco.\n\nAs you arrive, you are greeted by Berber tribesmen, blue men of the desert, and gnawa musicians. You will be seated in Bedouin tents for a massive feast: Harira soup, diffa of roast lamb (Mechoui), couscous, fruits, and tea. \n\nDuring dinner, the troupes visit your table to perform. But the real show happens in the arena: The Fantasia. Arab stallions charge at full gallop, and their riders fire muskets into the air in perfect synchronization—the 'Baroud'. Belly dancers, acrobats, and a flying carpet act (yes!) complete the magical, slightly kitsch, but totally fun atmosphere.",
        highlights: [
            "Massive Folklore Show",
            "Horsemen Fantasia (Gunpowder play)",
            "Traditional 5-course dinner",
            "Belly Dancers & Musicians",
            "Castle/Fortress setting",
            "Family friendly spectacle",
            "Transfers included"
        ],
        itinerary: [
            {
                title: "Pickup",
                description: "Pickup 7:30 PM. Drive to the Palmeraie."
            },
            {
                title: "Welcome",
                description: "Walk through the 'grotto' passed musicians to your tent."
            },
            {
                title: "Dinner",
                description: "Dinner is served while groups perform at tables."
            },
            {
                title: "The Show",
                description: "Move to the arena seating for the Fantasia horse show."
            },
            {
                title: "Return",
                description: "Transfer back to hotel around 11:30 PM."
            }
        ],
        included: [
            "Dinner (Soup, Lamb, Couscous, Dessert, Tea)",
            "Show Ticket",
            "Transfers"
        ],
        notIncluded: [
            "Drinks (Wine/Beer available for purchase)",
            "Photos with performers",
            "Tips"
        ],
        meetingPoint: "Hotel Pickup.",
        importantInfo: [
            "It is loud and busy! Not for those seeking a quiet romantic dinner.",
            "Great for groups and kids.",
            "Vegetarian options available upon request."
        ],
        faqs: [
            {
                q: "Is it a tourist trap?",
                a: "It is very touristy, but it is also a unique cultural institution and very entertaining."
            },
            {
                q: "Is the food good?",
                a: "It is traditional banquet food (Mechoui lamb is the highlight)."
            }
        ],
        relatedExperiences: [
            "Agafay Sunset Camel Ride",
            "Evening Jemaa El Fna & Souk Tasting Tour"
        ],
        imageConcepts: [
            "Horsemen firing muskets in the air",
            "Belly dancer in spotlight",
            "Roast lamb on a platter",
            "Musicians in colorful robes",
            "Fireworks over the castle walls"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/fantasia-1.jpg",
            "/images/experiences/fantasia-2.jpg"
        ]
    }
];
