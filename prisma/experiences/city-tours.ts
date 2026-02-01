import { RichExperience } from "./types";

export const cityToursExperiences: RichExperience[] = [
    {
        title: "Medina Hidden Gems Walking Tour",
        category: "City Tours",
        location: "Marrakech Medina",
        duration: "3 hours",
        price: 30,
        currency: "EUR",
        shortDescription: "Go beyond the guidebooks and explore the secret alleys, artisans, and community ovens of the ancient Medina.",
        fullDescription: "Marrakech's Medina is a labyrinth of history, but most visitors only scratch the surface. This 'Hidden Gems' walking tour is designed to take you off the beaten tourist track and deep into the authentic heart of the city. Guided by a local who grew up in these streets, you will navigate the winding alleyways where Google Maps fails, discovering the living, breathing city behind the walls.\n\nWe start away from the chaos of the main square, entering quiet residential neighborhoods where life has remained largely unchanged for centuries. You will visit a 'Farrane' (community bakery) to see how locals bake their daily bread, stop by a 'Hammam' furnace to understand the city's ancient heating system, and visit a historic 'Foundouk' (caravanserai) now inhabited by artisans.\n\nAlong the way, you’ll meet skilled craftsmen—woodturners, metalworkers, and slipper makers—working in their small ateliers, far from the aggressive souvenir shops. This is not a shopping tour; it is a cultural immersion. Your guide will decode the architecture, the knockers on the doors, and the social fabric of the neighborhood. The tour concludes on a hidden rooftop terrace with a panoramic view, where we will answer all your questions over a glass of mint tea.",
        highlights: [
            "Explore non-touristy residential neighborhoods",
            "Visit a working community bakery (Farrane)",
            "Step inside a historic artisan Foundouk",
            "Meet genuine local craftsmen in their workshops",
            "Learn about the 5 pillars of the neighborhood",
            "Small group size (Max 8 people)",
            "No shopping pressure guarantee",
            "Rooftop tea break included"
        ],
        itinerary: [
            {
                title: "Meeting Point",
                description: "Meet your guide at the foot of Koutoubia Mosque for a brief historical intro."
            },
            {
                title: "The Bakery & Furnace",
                description: "Enter a local neighborhood to visit the communal oven and the hammam heating system."
            },
            {
                title: "Artisan Encounters",
                description: "Walk through specialized artisan streets, stopping to watch master craftsmen at work."
            },
            {
                title: "Foundouk Visit",
                description: "Explore a restored 17th-century trading inn, now a hub for creativity."
            },
            {
                title: "Rooftop Finale",
                description: "End the tour on a hidden terrace for tea and a Q&A session with your guide."
            }
        ],
        included: [
            "Local English-speaking Guide",
            "Bottled water",
            "Tea or coffee break",
            "Tasting of fresh bread"
        ],
        notIncluded: [
            "Tips for the guide",
            "Entry fees to monuments (none usually visited)",
            "Shopping purchases"
        ],
        meetingPoint: "Koutoubia Mosque, under the palm trees facing the main minaret. Look for the guide with the 'Hidden Gems' badge.",
        importantInfo: [
            "This is a walking tour; please wear comfortable shoes.",
            "Respect local customs; modest dress is appreciated (shoulders and knees covered).",
            "Not suitable for wheelchairs due to uneven ground.",
            "Be prepared for sensory richness—smells, sounds, and sights.",
            "Photos are allowed but please ask permission before photographing people."
        ],
        faqs: [
            {
                q: "Is there a lot of walking?",
                a: "We cover about 3-4km at a leisurely pace."
            },
            {
                q: "Do we go into the Souks?",
                a: "We pass through some markets, but the focus is on the residential and artisan areas."
            },
            {
                q: "Is it safe?",
                a: "Yes, the Medina is very safe, and being with a local guide ensures a hassle-free experience."
            },
            {
                q: "Can I bring a stroller?",
                a: "It is difficult due to stairs and crowds; a carrier is recommended."
            },
            {
                q: "Will we be pressured to buy things?",
                a: "No, this is strictly a no-commission, no-pressure cultural tour."
            }
        ],
        relatedExperiences: [
            "Ultimate Street Food Tour",
            "Bahia Palace & Ben Youssef Madrasa",
            "Rooftop Sunrise Yoga"
        ],
        imageConcepts: [
            "Guide pointing at architectural detail in alley",
            "Baker putting bread into wood-fired oven",
            "Woodworker using bow-lathe tool",
            "Cat sleeping on colorful rug in medina",
            "Group walking through an archway"
        ],
        pickupAvailable: false,
        gallery: [
            "/images/experiences/walking-tour-1.jpg",
            "/images/experiences/walking-tour-2.jpg"
        ]
    },
    {
        title: "Vintage Sidecar Tour: The Insider's Ride",
        category: "City Tours",
        location: "Marrakech City",
        duration: "1.5 hours",
        price: 90,
        currency: "EUR",
        shortDescription: "Feel the wind in your hair as you zip through Marrakech in a classic vintage sidecar motorbike.",
        fullDescription: "Experience Marrakech like a movie star on this unforgettable vintage sidecar adventure. This is not just a transfer; it's the most stylish way to discover the contrasts of the Red City. Hop into the sidecar of a classic Chang Jiang 750 (a 1930s BMW replica) and let your 'insider' driver guide you through streets that cars can't reach and buses can't fit.\n\nWe customize the route to your interests. Want to see the Art Deco architecture of Gueliz? The lush pathways of the Palmeraie? Or skirt the ancient 12th-century ramparts at sunset? The open-air ride allows you to absorb the sights, sounds, and smells of the city with 360-degree views. It’s thrilling, photogenic, and undeniably cool.\n\nYour driver is an expat or local expert who knows the city inside out. They will share anecdotes, point out hidden spots, and stop for photos whenever you spot something amazing. Perfect for couples, friends, or anyone who wants see the city with a sense of freedom and nostalgia.",
        highlights: [
            "Private tour in a vintage sidecar motorcycle",
            "360-degree unobstructed views",
            "Customizable itinerary (Medina, Gueliz, or Palmeraie)",
            "Access to narrow streets and hidden areas",
            "Insider driver/guide with local knowledge",
            "Helmets and hygiene caps provided",
            "Unique photo opportunities",
            "Stylish and thrilling experience"
        ],
        itinerary: [
            {
                title: "Pickup & Briefing",
                description: "Meet your driver at your hotel or a central cafe. Safety briefing and helmet fitting."
            },
            {
                title: "The Ride Begins",
                description: "Set off through the bustling streets. Feel the thrill as you weave through traffic and find open roads."
            },
            {
                title: "Scenic Stops",
                description: "Stop at the Koutoubia Gardens, the Ancient Walls, or the Palm Grove for photos."
            },
            {
                title: "Gueliz & Hivernage",
                description: "Cruise through the French quarter to see the contrast of modern Marrakech."
            },
            {
                title: "Drop-off",
                description: "Arrive back at your destination with wind-blown hair and a big smile."
            }
        ],
        included: [
            "Private Sidecar with Driver",
            "Helmets and goggles",
            "Water bottle",
            "Insurance"
        ],
        notIncluded: [
            "Food and drinks",
            "Gratuities",
            "Entry fees to monuments"
        ],
        meetingPoint: "Grand Cafe de la Poste, Gueliz (or Hotel pickup if within zone).",
        importantInfo: [
            "Max 2 passengers per sidecar (one in the bucket, one behind the driver).",
            "Max weight approx 100kg per passenger.",
            "Not suitable for pregnant women or children under 5.",
            "Please wear closed shoes and sunglasses.",
            "The ride operates in light rain (ponchos provided) but may reschedule for storms."
        ],
        faqs: [
            {
                q: "Is it safe?",
                a: "Yes, our drivers are experienced and drive defensively. Speed is moderate for sightseeing."
            },
            {
                q: "Can I drive the bike?",
                a: "No, for insurance reasons, only our professional drivers operate the vehicles."
            },
            {
                q: "How many people fits in one bike?",
                a: "Two passengers max. If you are a group of 3, you will need 2 bikes."
            },
            {
                q: "Is it suitable for seniors?",
                a: "Yes, as long as you have good mobility to step in/out of the sidecar."
            },
            {
                q: "Can we stop for coffee?",
                a: "Yes, the tour is flexible!"
            }
        ],
        relatedExperiences: [
            "Marrakech Photography Tour",
            "Quad Biking in Agafay",
            "Hot Air Balloon Over Marrakech"
        ],
        imageConcepts: [
            "Sidecar driving past Koutoubia mosque",
            "Passenger laughing in sidecar with goggles",
            "Convoy of sidecars in the Palmeraie",
            "Vintage bike detail shot",
            "Sunset ride near the city walls"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/sidecar-1.jpg",
            "/images/experiences/sidecar-2.jpg"
        ]
    },
    {
        title: "Evening Jemaa El Fna & Souk Tasting Tour",
        category: "City Tours",
        location: "Jemaa el-Fnaa",
        duration: "2.5 hours",
        price: 35,
        currency: "EUR",
        shortDescription: "Experience the magic of the main square at night and taste local specialties with a guide.",
        fullDescription: "As the sun sets, Jemaa el-Fnaa transforms from a trading square into an open-air theatre. This UNESCO Masterpiece of Oral Heritage is chaotic, loud, and mesmerizing. Navigating it alone can be overwhelming; navigating it with our local guide is an adventure. \n\nWe begin on a rooftop terrace to watch the sunset over the square as the lights flicker on and the smoke from the food stalls rises. Then, we plunge into the crowd. Your guide will steer you through the circles of storytellers, musicians, and performers, explaining the history and cultural significance of this nightly gathering. \n\nWe will visit the food stalls—not the tourist traps, but the ones locals trust. Taste Harira (soup), Maakouda (potato cakes), slow-roasted lamb, and spiced tea. We'll also weave through the night market of the souk, where the atmosphere is electric. This tour gives you the confidence to enjoy the square safely and understand the spectacle before you.",
        highlights: [
            "Sunset rooftop view of Jemaa el-Fnaa",
            "Guided walk through the performance circles",
            "History of the UNESCO Heritage site",
            "Tasting of 4-5 local street food snacks",
            "Safe navigation of the crowds",
            "Visit to the spice market at night",
            "Small group experience",
            "Tips on how to haggle and avoid scams"
        ],
        itinerary: [
            {
                title: "Sunset Rooftop",
                description: "Meet and head immediately to a panoramic terrace to watch the square come alive at dusk."
            },
            {
                title: "Heritage Circles",
                description: "Walk down into the square to listen to Gnawa musicians and storytellers."
            },
            {
                title: "Snack Stop 1",
                description: "Try traditional Harira soup and dates at a local stand."
            },
            {
                title: "The Souk at Night",
                description: "A short loop through the olive and spice markets to smell the evening aromas."
            },
            {
                title: "Main Feast",
                description: "Sit at a selected food stall for a tasting of grilled meats or vegetables."
            }
        ],
        included: [
            "Local Guide",
            "All food tastings (equivalent to a light dinner)",
            "Mineral water",
            "Rooftop drink (tea/soda)"
        ],
        notIncluded: [
            "Alcoholic beverages",
            "Tips for performers (bring small coins)",
            "Hotel drop-off"
        ],
        meetingPoint: "Post Office (Barid Al Maghrib), Jemaa el-Fnaa squares. Steps of the main entrance.",
        importantInfo: [
            "Crowds can be dense; keep valuables safe.",
            "Vegetarian options are available (please advise).",
            "Not recommended for those with mobility issues due to crowds.",
            "Bring small change (dirhams) if you want to tip performers.",
            "We strictly avoid snake charmers and monkey handlers for animal welfare reasons."
        ],
        faqs: [
            {
                q: "Is it safe to eat the street food?",
                a: "Yes, we only visit stalls with high turnover and hygiene standards."
            },
            {
                q: "Is it tailored for kids?",
                a: "Kids love the spectacle, but the crowds can be intense. Best for ages 6+."
            },
            {
                q: "Can I take photos of performers?",
                a: "They expect payment (10-20 dhs). Ask your guide before snapping."
            },
            {
                q: "Is dinner included?",
                a: "Yes, the tastings add up to a full meal."
            },
            {
                q: "Is it scary at night?",
                a: "With a guide, it is very safe and fun."
            }
        ],
        relatedExperiences: [
            "Ultimate Street Food Tour",
            "Marrakech Photography Tour",
            "Rooftop Sunrise Yoga"
        ],
        imageConcepts: [
            "Jemaa el Fnaa at night with smoke and lights",
            "Close up of Harira soup bowl",
            "Musicians performing in the square",
            "Steam rising from food stall grills",
            "Group cheering with tea glasses"
        ],
        pickupAvailable: false,
        gallery: [
            "/images/experiences/jemaa-night-1.jpg",
            "/images/experiences/jemaa-night-2.jpg"
        ]
    },
    {
        title: "Marrakech Photography Tour: Light & Shadow",
        category: "City Tours",
        location: "Marrakech Medina",
        duration: "3 hours",
        price: 50,
        currency: "EUR",
        shortDescription: "Capture the vibrant colors and unique light of Marrakech with a professional photographer guide.",
        fullDescription: "Marrakech is a photographer's dream, but it can be challenging to capture. Harsh midday sun, narrow dark alleys, and privacy-conscious locals require a specific approach. This specialized tour is led by a professional photographer living in Marrakech who will help you find the best angles, understand the light, and respect the culture.\n\nWhether you are shooting with a DSLR, a mirrorless camera, or an iPhone, this tour is about 'seeing'. We will visit photogenic locations including the Ben Youssef Madrasa, the dyer's souk with its colorful wool, and hidden architectural gems with stunning zellige tilework. \n\nYou will learn about composition, how to manage high contrast light, and most importantly, the etiquette of street photography in Morocco. Your guide will also act as a facilitator, helping you interact with locals if you wish to take portraits. Return home with a portfolio of stunning images that truly capture the spirit of your trip.",
        highlights: [
            "Guidance from a pro photographer",
            "Visit the most photogenic spots in town",
            "Learn street photography etiquette",
            "Technical tips for your specific camera",
            "Golden hour shooting (afternoon slot)",
            "Discover hidden courtyards",
            "Constructive feedback on your shots",
            "Small group (Max 6) for personal attention"
        ],
        itinerary: [
            {
                title: "Briefing & Settings",
                description: "Meet for coffee to discuss your camera settings and goals for the session."
            },
            {
                title: "Architecture Walk",
                description: "Explore the Ben Youssef or Bahia Palace to practice symmetry, patterns, and low light."
            },
            {
                title: "Souk Street Life",
                description: "Head into the souks to capture movement, colors, and street scenes."
            },
            {
                title: "The Golden Hour",
                description: "End the tour at a vantage point to capture the warm late-afternoon light on the red walls."
            },
            {
                title: "Review",
                description: "Quick review of your best shots and final tips."
            }
        ],
        included: [
            "Professional Photographer Guide",
            "Coffee or tea",
            "Route map of photo spots"
        ],
        notIncluded: [
            "Camera equipment (bring your own)",
            "Entrance fees to monuments",
            "Transportation"
        ],
        meetingPoint: "Cafe des Epices, Medina.",
        importantInfo: [
            "Bring your camera (DSLR, Mirrorless, or Phone) with fully charged batteries.",
            "Wear comfortable shoes for walking.",
            "Respect is key: Never photograph people without permission.",
            "Morning (9am) or Afternoon (4pm) slots recommended for best light.",
            "Beginner to Advanced levels welcome."
        ],
        faqs: [
            {
                q: "I only have an iPhone, can I join?",
                a: "Yes! The principles of composition and light apply to all cameras."
            },
            {
                q: "Can I take photos of people?",
                a: "Your guide will teach you how to ask politely; some may decline, which we respect."
            },
            {
                q: "Is this a workshop?",
                a: "It's a walking tour with instruction. It's hands-on learning."
            },
            {
                q: "Do you rent cameras?",
                a: "No, you must bring your own equipment."
            },
            {
                q: "Where do we go?",
                a: "The route changes based on light and crowds, but always includes the Medina highlights."
            }
        ],
        relatedExperiences: [
            "Melalh Jewish Quarter Heritage Tour",
            "Vintage Sidecar Tour",
            "Ouzoud Waterfalls Full-Day Trip"
        ],
        imageConcepts: [
            "Ray of light hitting a brass lamp in souk",
            "Photographer crouching to get low angle",
            "Symmetry of Ben Youssef Madrasa courtyard",
            "Vibrant colored wool drying in sun",
            "Silhouette of person walking through arch"
        ],
        pickupAvailable: false,
        gallery: [
            "/images/experiences/photo-tour-1.jpg",
            "/images/experiences/photo-tour-2.jpg"
        ]
    },
    {
        title: "Bahia Palace & Ben Youssef Madrasa Masterpieces",
        category: "City Tours",
        location: "Medina",
        duration: "3 hours",
        price: 40,
        currency: "EUR",
        shortDescription: "A deep dive into the architectural wonders of Marrakech with a historian guide.",
        fullDescription: "Marrakech is defined by its stunning Islamic architecture. This guided tour focuses on the two crown jewels of the city: The Bahia Palace and the Ben Youssef Madrasa. Rather than wandering aimlessly, let a specialized history guide unlock the secrets of these buildings.\n\nFirst, the Bahia Palace, a 19th-century masterpiece built to be the greatest palace of its time. Wander through the harem courtyards, admire the painted cedar ceilings, and hear stories of the Grand Vizier and his wives. Then, navigate the winding streets to the Ben Youssef Madrasa, the largest Islamic college in Morocco. Recently restored, its intricate stucco, zellige, and marble work is breathtaking. \n\nYour guide will explain the symbolism in the geometric patterns, the history of education in the Golden Age, and the techniques used by the artisans. This is a visual and intellectual feast for lovers of history and design.",
        highlights: [
            "Skip-the-ticket-line assistance",
            "Expert Historian Guide",
            "In-depth tour of Bahia Palace",
            "Visit to Ben Youssef Madrasa",
            "Understanding of Arabic Architecture",
            "Walking route through oldest parts of Medina",
            "Small group experience",
            "Photo opportunities in empty corners"
        ],
        itinerary: [
            {
                title: "Meeting",
                description: "Meet outside the Bahia Palace entrance."
            },
            {
                title: "Bahia Palace",
                description: "Guided exploration of the Grand Courtyard, the Harem, and the reception halls (1.5 hours)."
            },
            {
                title: "Medina Walk",
                description: "A 20-minute guided walk through the old city to reach the Madrasa."
            },
            {
                title: "Ben Youssef Madrasa",
                description: "Tour of the dormitory cells, the prayer hall, and the main courtyard (45 mins)."
            },
            {
                title: "Conclusion",
                description: "End near the Marrakech Museum with recommendations for the rest of your day."
            }
        ],
        included: [
            "Certified History Guide",
            "Guided tour of both monuments"
        ],
        notIncluded: [
            "Entrance Tickets (approx 7 EUR per monument, payable on site)",
            "Transport",
            "Food/Drinks"
        ],
        meetingPoint: "Main Gate of Bahia Palace. Look for the guide holding a 'Marrakech History' sign.",
        importantInfo: [
            "Entrance fees are NOT included; bring cash (approx 140 MAD total).",
            "Ben Youssef is very popular; we start early or late to avoid crowds.",
            "Wear comfortable walking shoes.",
            "Modest dress is required for religious sites.",
            "Tour operates in all weather."
        ],
        faqs: [
            {
                q: "Why aren't tickets included?",
                a: "The monuments require individual purchase on-site, but we help facilitate it."
            },
            {
                q: "Is it suitable for children?",
                a: "History buffs love it; young children might find it long. We can adapt for families."
            },
            {
                q: "Is there AC?",
                a: "No, these are historic buildings. They stay relatively cool but can be hot in summer."
            },
            {
                q: "Can we visit the Saadian Tombs too?",
                a: "This tour focuses on Bahia and Ben Youssef. We can add Tombs as a private extension."
            },
            {
                q: "Are there toilets?",
                a: "Yes, at both monuments."
            }
        ],
        relatedExperiences: [
            "Calligraphy Workshop",
            "Pottery & Zellige Artisan Workshop",
            "Medina Hidden Gems Walking Tour"
        ],
        imageConcepts: [
            "Wide angle of Ben Youssef courtyard and pool",
            "Detail of painted cedar ceiling at Bahia",
            "Sunlight casting shadows on Zellige tiles",
            "Guide explaining stucco inscription",
            "View from Madrasa window looking down"
        ],
        pickupAvailable: false,
        gallery: [
            "/images/experiences/bahia-1.jpg",
            "/images/experiences/ben-youssef-1.jpg"
        ]
    },
    {
        title: "Jewish Quarter (Mellah) & Heritage Tour",
        category: "City Tours",
        location: "Mellah District",
        duration: "2 hours",
        price: 35,
        currency: "EUR",
        shortDescription: "Explore the historic Mellah, ancient synagogues, and the legacy of coexistence in Marrakech.",
        fullDescription: "Marrakech tells a story of centuries of coexistence between Muslims and Jews. The Mellah, created in 1558, is the historic Jewish quarter of the city, distinguished by its balconied architecture and unique atmosphere. This tour is a journey into that often-overlooked heritage.\n\nWe begin at the Place des Ferblantiers (Tin Smiths Square) and enter the Mellah. You will visit the Slat Al Azama Synagogue (built in 1492), a beautiful blue-and-white courtyard building that is still active today. We then walk to the Miaara Jewish Cemetery, the largest in Morocco, a place of profound silence and history.\n\nAs we walk through the narrow streets, you will visit the Spice Market—historically the center of the spice trade—and learn about the shared traditions, crafts, and cuisine of the two communities. This is a poignant and educational tour that highlights the diversity of Moroccan identity.",
        highlights: [
            "Visit Slat Al Azama Synagogue & Museum",
            "Walk through the Miaara Jewish Cemetery",
            "Explore the Mellah Spice Souk",
            "Learn about Andalusian-Jewish history",
            "See traditional Mellah architecture (balconies)",
            "Stories of coexistence",
            "Small group tour"
        ],
        itinerary: [
            {
                title: "Gateway to Mellah",
                description: "Meet at Place des Ferblantiers and learn the history of the walls."
            },
            {
                title: "Spice & Gold",
                description: "Walk through the gold souk and spice market, traditional trades of the quarter."
            },
            {
                title: "Synagogue Visit",
                description: "Tour the Slat Al Azama Synagogue and its small museum of Jewish heritage."
            },
            {
                title: "The Cemetery",
                description: "Visit the vast Miaara cemetery (gatekeeper donation included)."
            },
            {
                title: "Local Life",
                description: "End with a walk through the residential bustling streets of the Mellah."
            }
        ],
        included: [
            "Specialized Heritage Guide",
            "Entrance donation to Synagogue",
            "Entrance donation to Cemetery",
            "Bottled water"
        ],
        notIncluded: [
            "Tips",
            "Personal purchases in spice market"
        ],
        meetingPoint: "Place des Ferblantiers, under the archway near 'Kosybar'.",
        importantInfo: [
            "The Synagogue and Cemetery are CLOSED on Fridays (afternoon) and Saturdays (Shabbat).",
            "Men may be asked to wear a kippah (provided) in the Synagogue.",
            "Modest dress is required.",
            "Photography is allowed but be respectful in the cemetery."
        ],
        faqs: [
            {
                q: "Is the tour available on Saturday?",
                a: "No, due to Shabbat closures, we do not operate this tour on Saturdays."
            },
            {
                q: "Is it a religious tour?",
                a: "It is a cultural and historical tour, open to everyone of all faiths."
            },
            {
                q: "Is the cemetery always open?",
                a: "It closes early (around 4pm) and on Jewish holidays."
            },
            {
                q: "Is it wheelchair accessible?",
                a: "The Mellah streets are flat but the cemetery has uneven ground."
            },
            {
                q: "Can we buy spices?",
                a: "Yes, but there is no obligation. Your guide can help you bargain."
            }
        ],
        relatedExperiences: [
            "Bahia Palace & Ben Youssef Madrasa Masterpieces",
            "Dinner with a Local Family",
            "Essaouira Coastal Escape"
        ],
        imageConcepts: [
            "Blue and white courtyard of Lazama Synagogue",
            "Perspective shot of Miaara cemetery gravestones",
            "Colorful spice towers in Mellah market",
            "Wooden balconies characteristic of Mellah",
            "Guide holding old photo of the quarter"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/mellah-1.jpg",
            "/images/experiences/mellah-2.jpg"
        ]
    }
];
