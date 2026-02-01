// Experiences Data - Part 1: Types and Categories
export interface Experience {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    shortDescription: string;
    fullDescription: string;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    meetingPoint: string;
    pickupAvailable: boolean;
    gallery: string[];
    faqs: { q: string; a: string }[];
    enabled: boolean;
    featured: boolean;
    popularity: number;
}

export const EXPERIENCE_CATEGORIES = [
    "Wellness",
    "City Tours",
    "Food & Drink",
    "Desert Experiences",
    "Day Trips",
    "Workshops & Culture",
    "Entertainment",
    "Sports & Adventure",
    "Transfers"
] as const;

export type ExperienceCategory = typeof EXPERIENCE_CATEGORIES[number];

// Helper to generate slug
const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const experiences: Experience[] = [
    // ===== WELLNESS (4) =====
    {
        id: "exp-wellness-001",
        title: "Rooftop Sunrise Yoga",
        slug: "rooftop-sunrise-yoga",
        category: "Wellness",
        location: "Marrakech Medina",
        duration: "1.5 hours",
        price: 35,
        currency: "EUR",
        shortDescription: "Start your day with a peaceful yoga session on a traditional riad rooftop as the sun rises over the Medina.",
        fullDescription: "Experience the magic of Marrakech at dawn with our signature rooftop yoga session. As the first rays of sunlight paint the Atlas Mountains in golden hues, you'll flow through a carefully curated sequence of asanas designed for all levels. Our certified instructor guides you through breathing exercises, gentle stretches, and mindful meditation on a beautifully decorated rooftop terrace overlooking the ancient Medina. The session concludes with traditional Moroccan mint tea and light breakfast pastries. This intimate experience is limited to 8 participants, ensuring personalized attention and a serene atmosphere. Whether you're a seasoned yogi or complete beginner, this session offers the perfect blend of physical practice and cultural immersion.",
        highlights: [
            "Panoramic views of the Atlas Mountains at sunrise",
            "All-levels yoga suitable for beginners",
            "Includes Moroccan mint tea and pastries",
            "Certified bilingual instructor",
            "Intimate group of max 8 people"
        ],
        included: [
            "90-minute yoga session",
            "Yoga mat and props",
            "Moroccan mint tea",
            "Light breakfast pastries",
            "Bottled water"
        ],
        notIncluded: [
            "Hotel pickup",
            "Gratuities"
        ],
        meetingPoint: "Riad Lotus Ambre, 34 Derb Sidi Ahmed ou Moussa, Marrakech Medina",
        pickupAvailable: false,
        gallery: ["/images/experiences/yoga-1.jpg", "/images/experiences/yoga-2.jpg", "/images/experiences/yoga-3.jpg"],
        faqs: [
            { q: "Do I need yoga experience?", a: "No, this session is designed for all levels including complete beginners." },
            { q: "What should I wear?", a: "Comfortable, stretchy clothing. Layers recommended as mornings can be cool." },
            { q: "What time does the session start?", a: "Sessions begin at sunrise, approximately 6:00-6:30 AM depending on season." }
        ],
        enabled: true,
        featured: true,
        popularity: 92
    },
    {
        id: "exp-wellness-002",
        title: "Moroccan Hammam & Spa Ritual",
        slug: "moroccan-hammam-spa-ritual",
        category: "Wellness",
        location: "Marrakech",
        duration: "2.5 hours",
        price: 65,
        currency: "EUR",
        shortDescription: "Indulge in an authentic Moroccan hammam experience with black soap scrub, ghassoul clay mask, and relaxing massage.",
        fullDescription: "Immerse yourself in centuries-old Moroccan bathing traditions with our luxurious hammam ritual. Your journey begins in the warm room where the steam opens your pores and relaxes your muscles. A skilled therapist applies traditional black soap (savon noir) made from olives, followed by an invigorating exfoliation using a special kessa glove that removes dead skin and leaves your skin incredibly soft. Next comes the ghassoul clay mask, rich in minerals from the Atlas Mountains, known for its purifying and beautifying properties. The ritual concludes with a soothing argan oil massage that nourishes your skin and calms your mind. Throughout the experience, you'll enjoy mint tea and Moroccan sweets in the relaxation lounge.",
        highlights: [
            "Traditional black soap and kessa exfoliation",
            "Ghassoul clay mask from the Atlas Mountains",
            "30-minute argan oil massage",
            "Private hammam suite available",
            "Includes mint tea and pastries"
        ],
        included: [
            "Full hammam ritual",
            "Black soap treatment",
            "Kessa glove exfoliation",
            "Ghassoul clay mask",
            "30-minute massage",
            "Mint tea and sweets",
            "Towels and slippers"
        ],
        notIncluded: [
            "Hotel pickup/dropoff",
            "Gratuities",
            "Additional treatments"
        ],
        meetingPoint: "Les Bains de Marrakech, 2 Derb Sedra, Bab Agnaou, Marrakech",
        pickupAvailable: true,
        gallery: ["/images/experiences/hammam-1.jpg", "/images/experiences/hammam-2.jpg"],
        faqs: [
            { q: "Is this experience suitable for men?", a: "Yes, we offer separate sessions for men and women, or private couple experiences." },
            { q: "What should I bring?", a: "Just yourself! We provide all towels, slippers, and products. You can bring your own swimsuit or use disposable underwear we provide." }
        ],
        enabled: true,
        featured: true,
        popularity: 95
    },
    {
        id: "exp-wellness-003",
        title: "Luxury Spa & Massage Package",
        slug: "luxury-spa-massage-package",
        category: "Wellness",
        location: "Marrakech",
        duration: "3 hours",
        price: 120,
        currency: "EUR",
        shortDescription: "Premium spa day featuring aromatherapy massage, facial treatment, and access to pool and relaxation areas.",
        fullDescription: "Escape the bustling souks and retreat to a tranquil oasis with our premium spa package at one of Marrakech's most exclusive wellness centers. Your experience begins with a welcome ritual of rose water and dates, followed by a consultation to customize your treatments. Enjoy a 60-minute full-body aromatherapy massage using organic argan and rose oils, followed by a rejuvenating facial tailored to your skin type. Between treatments, lounge by the heated pool, unwind in the eucalyptus steam room, or enjoy the peaceful gardens. The package includes a healthy Moroccan lunch featuring fresh salads, grilled vegetables, and seasonal fruits. Leave feeling completely renewed and ready to explore.",
        highlights: [
            "60-minute aromatherapy massage",
            "Custom facial treatment",
            "Pool and steam room access",
            "Healthy Moroccan lunch included",
            "5-star luxury spa setting"
        ],
        included: [
            "Welcome ritual with rose water",
            "60-minute full body massage",
            "45-minute facial treatment",
            "Healthy lunch",
            "Pool and facilities access",
            "Bathrobe and slippers",
            "Herbal teas throughout"
        ],
        notIncluded: [
            "Hotel transfer",
            "Gratuities",
            "Additional treatments"
        ],
        meetingPoint: "Royal Mansour Spa, Rue Abou Abbas El Sebti, Marrakech",
        pickupAvailable: true,
        gallery: ["/images/experiences/spa-1.jpg", "/images/experiences/spa-2.jpg"],
        faqs: [
            { q: "Can I book for couples?", a: "Yes, we offer couple's suites with side-by-side treatments." },
            { q: "Are there any health restrictions?", a: "Please inform us of any allergies or health conditions when booking." }
        ],
        enabled: true,
        featured: false,
        popularity: 78
    },
    {
        id: "exp-wellness-004",
        title: "Traditional Henna Art Session",
        slug: "traditional-henna-art-session",
        category: "Wellness",
        location: "Marrakech Medina",
        duration: "1 hour",
        price: 25,
        currency: "EUR",
        shortDescription: "Learn about Moroccan henna traditions and receive beautiful temporary body art from a master henna artist.",
        fullDescription: "Discover the ancient art of henna with this intimate cultural experience led by a third-generation henna artist. Begin with an introduction to the significance of henna in Moroccan culture, from wedding celebrations to everyday adornment. Learn about the natural ingredients used to create the paste and the symbolic meanings behind traditional patterns. Then, choose from classic Moroccan designs or collaborate with the artist to create something unique. While the henna sets, enjoy traditional Moroccan tea and hear stories about local customs and traditions. You'll leave with beautiful temporary body art that lasts 1-3 weeks and a deeper appreciation for this living art form.",
        highlights: [
            "Master henna artist with 20+ years experience",
            "Learn about henna cultural significance",
            "Choose traditional or custom designs",
            "Includes mint tea and treats",
            "Take home henna care instructions"
        ],
        included: [
            "Henna design of your choice",
            "Natural organic henna paste",
            "Cultural introduction",
            "Mint tea and Moroccan cookies",
            "Aftercare instructions"
        ],
        notIncluded: [
            "Hotel pickup",
            "Additional designs (available for extra fee)"
        ],
        meetingPoint: "Henna Art Cafe, 35 Derb Chorfa Lakbir, Marrakech Medina",
        pickupAvailable: false,
        gallery: ["/images/experiences/henna-1.jpg", "/images/experiences/henna-2.jpg"],
        faqs: [
            { q: "Is the henna natural?", a: "Yes, we use 100% natural henna mixed with essential oils. No chemicals added." },
            { q: "How long does it last?", a: "The design typically lasts 1-3 weeks depending on skin type and care." }
        ],
        enabled: true,
        featured: false,
        popularity: 72
    },

    // ===== CITY TOURS (6) =====
    {
        id: "exp-citytours-001",
        title: "Medina Hidden Gems Walking Tour",
        slug: "medina-hidden-gems-walking-tour",
        category: "City Tours",
        location: "Marrakech Medina",
        duration: "3 hours",
        price: 45,
        currency: "EUR",
        shortDescription: "Explore secret passages, hidden riads, and local artisan workshops with a born-and-raised Marrakchi guide.",
        fullDescription: "Go beyond the tourist trail and discover the authentic heart of Marrakech's ancient Medina with a guide who grew up in its labyrinthine streets. This immersive walking tour takes you through hidden alleyways that most visitors never find, revealing secret gardens, centuries-old fountains, and neighborhood mosques. Visit family-run workshops where artisans practice crafts passed down through generations—watch brass being hammered, leather being dyed, and carpets being woven. Stop at a local bakery to see how traditional bread is made in communal wood-fired ovens. Learn about daily life, local customs, and the stories behind the architecture. The tour includes stops at a traditional tea house and ends with panoramic rooftop views.",
        highlights: [
            "Born-and-raised local guide",
            "Secret passages and hidden gardens",
            "Artisan workshop visits",
            "Traditional bakery stop",
            "Rooftop views of the Medina"
        ],
        included: [
            "Expert local guide",
            "Mint tea at traditional tea house",
            "Small group (max 10)",
            "Artisan workshop visits",
            "Walking map of the Medina"
        ],
        notIncluded: [
            "Hotel pickup",
            "Food and additional drinks",
            "Gratuities",
            "Purchases from artisans"
        ],
        meetingPoint: "Cafe de France, Jemaa El Fna Square",
        pickupAvailable: false,
        gallery: ["/images/experiences/medina-tour-1.jpg", "/images/experiences/medina-tour-2.jpg"],
        faqs: [
            { q: "Is the tour suitable for children?", a: "Yes, children are welcome. The pace is moderate with stops." },
            { q: "How much walking is involved?", a: "Approximately 3-4 km on mostly flat terrain. Comfortable shoes recommended." }
        ],
        enabled: true,
        featured: true,
        popularity: 96
    },
    {
        id: "exp-citytours-002",
        title: "Vintage Sidecar Tour",
        slug: "vintage-sidecar-tour",
        category: "City Tours",
        location: "Marrakech",
        duration: "3 hours",
        price: 95,
        currency: "EUR",
        shortDescription: "Cruise through Marrakech in a beautifully restored vintage motorcycle sidecar with a professional driver-guide.",
        fullDescription: "Experience Marrakech from a unique vantage point aboard a lovingly restored 1940s motorcycle sidecar. Your professional driver-guide whisks you through the city's diverse neighborhoods, from the ancient Medina walls to the chic Gueliz district. Feel the breeze as you pass royal gardens, historic monuments, and vibrant street scenes. This photogenic journey includes stops at key landmarks including the Koutoubia Mosque, Majorelle Garden gates, and the stunning Menara Gardens with Atlas Mountain views. Your guide shares fascinating stories about Moroccan history, architecture, and culture throughout. The experience includes a vintage-style photo session and refreshments at a stylish café. Each sidecar accommodates two passengers for an intimate adventure.",
        highlights: [
            "Restored 1940s motorcycle sidecar",
            "Professional driver-guide",
            "Key landmarks and hidden spots",
            "Vintage photo session included",
            "Refreshments at stylish café"
        ],
        included: [
            "3-hour sidecar tour",
            "Professional driver-guide",
            "Helmet and goggles",
            "Photo session",
            "Refreshments",
            "Hotel pickup/dropoff"
        ],
        notIncluded: [
            "Monument entrance fees",
            "Gratuities"
        ],
        meetingPoint: "Pickup from your hotel in Marrakech",
        pickupAvailable: true,
        gallery: ["/images/experiences/sidecar-1.jpg", "/images/experiences/sidecar-2.jpg"],
        faqs: [
            { q: "Is it safe?", a: "Yes, our drivers are professionally trained and the sidecars are regularly maintained." },
            { q: "What if it rains?", a: "We provide rain covers and ponchos. Tours only cancel in severe weather with full refund." }
        ],
        enabled: true,
        featured: true,
        popularity: 88
    }
];
