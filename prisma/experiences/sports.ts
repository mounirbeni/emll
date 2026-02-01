import { RichExperience } from "./types";

export const sportsExperiences: RichExperience[] = [
    {
        title: "Golfing at the Foot of the Atlas",
        category: "Sports & Adventure",
        location: "Amelkis / Royal Golf",
        duration: "4 hours",
        price: 100,
        currency: "EUR",
        shortDescription: "Play 18 holes on one of Marrakech's world-class championship courses with mountain views.",
        fullDescription: "Marrakech is a premier golf destination, boasting courses designed by legends like Jack Nicklaus and Kyle Phillips. This package allows you to play 18 holes at one of the top clubs (Amelkis, Royal Golf, or Al Maaden), set against the stunning backdrop of the snow-capped High Atlas Mountains.\n\nThe fairways are lined with olive, palm, and orange trees, creating an oasis in the desert. The contrast of the green grass against the red earth and the blue sky is spectacular. We handle the tee-time booking, club rental (Titleist/Callaway), and transfers, so you just have to focus on your swing.",
        highlights: [
            "18 Holes Green Fee",
            "Choice of top courses (Amelkis, Royal, Assoufid)",
            "Caddie included",
            "Club rental arranged",
            "Private transfers",
            "Spectacular mountain views"
        ],
        itinerary: [
            {
                title: "Pickup",
                description: "Transfer from hotel to the Golf Club."
            },
            {
                title: "Warm up",
                description: "Access to driving range."
            },
            {
                title: "The Round",
                description: "18 holes of championship golf."
            },
            {
                title: "19th Hole",
                description: "Drink at the clubhouse (optional)."
            },
            {
                title: "Return",
                description: "Transfer back to hotel."
            }
        ],
        included: [
            "Green Fee (18 holes)",
            "Caddie fee",
            "Transfers"
        ],
        notIncluded: [
            "Club Rental (approx 30 EUR)",
            "Cart/Buggy (approx 40 EUR)",
            "Tips for Caddie",
            "Lunch"
        ],
        meetingPoint: "Hotel Pickup.",
        importantInfo: [
            "Handicap certificate may be required for some courses.",
            "Soft spikes only.",
            "Collared shirts required."
        ],
        faqs: [
            {
                q: "Can I rent clubs?",
                a: "Yes, we can pre-book rental sets for you."
            }
        ],
        relatedExperiences: [
            "Luxury Spa & Massage Package",
            "Sidecar Tour"
        ],
        imageConcepts: [
            "Golfer swinging with Atlas mountains in background",
            "Ball on the green near a palm tree",
            "Clubhouse terrace with view",
            "Caddie holding flag"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/golf-1.jpg",
            "/images/experiences/golf-2.jpg"
        ]
    },
    {
        title: "Wakeboarding at Waky Marrakech",
        category: "Sports & Adventure",
        location: "Ourika Road",
        duration: "2 hours",
        price: 40,
        currency: "EUR",
        shortDescription: "Cool off and catch some air at Marrakech's premier cable wake park.",
        fullDescription: "Surfing in the desert? Yes, really. Waky Marrakech is a state-of-the-art cable park located on a man-made lake with a view of the Atlas Mountains. It's the perfect place to escape the heat.\n\nThe cable system pulls you around the lake, with obstacles (kickers, sliders) for advanced riders and easy cruising for beginners. The Kneeboard is great for kids and first-timers, while wakeboarding offers a real challenge. The vibe is chill, with a pool, bar, and music playing. Experienced instructors are on hand to teach you how to stand up.",
        highlights: [
            "1 Hour Cable Pass",
            "Wakeboard or Kneeboard included",
            "Helmet and Vest included",
            "Coaching for beginners",
            "Access to pool and chill area",
            "Great atmosphere"
        ],
        itinerary: [
            {
                title: "Arrival",
                description: "Check-in and get equipment."
            },
            {
                title: "Briefing",
                description: "Safety rules and start dock instruction."
            },
            {
                title: "Riding",
                description: "1 hour of riding on the cable."
            },
            {
                title: "Chill",
                description: "Relax by the pool."
            }
        ],
        included: [
            "1 Hour Pass",
            "Gear rental",
            "Pool access"
        ],
        notIncluded: [
            "Transfer (can be arranged via Taxi)",
            "Food/Drinks"
        ],
        meetingPoint: "Waky Marrakech (Les Jardins de l'Atlas). 20 mins from center.",
        importantInfo: [
            "Must be able to swim.",
            "Bring towel and sunscreen."
        ],
        faqs: [
            {
                q: "Is it hard?",
                a: "Kneeboard is easy. Wakeboard takes a few tries to stand up."
            }
        ],
        relatedExperiences: [
            "Buggy Adventure",
            "Ouzoud Waterfalls"
        ],
        imageConcepts: [
            "Wakeboarder hitting a jump",
            "Spray of water with mountains behind",
            "Person putting on bindings on the dock",
            "Relaxing by the pool"
        ],
        pickupAvailable: false,
        gallery: [
            "/images/experiences/wake-1.jpg",
            "/images/experiences/wake-2.jpg"
        ]
    },
    {
        title: "Horse Riding in the Royal Club",
        category: "Sports & Adventure",
        location: "Agdal / Royal Equestrian Club",
        duration: "2 hours",
        price: 45,
        currency: "EUR",
        shortDescription: "Ride purebred Arabian horses in the historic Agdal gardens or Palmeraie.",
        fullDescription: "Experience the elegance of the Arabian horse. This riding session takes place at a prestigious club or in the vast palm groves. Suitable for all levels, from complete beginners to gallopers.\n\nYou will be matched with a horse that suits your ability. Ride through olive groves, past ancient walls, and along sandy tracks. The horses are well-trained and treated with respect. For experienced riders, a gallop along the long tracks is an exhilarating feeling.",
        highlights: [
            "1.5 Hour Ride",
            "Well-trained horses",
            "Helmets provided",
            "Professional instructor",
            "Scenic route"
        ],
        itinerary: [
            {
                title: "Briefing",
                description: "Meet your instructor and horse."
            },
            {
                title: "The Ride",
                description: "Ride through nature trails."
            },
            {
                title: "Grooming",
                description: "Opportunity to feed/groom horse after."
            }
        ],
        included: [
            "Horse rental",
            "Helmet",
            "Guide",
            "Transfer"
        ],
        notIncluded: [
            "Tips"
        ],
        meetingPoint: "Hotel Pickup.",
        importantInfo: [
            "Weight limit 90kg.",
            "Wear long trousers."
        ],
        faqs: [
            {
                q: "I've never ridden, is it okay?",
                a: "Yes, we have calm horses for beginners."
            }
        ],
        relatedExperiences: [
            "Sunset Camel Ride",
            "Quad Biking"
        ],
        imageConcepts: [
            "Horse trotting on a sandy path",
            "Rider patting horse neck",
            "Sunset silhouette of horse and rider",
            "Stables interaction"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/horse-1.jpg",
            "/images/experiences/horse-2.jpg"
        ]
    }
];
