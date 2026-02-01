import { RichExperience } from "./types";

export const transfersExperiences: RichExperience[] = [
    {
        title: "Marrakech Airport Arrival Transfer",
        category: "Transfers",
        location: "Marrakech Menara Airport (RAK)",
        duration: "45 mins",
        price: 20,
        currency: "EUR",
        shortDescription: "Hassle-free private transfer from the airport to your Hotel or Riad.",
        fullDescription: "Start your trip without stress. Avoid the taxi sharks and the confusion of the arrivals hall. Your private driver will be waiting for you inside the terminal holding a sign with your name. \n\nWe track your flight, so even if you are delayed, we will be there. You will be helped with your luggage and driven in a clean, air-conditioned vehicle directly to your accommodation. If you are staying in a Riad in the Medina (car-free zone), the driver will call the Riad staff to come and meet you at the drop-off point with a handcart for your bags.",
        highlights: [
            "Meet & Greet inside terminal",
            "Flight tracking",
            "Private AC Vehicle",
            "Fixed price (no haggling)",
            "Help with luggage",
            "Assistance locating Riad"
        ],
        itinerary: [
            {
                title: "Arrival",
                description: "Driver waits with sign."
            },
            {
                title: "Transfer",
                description: "Drive to city center (approx 20 mins)."
            },
            {
                title: "Drop-off",
                description: "At hotel or nearest Medina gate."
            }
        ],
        included: [
            "Private Vehicle",
            "Driver",
            "Fuel",
            "Airport parking fee"
        ],
        notIncluded: [
            "Tips"
        ],
        meetingPoint: "Arrivals Hall, Exit Gate.",
        importantInfo: [
            "Please provide flight number and arrival time.",
            "Price is per vehicle (up to 4 pax)."
        ],
        faqs: [
            {
                q: "What if my flight is late?",
                a: "We track it and wait for free."
            }
        ],
        relatedExperiences: [
            "Marrakech Airport Departure Transfer"
        ],
        imageConcepts: [
            "Driver holding a name sign in airport",
            "Clean interior of van",
            "Luggage being loaded",
            "Airport exterior"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/transfer-arrival-1.jpg"
        ]
    },
    {
        title: "Marrakech Airport Departure Transfer",
        category: "Transfers",
        location: "Marrakech City",
        duration: "45 mins",
        price: 15,
        currency: "EUR",
        shortDescription: "Reliable transfer from your hotel to the airport to catch your flight.",
        fullDescription: "End your trip smoothly. Your driver will pick you up from your hotel or Riad (at the nearest accessible point) and drive you to Marrakech Menara Airport. We recommend picking up 3 hours before your flight departure time to allow for traffic and airport checks.",
        highlights: [
            "Punctual Pickup",
            "Private AC Vehicle",
            "Fixed price",
            "Help with luggage"
        ],
        itinerary: [
            {
                title: "Pickup",
                description: "At agreed time."
            },
            {
                title: "Transfer",
                description: "Drive to Airport."
            },
            {
                title: "Drop-off",
                description: "Departures Terminal."
            }
        ],
        included: [
            "Private Vehicle",
            "Driver"
        ],
        notIncluded: [
            "Tips"
        ],
        meetingPoint: "Hotel Reception/Riad Gate.",
        importantInfo: [
            "Provide pickup time (3h before flight recommended)."
        ],
        faqs: [
            {
                q: "How long does it take?",
                a: "15-30 mins depending on traffic."
            }
        ],
        relatedExperiences: [
            "Marrakech Airport Arrival Transfer"
        ],
        imageConcepts: [
            "Car parked in front of Riad",
            "Driver opening door",
            "Airport departures entrance"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/transfer-depart-1.jpg"
        ]
    },
    {
        title: "Intercity Transfer: Marrakech to Casablanca",
        category: "Transfers",
        location: "Casablanca",
        duration: "3 hours",
        price: 120,
        currency: "EUR",
        shortDescription: "Private, comfortable transfer between Marrakech and Casablanca (City or Airport).",
        fullDescription: "Travel between Morocco's two major cities in comfort and privacy. Whether you are catching a flight from CMN or heading to a meeting in the economic capital, this private transfer is the most efficient way to travel. The drive takes about 2.5 to 3 hours on the highway. We can stop for a coffee break if needed.",
        highlights: [
            "Door-to-door service",
            "Highway tolls included",
            "Comfortable vehicle",
            "Flexible timing"
        ],
        itinerary: [
            {
                title: "Trip",
                description: "Highway drive (240km)."
            }
        ],
        included: [
            "Transport",
            "Tolls",
            "Driver"
        ],
        notIncluded: [
            "Tips"
        ],
        meetingPoint: "Hotel Pickup.",
        importantInfo: [
            "Price is per vehicle."
        ],
        faqs: [
            {
                q: "Can we stop?",
                a: "Yes, rest stops available."
            }
        ],
        relatedExperiences: [
            "Marrakech Airport Arrival Transfer"
        ],
        imageConcepts: [
            "Highway view with Atlas mountains",
            "Van interior",
            "Casablanca Hassan II Mosque (destination)"
        ],
        pickupAvailable: true,
        gallery: [
            "/images/experiences/transfer-casa-1.jpg"
        ]
    }
];
