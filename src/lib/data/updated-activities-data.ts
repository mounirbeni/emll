import { Activity } from "@/lib/types";

export const activitiesData: Record<string, Activity[]> = {
    healthServices: [
        {
            id: "h-01",
            title: "Rooftop Sunrise Yoga & Meditation",
            subtitle: "Awaken Above the Medina with Mountain Views",
            price: 20,
            rating: 0,
            reviews: 0,
            category: "Health Services",
            image: "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
            duration: "1.5 hours",
            features: ["Sunrise View", "Certified Instructor", "Meditation", "Small Group", "All Levels"],
            location: "Medina Rooftop Terrace",
            tags: ["Wellness", "Yoga", "Sunrise", "Meditation"],
            images: [
                "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Yoga Marrakech",
                image: "/localexpert.jpg",
                bio: "Led by certified yoga instructors trained in India and Morocco, Yoga Marrakech brings authentic wellness practices to the heart of the Medina, combining traditional Hatha yoga with the magic of Moroccan sunrise.",
                verified: true
            },
            description: "Begin your day with a transformative yoga practice as the sun rises over Marrakech's ancient medina. This intimate sunrise session on an exclusive rooftop terrace combines a gentle Hatha flow with mindful breathing and guided meditation. With panoramic 360-degree views of the Atlas Mountains and the Koutoubia Mosque, you'll experience a profound connection to nature and the awakening city. Limited to a small group, this session ensures personalized attention in a serene, non-competitive atmosphere, making it a complete sensory and spiritual journey.",
            included: [
                "Premium eco-friendly yoga mat and props",
                "Guided 60-minute Hatha yoga flow session",
                "15-minute guided meditation and savasana",
                "Traditional Moroccan herbal tea ceremony",
                "Light healthy breakfast snacks",
                "Bottled water and refreshments"
            ],

            exclusions: [
                "Transportation to the rooftop location",
                "Personal yoga attire",
                "Gratuities for the instructor"
            ],
            meetingPoint: "Rooftop Yoga Terrace, Central Medina (exact address and detailed directions provided upon booking)",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the session. Full refund for weather-related cancellations (e.g., rain, strong winds).",
            requirements: ["Barefoot practice on provided mats.", "It is recommended to have an empty or light stomach.", "Ability to sit, stand, and lie down comfortably."],
            ageRestrictions: "Suitable for ages 12 and above. Minors must be accompanied by an adult.",
            whatToBring: ["Comfortable, breathable yoga clothing.", "A light layer for the cool morning air.", "An open mind and positive energy."],
            experienceHighlights: [
                "Practice yoga with a stunning sunrise view over the Atlas Mountains.",
                "Enjoy an exclusive rooftop location with 360-degree panoramic views.",
                "Benefit from personalized instruction in a small, intimate group.",
                "Suitable for all levels, from beginners to advanced practitioners.",
                "Includes a guided meditation session and a traditional Moroccan tea ceremony."
            ],
            additionalInfo: "Sessions are held daily and scheduled to coincide with the sunrise, with timings adjusted seasonally. All mats and props are sanitized between sessions. Private and couple sessions are available upon request.",
            itinerary: [
                { time: "07:00", title: "Arrival & Welcome", description: "Arrive at the rooftop terrace to the sight of the lightening sky. Meet your instructor and fellow yogis, and enjoy a welcome herbal tea." },
                { time: "07:15", title: "Sunrise Hatha Flow", description: "Begin with gentle warm-up stretches as the sun begins to rise, progressing into a mindful Hatha yoga sequence synchronized with your breath." },
                { time: "08:00", title: "Meditation & Savasana", description: "Transition into stillness with a guided meditation focusing on gratitude and presence, followed by final relaxation in savasana." },
                { time: "08:15", title: "Tea & Reflection", description: "Conclude with a traditional Moroccan herbal tea ceremony and light snacks, with an opportunity to reflect and enjoy the peaceful morning atmosphere." }
            ],
            packageCategories: [
                {
                    name: "Session Types",
                    description: "Choose the yoga experience that's right for you.",
                    packages: [
                        {
                            name: "Standard Sunrise Session",
                            price: 20,
                            description: "A 1.5-hour group session including a certified instructor, meditation, and a light breakfast.",
                            included: ["Group session", "Certified instructor", "Meditation", "Light breakfast", "All equipment"],
                            notIncluded: []
                        },
                        {
                            name: "Private 1-on-1 Session",
                            price: 55,
                            description: "An exclusive session with the instructor's undivided attention, tailored to your personal goals and level.",
                            included: ["Private session", "Dedicated instructor", "Personalized sequence", "All equipment", "Light breakfast"],
                            notIncluded: []
                        }
                    ]
                }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Ideal for wellness-focused travelers, yoga enthusiasts of all levels, and anyone seeking a peaceful and mindful start to their day in Marrakech.",
            uniqueSellingPoints: [
                "An exclusive rooftop location with unparalleled views of the sunrise over the Atlas Mountains.",
                "Small group sizes ensure a personalized and intimate experience.",
                "An authentic cultural immersion that combines wellness with Moroccan hospitality."
            ],
            importantNotes: [
                "The session starts early to catch the sunrise; please be punctual.",
                "The rooftop is accessed via stairs; it is not wheelchair accessible.",
                "Modest athletic wear is recommended."
            ],
            whatToExpect: "Your experience begins with an early morning arrival at a serene rooftop, where you'll be greeted by the soft glow of dawn. As you settle onto your mat, the instructor will guide you through a gentle yoga flow that awakens the body and calms the mind. The session is timed perfectly with the sunrise, creating a magical atmosphere. Following the yoga practice, a guided meditation will help you cultivate a sense of inner peace. The experience concludes with a traditional tea ceremony, allowing you to savor the tranquility of the morning.",
            authenticMoroccanElements: [
                "The practice takes place on a traditional Medina rooftop.",
                "The experience includes a traditional Moroccan herbal tea ceremony.",
                "The session is accompanied by the morning call to prayer, providing a spiritual soundtrack."
            ],
            difficulty: "Easy",
            languages: ["English", "French"],
            accessibility: "The venue is not wheelchair accessible due to stairs. The yoga practice is suitable for all fitness levels, with modifications provided as needed.",
            seasonalNotes: "Available year-round, with session times adjusted to match the seasonal sunrise. Spring and fall offer the most temperate weather."
        },
        {
            id: "h-02",
            title: "Royal Moroccan Hammam & Spa Ritual",
            subtitle: "Authentic Traditional Purification Experience",
            price: 45,
            rating: 0,
            reviews: 0,
            category: "Health Services",
            image: "/Royal Moroccan Hammam & Spa Ritual.jpg",
            duration: "2 hours",
            features: ["Luxury Spa", "Black Soap Scrub", "Argan Massage", "Steam Room", "Traditional"],
            location: "Luxury Riad Spa, Medina",
            tags: ["Wellness", "Spa", "Traditional", "Relaxation"],
            images: [
                "/Royal Moroccan Hammam & Spa Ritual.jpg",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Rooftop Bliss Riad Spa",
                image: "/localexpert.jpg",
                bio: "Our Riad Spa is a sanctuary of peace in the heart of the Medina, offering authentic Moroccan wellness rituals passed down through generations. Our therapists are trained in the ancient arts of hammam and massage.",
                verified: true
            },
            description: "Immerse yourself in the timeless Moroccan tradition of the hammam. This transformative spa experience takes place in a beautifully restored riad, where zellige tilework and marble create an atmosphere of luxury. The ritual begins with a steam session to open your pores, followed by a vigorous exfoliation with black soap and a kessa glove. A purifying clay mask and a relaxing argan oil massage complete this journey of physical and spiritual renewal.",
            included: [
                "Access to a traditional hammam steam room",
                "Black soap and ghassoul clay treatment",
                "Exfoliation with a kessa glove",
                "Professional massage with premium argan oil",
                "Traditional Moroccan mint tea and pastries",
                "Premium towels, robes, and slippers"
            ],
            exclusions: ["Personal toiletries", "Additional spa treatments not included in the package", "Gratuities for the staff"],
            meetingPoint: "Rooftop Bliss Riad Spa, Medina (exact address provided upon booking)",
            endingPoint: "Spa Relaxation Lounge at the Riad",
            cancellationPolicy: "Free cancellation up to 24 hours before the appointment. A 50% charge applies for late cancellations.",
            requirements: ["Arrive 10 minutes early for a health consultation.", "Inform the staff of any health conditions or allergies."],
            ageRestrictions: "Suitable for ages 16 and above.",
            whatToBring: ["Swimwear or undergarments for the hammam is optional.", "Comfortable clothing to wear after the treatment."],
            experienceHighlights: [
                "An authentic, centuries-old Moroccan wellness ritual.",
                "A luxurious and traditional riad spa setting.",
                "Expert therapists trained in traditional Moroccan techniques.",
                "Natural, locally sourced products, including black soap, ghassoul clay, and pure argan oil."
            ],
            additionalInfo: "Appointments are available daily; booking at least 24-48 hours in advance is recommended. Private and couples packages are available. Gender-separated facilities can be arranged upon request.",
            itinerary: [
                { time: "Flexible", title: "Arrival & Consultation", description: "You'll be welcomed to the riad spa for a brief health consultation to tailor the treatment to your needs." },
                { time: "Flexible", title: "Steam & Black Soap Application", description: "Relax in the steam room as your pores open, followed by the application of traditional black soap." },
                { time: "Flexible", title: "Exfoliation & Clay Treatment", description: "A vigorous exfoliation with a kessa glove removes impurities, followed by a purifying ghassoul clay mask." },
                { time: "Flexible", title: "Argan Oil Massage & Relaxation", description: "Conclude your experience with a relaxing argan oil massage, followed by mint tea and pastries in the lounge." }
            ],
            packageCategories: [
                {
                    name: "Hammam Treatments",
                    description: "Choose from a range of authentic Moroccan spa experiences.",
                    packages: [
                        {
                            name: "Traditional Hammam Ritual",
                            price: 45,
                            description: "The complete hammam experience, including steam, black soap, exfoliation, and a 30-minute argan oil massage.",
                            included: ["Steam room access", "Black soap treatment", "Kessa exfoliation", "30-min argan massage", "Tea and pastries"],
                            notIncluded: []
                        },
                        {
                            name: "Royal Hammam Deluxe",
                            price: 75,
                            description: "An extended 90-minute treatment with a full-body clay mask and a 60-minute deep-tissue argan oil massage.",
                            included: ["Extended steam session", "Full-body clay mask", "60-min deep-tissue massage", "Premium pastries"],
                            notIncluded: []
                        }
                    ]
                }
            ],
            minGroupSize: 1,
            maxGroupSize: 6,
            targetAudience: "Perfect for those seeking relaxation, cultural immersion, and a unique wellness experience. Ideal for couples, solo travelers, and anyone looking to rejuvenate mind and body.",
            uniqueSellingPoints: [
                "A 100% authentic traditional hammam experience.",
                "Expert local therapists with extensive training.",
                "Use of premium, natural Moroccan products.",
                "An intimate and private setting that distinguishes it from larger commercial spas."
            ],
            importantNotes: [
                "Book in advance, especially during peak season.",
                "The hammam involves vigorous scrubbing, which may not be suitable for very sensitive skin.",
                "The steam room can be intense for those not accustomed to high temperatures."
            ],
            whatToExpect: "Upon entering the serene world of the riad spa, you'll be enveloped in a sense of calm. The hammam ritual is a journey of purification that begins in a warm, steamy room. After a deep exfoliation, your skin will feel incredibly soft and renewed. The experience is completed with a soothing massage using precious argan oil, leaving you in a state of profound relaxation. You'll emerge feeling refreshed, with a healthy glow that reflects your inner tranquility.",
            authenticMoroccanElements: [
                "The ritual follows a traditional hammam process that has been practiced for centuries.",
                "The spa is located in a historic riad with authentic zellige tilework.",
                "All products used are natural and sourced from Morocco.",
                "The experience concludes with a traditional mint tea ceremony."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The ground-floor spa is accessible to most, but the riad has stairs. Please inform us of any specific mobility needs when booking.",
            seasonalNotes: "Available year-round. The hammam is particularly enjoyable during the cooler months but is a refreshing experience even in the summer."
        }
    ],
    cityRoaming: [
        {
            id: "cr-01",
            title: "Hidden Gems of the Medina: Walking Tour",
            subtitle: "Beyond the Tourist Trail",
            price: 25,
            rating: 0,
            reviews: 0,
            category: "City Roaming",
            image: "/Hidden Gems of the Medina Walking Tour.jpg",
            duration: "3.5 hours",
            features: ["Licensed Guide", "Skip-the-Line", "Architecture", "Small Group", "Local Expert"],
            location: "Marrakech Medina",
            tags: ["City Tours", "Culture", "History"],
            images: [
                "/Hidden Gems of the Medina Walking Tour.jpg",
                "https://images.unsplash.com/photo-1569796018080-05fc8c90e4be?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1597212618419-e6c36ced-ab1b-4af9-a15d-8d5f66150fa9?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Heritage Guides Marrakech",
                image: "/localexpert.jpg",
                bio: "Our team of licensed local historians and cultural guides, born and raised in the Medina, offers an authentic perspective that few tourists ever experience. We share our deep knowledge of Marrakech's hidden corners, passed down through generations.",
                verified: true
            },
            description: "Escape the crowds and discover the real Medina with an expert local guide who knows every hidden courtyard, secret passage, and untold story. This intimate walking tour takes you far beyond the main square into the labyrinthine heart of the old city, where authentic life continues as it has for centuries. You'll explore ancient caravanserais, peek into communal ovens, and admire stunning architecture while learning the fascinating history behind ornate doorways and hidden fountains.",
            included: [
                "A certified local guide with historical expertise",
                "All entrance fees to sites like the Ben Youssef Madrasa",
                "Skip-the-line access where applicable",
                "A traditional mint tea break",
                "Complimentary bottled water"
            ],
            exclusions: ["Lunch (though your guide will offer excellent recommendations)", "Gratuities", "Personal purchases"],
            meetingPoint: "Koutoubia Mosque main entrance (exact meeting point with map provided upon booking)",
            endingPoint: "Jemaa el-Fna square or a location of your choice in the Medina",
            cancellationPolicy: "Free cancellation up to 24 hours before the tour for a full refund.",
            requirements: ["Comfortable walking shoes are essential.", "Modest clothing (shoulders and knees covered) is recommended."],
            ageRestrictions: "Suitable for all ages who are able to walk 3-4 km. Children under 12 must be accompanied by an adult.",
            whatToBring: ["Comfortable walking shoes", "Sun protection (hat, sunscreen)", "A camera", "A water bottle"],
            experienceHighlights: [
                "Explore hidden corners of the Medina that tourists rarely see.",
                "Benefit from skip-the-line access to the Ben Youssef Madrasa.",
                "Visit working artisan workshops and communal ovens.",
                "Enjoy a small group size for a personalized and flexible experience.",
                "Learn authentic history from a Medina-born guide."
            ],
            additionalInfo: "Tours are available daily in the morning and afternoon. The morning tour is recommended for cooler temperatures and better light. Expect to walk 3-4 km. Photography is welcome. Book 1-2 days in advance.",
            itinerary: [
                { time: "09:30", title: "Koutoubia Mosque & Orientation", description: "Meet at the iconic minaret where your guide will introduce the history of the Medina and provide an overview of the tour." },
                { time: "10:00", title: "Secret Passages & Hidden Courtyards", description: "Navigate the narrow alleyways known only to locals, discovering hidden fountains and ornate doorways." },
                { time: "10:45", title: "Artisan Quarter & Communal Oven", description: "Visit a traditional neighborhood oven and explore artisan workshops to see craftsmen at work." },
                { time: "11:30", title: "Ben Youssef Madrasa", description: "Enjoy skip-the-line entrance to this stunning 14th-century Islamic college, admiring its intricate tilework and carvings." },
                { time: "12:15", title: "Historic Caravanserai & Tea Break", description: "Explore an ancient merchant inn and enjoy a traditional mint tea break while your guide shares stories of the trade routes." }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Perfect for culturally curious travelers, history enthusiasts, and photographers seeking an authentic and in-depth experience of Marrakech's old city.",
            uniqueSellingPoints: [
                "Led by local guides with generational knowledge of the Medina.",
                "A small group size allows for a highly personalized and flexible tour.",
                "Access to hidden locations that are not on the typical tourist path.",
                "Includes a traditional tea break in an authentic local setting."
            ],
            importantNotes: [
                "The tour involves a significant amount of walking, so comfortable shoes are a must.",
                "Modest dress is appreciated in the more traditional areas of the Medina.",
                "The morning tour is recommended to avoid the midday heat and crowds."
            ],
            whatToExpect: "Your tour begins at the foot of the Koutoubia Mosque, where you'll meet your friendly local guide. From there, you'll venture into the heart of the Medina, leaving the familiar paths behind. The tour is a journey of discovery, taking you through a maze of hidden alleys, past historic sites, and into the workshops of local artisans. Your guide will share stories and insights that bring the history and culture of the Medina to life. The experience is both educational and engaging, offering a unique glimpse into the soul of Marrakech.",
            authenticMoroccanElements: [
                "The tour is led by guides who were born and raised in the Medina.",
                "Visits to a working communal oven and real artisan workshops.",
                "A traditional mint tea ceremony in an authentic setting.",
                "Stories and insights into the daily life and traditions of the Medina's residents."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The tour is not wheelchair accessible due to the narrow and uneven lanes of the Medina. It requires the ability to walk for 3.5 hours over a distance of 3-4 km.",
            seasonalNotes: "Available year-round. Spring and fall offer the most pleasant weather for walking. Summer can be very hot, making the morning tour the best option."
        },
        {
            id: "cr-02",
            title: "Vintage Sidecar Adventure",
            subtitle: "Explore Marrakech in Retro Style",
            price: 110,
            rating: 0,
            reviews: 0,
            category: "City Roaming",
            image: "/Vintage Sidecar Adventure.jpg",
            duration: "1.5 hours",
            features: ["Private Tour", "Unique Transport", "Photo Ops", "Style", "Hidden Routes"],
            location: "Medina & Palmeraie",
            tags: ["City Tours", "Adventures", "Unique"],
            images: [
                "/Vintage Sidecar Adventure.jpg",
                "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Marrakech Insiders",
                image: "/localexpert.jpg",
                bio: "Our fleet of meticulously maintained vintage Ural sidecars offers a unique way to see the city. Our expert drivers know every hidden corner and photo-worthy spot, combining nostalgia with adventure.",
                verified: true
            },
            description: "Experience Marrakech like never before from the sidecar of a beautifully restored vintage motorcycle. This thrilling adventure takes you off the beaten path to discover hidden gems with the wind in your hair. You'll cruise past ancient city ramparts, zip through the lush Palmeraie palm grove, and explore the Art Deco boulevards of Guéliz. The vintage sidecar provides access to narrow lanes and hidden shortcuts, all while turning heads and inviting smiles from the locals.",
            included: [
                "A private vintage sidecar with an expert driver-guide",
                "Safety helmets and vintage goggles",
                "A 2-hour curated route with photo stops",
                "Hotel pickup and drop-off",
                "Bottled water"
            ],
            exclusions: ["Gratuities", "Personal purchases"],
            meetingPoint: "Your hotel or riad (the driver will arrive at your door)",
            endingPoint: "Your hotel or any central location",
            cancellationPolicy: "Free cancellation up to 24 hours before the ride.",
            requirements: ["Select your preferred time slot (Morning, Afternoon, or Sunset)."],
            ageRestrictions: "Suitable for ages 5 and up. Children must be accompanied by an adult. Maximum of 2 passengers per sidecar.",
            whatToBring: ["Sunglasses", "Sunscreen", "A camera"],
            experienceHighlights: [
                "A uniquely photogenic and Instagram-worthy way to explore the city.",
                "Access to hidden routes that are impossible to reach by car or bus.",
                "An expert driver who shares insider knowledge.",
                "A safe and fun experience suitable for all ages 5 and up."
            ],
            additionalInfo: "The price is per sidecar, which accommodates a maximum of 2 passengers. Routes can be customized. Sunset rides are especially magical for photography. Available daily, year-round.",
            itinerary: [
                { time: "Your Choice", title: "Pickup & Introduction", description: "Your vintage Ural will arrive at your door for a helmet fitting, safety briefing, and a quick photo before you set off." },
                { time: "+15 min", title: "Medina Ramparts", description: "Cruise alongside the ancient pink ramparts of the city, with a photo stop against the backdrop of the Atlas Mountains." },
                { time: "+45 min", title: "Palmeraie Palm Grove", description: "Enter the lush oasis of the Palmeraie, a world of thousands of palms and hidden villas." },
                { time: "+75 min", title: "Guéliz Art Deco Quarter", description: "Explore the French-built boulevards, chic cafés, and modern side of Morocco." }
            ],
            minGroupSize: 1,
            maxGroupSize: 2,
            targetAudience: "Ideal for couples, solo travelers, and friends looking for a unique and stylish way to explore Marrakech. Perfect for photography enthusiasts and lovers of vintage vehicles.",
            uniqueSellingPoints: [
                "A ride in a meticulously restored vintage Ural sidecar is a rare and photogenic experience.",
                "The ability to access routes that are off-limits to other vehicles.",
                "Guaranteed to turn heads and create amazing social media content.",
                "Local drivers provide an insider's perspective."
            ],
            importantNotes: [
                "All sidecars are regularly maintained to ensure safety.",
                "The experience is weather-dependent, though cancellations for rain are rare.",
                "The best times to ride are in the morning for cooler temperatures or at sunset for magical light."
            ],
            whatToExpect: "The distinctive rumble of the vintage Ural announces its arrival. After settling into the gleaming sidecar and donning your vintage goggles, your adventure begins. The open-air ride is exhilarating as you cruise past the city's ramparts and into the lush Palmeraie. Your driver will share stories and point out landmarks, making stops for photos along the way. The experience is a delightful blend of adventure, style, and local culture, leaving you with unforgettable memories and fantastic pictures.",
            authenticMoroccanElements: [
                "The local drivers share authentic perspectives and stories.",
                "The routes take you through real neighborhoods, offering a glimpse into daily life.",
                "The experience provides cultural and historical context, not just photo opportunities."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The sidecar is not wheelchair accessible. Pregnant women are advised to consult a doctor before riding.",
            seasonalNotes: "Available year-round. Spring and fall offer ideal temperatures. Morning and sunset rides are recommended during the summer."
        },
        {
            id: "cr-03",
            title: "Ultimate Street Food Tasting Trail",
            subtitle: "Eat Like a Local",
            price: 35,
            rating: 0,
            reviews: 0,
            category: "City Roaming",
            image: "/Ultimate Street Food Tasting Trail.jpg",
            duration: "3 hours",
            features: ["10+ Tastings", "Small Group", "Dinner Substitute", "Local Guide", "Evening Tour"],
            location: "Jemaa el-Fna & Medina",
            tags: ["City Tours", "Food & Drink", "Culture"],
            images: [
                "/Ultimate Street Food Tasting Trail.jpg",
                "https://images.unsplash.com/photo-1536766768598-e09213fdcfaa?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Taste of Morocco Food Tours",
                image: "/localexpert.jpg",
                bio: "Our passionate local food experts grew up eating at these very stalls. We share our favorite food memories, introduce you to our vendor friends, and help you navigate the city's incredible street food scene like a true local.",
                verified: true
            },
            description: "Forget the restaurants and discover authentic Moroccan cuisine where the locals truly eat. This evening food adventure takes you through the aromatic chaos of Jemaa el-Fna square and into hidden Medina alleyways to taste over 10 traditional dishes. You'll sample slow-roasted mechoui lamb, try the famous snail soup, and savor a variety of other local delicacies. Your foodie guide will share the history behind each dish and introduce you to the friendly vendors. This is more than just a meal—it's a delicious cultural immersion.",
            included: [
                "An expert local food guide",
                "Over 10 traditional food tastings (equivalent to a full dinner)",
                "Traditional mint tea",
                "Bottled water"
            ],
            exclusions: ["Hotel pickup (the meeting point is central and easy to find)", "Gratuities for the guide", "Additional food beyond the included tastings"],
            meetingPoint: "Jemaa el-Fna Square main entrance (exact meeting point with map sent upon booking)",
            endingPoint: "A rooftop overlooking Jemaa el-Fna or a nearby location of your choice",
            cancellationPolicy: "Free cancellation up to 24 hours before the tour for a full refund.",
            requirements: ["Come with an adventurous appetite—this is a substantial amount of food.", "Inform us of any dietary restrictions in advance."],
            ageRestrictions: "Suitable for all ages. Children are welcome and kid-friendly tasting options are available.",
            whatToBring: ["An empty stomach!", "Comfortable walking shoes", "A camera", "Hand sanitizer (though it will be provided if needed)"],
            experienceHighlights: [
                "Taste over 10 authentic Moroccan dishes at local stalls.",
                "Eat where the locals eat, not in tourist restaurants.",
                "An expert foodie guide shares the history and stories behind the food.",
                "Experience the vibrant evening energy of the Jemaa el-Fna food stalls."
            ],
            additionalInfo: "Tours run nightly at 6:00 PM. Arrive hungry, as the tastings are equivalent to a full dinner plus dessert. Vegetarian options are available with advance notice. We take food hygiene seriously and only visit trusted stalls.",
            itinerary: [
                { time: "18:00", title: "Jemaa el-Fna Arrival & Olive Tasting", description: "Meet at the iconic square as the evening food stalls are setting up. Your adventure begins with a tasting of incredible marinated olives and preserved lemons." },
                { time: "18:30", title: "Fresh Juice & Dried Fruit Stall", description: "Visit an iconic orange juice stall and sample traditional dried fruits and nuts." },
                { time: "19:00", title: "Mechoui Alley—Roasted Lamb", description: "Enter the famous underground oven alley to watch as tender mechoui lamb is pulled from ancient earth ovens and taste the succulent meat." },
                { time: "19:30", title: "Snail Soup & Harira", description: "A controversial but traditional tasting of snail soup (optional), plus a warming harira soup with dates." },
                { time: "20:30", title: "Sweet Finale & Rooftop Tea", description: "Taste sweet chebakia cookies and other pastries before climbing to a peaceful rooftop overlooking the square for a final mint tea." }
            ],
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "A must for adventurous eaters, culture enthusiasts, and anyone who believes the best way to know a place is through its food. Ideal for solo travelers, couples, and small groups.",
            uniqueSellingPoints: [
                "An authentic experience at local stalls where residents of Marrakech dine.",
                "Over 10 tastings that amount to a full dinner, offering incredible value.",
                "A local foodie guide with personal relationships with the vendors.",
                "The evening tour captures the magical energy of Jemaa el-Fna."
            ],
            importantNotes: [
                "Arrive very hungry—this is a lot of food!",
                "An adventurous eating spirit is helpful, as you'll be visiting authentic local stalls.",
                "Vegetarian options are available but please inform us when booking."
            ],
            whatToExpect: "Your tour begins in the golden hour at Jemaa el-Fna, where the air is filled with the tantalizing aromas of street food. Your guide will lead you to the best stalls, introducing you to a variety of Moroccan delicacies, from savory tagine to sweet pastries. You'll eat alongside locals, soaking in the vibrant atmosphere of the square at night. The tour concludes on a rooftop terrace, where you can enjoy a final mint tea while taking in the panoramic views of the bustling square below.",
            authenticMoroccanElements: [
                "The tour is led by a local foodie guide who grew up with these dishes.",
                "All food is from authentic local vendors, not tourist-oriented restaurants.",
                "The recipes and cooking methods are traditional and have been passed down for generations.",
                "The communal eating experience reflects Moroccan hospitality."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The tour is wheelchair accessible with advance notice, as the route can be modified. It requires walking approximately 2 km over 3 hours with frequent stops.",
            seasonalNotes: "Available year-round. The evening temperatures are pleasant throughout the year. Book in advance, especially during peak season."
        },
        {
            id: "cr-04",
            title: "Yves Saint Laurent & Majorelle Garden VIP",
            subtitle: "Skip-the-Line Art & Fashion Experience",
            price: 40,
            rating: 0,
            reviews: 0,
            category: "City Roaming",
            image: "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
            duration: "3 hours",
            features: ["Botanic Garden", "Fashion Museum", "Skip-the-Line", "Transport Included", "Guided Tour"],
            location: "Guéliz District",
            tags: ["City Tours", "Culture", "Art"],
            images: [
                "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
                "https://images.unsplash.com/photo-1591825944056-4cc375fb060f?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "City Highlights Marrakech",
                image: "/localexpert.jpg",
                bio: "We are specialized cultural tour operators focusing on Marrakech's art, design, and fashion heritage. Our expert guides bring the stories of Majorelle Garden and YSL to life and provide skip-the-line access.",
                verified: true
            },
            description: "Immerse yourself in two of Marrakech's most iconic attractions with VIP skip-the-line access. This curated half-day experience combines the breathtaking beauty of Majorelle Garden with the stunning Yves Saint Laurent Museum. Your guide will share the fascinating history of Jacques Majorelle, YSL's love affair with Morocco, and the garden's restoration. At the museum, you'll view rotating exhibitions of Saint Laurent's Moroccan-influenced designs, sketches, and personal items.",
            included: [
                "Private air-conditioned transport from and to your hotel",
                "Skip-the-line entrance tickets to both Majorelle Garden and the YSL Museum",
                "An expert guide with knowledge of art and fashion history",
                "Bottled water"
            ],
            exclusions: ["Lunch (your guide can provide recommendations)", "Gratuities", "Optional entrance to the Berber Museum"],
            meetingPoint: "Hotel pickup from your accommodation in Marrakech",
            endingPoint: "Return to your hotel or an optional drop-off at a nearby restaurant or shopping area",
            cancellationPolicy: "Free cancellation up to 48 hours before the visit. A 50% refund is offered for cancellations within 48 hours.",
            requirements: ["Book at least 48 hours in advance to secure tickets.", "Specify your preferred morning time slot when booking."],
            ageRestrictions: "Suitable for all ages. Children under 12 have free entrance.",
            whatToBring: ["A camera (photography is allowed in the gardens but restricted in the museum)", "Comfortable walking shoes", "Sun hat and sunscreen"],
            experienceHighlights: [
                "Skip-the-line access to both Majorelle Garden and the YSL Museum, saving you hours of waiting.",
                "Explore the iconic electric-blue Majorelle Garden, YSL's personal sanctuary.",
                "View YSL's haute couture and Moroccan-inspired fashion at a world-class museum.",
                "Convenient hotel pickup and drop-off for a stress-free experience."
            ],
            additionalInfo: "Morning tours are recommended for the best light and smaller crowds. The tour is wheelchair accessible. Book 2-3 days in advance for your preferred time slot, and 5-7 days during peak season.",
            itinerary: [
                { time: "09:00", title: "Hotel Pickup & Transfer", description: "A private vehicle will pick you up from your accommodation for a scenic drive to the Guéliz district, while your guide provides an overview of YSL's connection to Morocco." },
                { time: "09:30", title: "Majorelle Garden—Skip-the-Line Entry", description: "Bypass the long queues and enter the stunning garden oasis. Wander through bamboo groves and cactus gardens, all framed by the iconic 'Majorelle Blue'." },
                { time: "10:45", title: "Yves Saint Laurent Museum", description: "Walk to the architecturally stunning museum to explore rotating exhibitions of YSL's haute couture, sketches, and personal items, with context from your guide." },
                { time: "11:45", title: "Return Transfer & Recommendations", description: "Return to your vehicle and receive recommendations for nearby restaurants for lunch. You can be dropped off at a location of your choice or returned to your hotel." }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Perfect for art and design enthusiasts, fashion lovers, and photographers. Ideal for anyone who values efficiency and wants a curated cultural experience.",
            uniqueSellingPoints: [
                "Skip-the-line tickets save you valuable time.",
                "Convenient hotel pickup and drop-off eliminate logistical stress.",
                "An expert guide provides cultural and historical context.",
                "A perfect pairing of a natural oasis and a sophisticated museum."
            ],
            importantNotes: [
                "Book at least 48 hours in advance to reserve your skip-the-line tickets.",
                "Photography is restricted inside the YSL Museum.",
                "Morning tours are recommended for the best experience."
            ],
            whatToExpect: "Your day begins with a convenient hotel pickup. At Majorelle Garden, you'll bypass the long queues and step into a world of vibrant color and exotic plants. The experience is a visual feast, with the famous 'Majorelle Blue' providing a stunning backdrop for your photos. At the YSL Museum, you'll gain insight into the life and work of the legendary designer and his deep connection to Marrakech. The tour is a seamless and enriching experience, leaving you with a deeper appreciation for the art and culture of the city.",
            authenticMoroccanElements: [
                "The Majorelle Garden represents Morocco's influence on international art.",
                "The YSL Museum showcases the country's profound impact on a legendary fashion designer.",
                "The optional Berber Museum visit offers a look at authentic North African indigenous culture."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The tour is fully wheelchair accessible. Please contact us to arrange any specific accessibility needs.",
            seasonalNotes: "Available year-round. Spring is a particularly beautiful time to visit, with the gardens in full bloom. Morning tours are essential during the hot summer months."
        }
    ],
    cityTrips: [
        {
            id: "ct-01",
            title: "Agafay Desert: Sunset, Camel & Dinner Show",
            subtitle: "Magical Evening in Morocco's Stone Desert",
            price: 55,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
            duration: "6 hours",
            features: ["Stone Desert", "Live Music", "Fire Eater", "Traditional Dinner", "Camel Ride"],
            location: "Agafay Desert (40km from Marrakech)",
            tags: ["Adventures", "Excursions", "Dinner Show"],
            images: [
                "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
                "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Desert Magic Tours",
                image: "/localexpert.jpg",
                bio: "Specializing in Agafay Desert experiences, we create magical evenings that combine adventure, authentic Moroccan hospitality, and spectacular natural beauty, just a short drive from Marrakech.",
                verified: true
            },
            description: "Experience the magic of the desert without the long journey to the Sahara. Just 40 minutes from Marrakech, the Agafay Desert offers an unforgettable evening of adventure, culture, and natural beauty. Your afternoon begins with a scenic drive to the desert, where you'll enjoy a sunset camel ride across the stunning rocky landscape. As night falls, you'll settle into a traditional Berber camp for a feast of Moroccan cuisine, complete with live music, dancers, and a thrilling fire-eating performance.",
            included: [
                "Round-trip transport from your accommodation",
                "A 30-minute sunset camel ride",
                "A traditional 3-course Moroccan dinner",
                "Live entertainment, including Gnawa music, dancers, and a fire show",
                "Welcome mint tea and bottled water"
            ],
            exclusions: ["Alcoholic beverages (available for purchase)", "Gratuities for the guide and staff", "Optional quad biking"],
            meetingPoint: "Hotel/riad pickup (anywhere in Marrakech)",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the experience for a full refund.",
            requirements: ["Specify your pickup location when booking.", "Inform us of any dietary restrictions or allergies."],
            ageRestrictions: "Suitable for all ages. Camel rides are suitable for children 5 and up with adult supervision.",
            whatToBring: ["A warm jacket (the desert gets cold after sunset)", "Comfortable shoes", "A camera", "Sunglasses for the sunset"],
            experienceHighlights: [
                "A camel ride at sunset across the stunning Agafay Stone Desert.",
                "A traditional 3-course Moroccan feast under the stars.",
                "Live entertainment, including Gnawa music, Berber dancers, and a fire-eating performance.",
                "A romantic, starlit setting with a campfire and traditional tents."
            ],
            additionalInfo: "The Agafay Desert is a rocky landscape, not sand dunes. Vegetarian and vegan meals are available with advance notice. Bring warm layers as the temperature drops significantly after sunset.",
            itinerary: [
                { time: "16:00", title: "Pickup & Scenic Drive", description: "Your driver will pick you up from your accommodation for a 40-minute scenic drive to the Agafay Desert." },
                { time: "17:00", title: "Arrival & Welcome Tea", description: "Arrive at the desert camp and enjoy a welcome mint tea as you meet your camel." },
                { time: "17:30", title: "Sunset Camel Trek", description: "Set off on a camel trek across the rocky desert landscape as the sun descends, painting the sky in brilliant colors." },
                { time: "19:00", title: "Traditional Dinner Begins", description: "Settle into a traditional Berber tent or around the campfire for a freshly prepared Moroccan feast." },
                { time: "20:00", title: "Live Entertainment & Dessert", description: "As dinner concludes, the entertainment begins with hypnotic Gnawa music, colorful Berber dancers, and a thrilling fire show." }
            ],
            minGroupSize: 2,
            maxGroupSize: 25,
            targetAudience: "Ideal for couples, families, and anyone wanting a desert experience without the long journey to the Sahara. Perfect for photographers and those who appreciate authentic cultural performances.",
            uniqueSellingPoints: [
                "A desert experience just 40 minutes from Marrakech.",
                "A sunset camel ride across a unique rocky landscape.",
                "A traditional Moroccan feast freshly prepared at the desert camp.",
                "Live entertainment that creates an unforgettable atmosphere."
            ],
            importantNotes: [
                "Bring warm layers, as the desert cools down dramatically after sunset.",
                "Agafay is a rocky desert, not a sand dune desert like the Sahara.",
                "Vegetarian and vegan options are available if you inform us at the time of booking."
            ],
            whatToExpect: "Your adventure begins with a scenic drive to the Agafay Desert. Upon arrival, you'll be greeted with traditional mint tea before embarking on a memorable sunset camel ride. The evening continues with a delicious Moroccan dinner served in a Berber tent, accompanied by live music and entertainment under a canopy of stars. The experience is a perfect blend of adventure, culture, and romance, offering a magical escape from the city.",
            authenticMoroccanElements: [
                "Traditional Berber desert camp hospitality.",
                "A freshly prepared traditional Moroccan feast, including tagine and couscous.",
                "Live Gnawa music, an ancient Moroccan spiritual music tradition.",
                "A camel trek, reflecting traditional Moroccan desert transportation."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Spanish", "Arabic"],
            accessibility: "The experience is not wheelchair accessible due to the desert terrain and camel mounting. Assistance will be provided for mounting and dismounting the camels.",
            seasonalNotes: "Available year-round. Spring and fall offer the most pleasant temperatures. Winter evenings can be quite cold, so bring very warm layers."
        },
        {
            id: "ct-02",
            title: "Atlas Mountains & Ourika Valley Day Trip",
            subtitle: "Waterfalls, Berber Villages & Mountain Air",
            price: 30,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Atlas Mountains & Ourika Valley Day Trip.jpg",
            duration: "Full Day (8 hours)",
            features: ["Waterfalls", "Berber House Visit", "Nature", "Mountain Views", "Local Guide"],
            location: "Ourika Valley, High Atlas Mountains",
            tags: ["Adventures", "Excursions", "Nature"],
            images: [
                "/Atlas Mountains & Ourika Valley Day Trip.jpg",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Atlas Trekking Adventures",
                image: "/localexpert.jpg",
                bio: "Our specialized mountain guides have a deep knowledge of the Atlas villages and trails. We combine scenic beauty with authentic cultural encounters to ensure an unforgettable day trip from Marrakech.",
                verified: true
            },
            description: "Escape the heat and bustle of Marrakech for a refreshing full-day journey into the stunning High Atlas Mountains. The Ourika Valley offers spectacular scenery, cascading waterfalls, and traditional Berber villages. Your scenic drive winds through ever-changing landscapes, with a stop at a traditional Berber house for an authentic cultural experience. A moderate hike with a mountain guide will lead you to the first of seven waterfalls, a stunning cascade into an emerald pool. An optional riverside lunch of fresh tagine completes this perfect mountain day.",
            included: [
                "Round-trip transport in a comfortable vehicle",
                "An experienced mountain guide for the waterfall hike",
                "A visit to a traditional Berber house with mint tea",
                "Bottled water"
            ],
            exclusions: ["Lunch (available at riverside restaurants for $5-10)", "Gratuities for the guide and driver", "Optional hikes to additional waterfalls"],
            meetingPoint: "Hotel/riad pickup (anywhere in Marrakech)",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the trip for a full refund.",
            requirements: ["A moderate level of fitness is required for the waterfall hike.", "Specify your pickup location when booking."],
            ageRestrictions: "Suitable for ages 8 and up. The waterfall hike may be challenging for younger children.",
            whatToBring: ["Sturdy hiking shoes or sneakers are essential.", "Sunscreen and a sun hat", "A light jacket", "A camera", "Cash for lunch"],
            experienceHighlights: [
                "A scenic drive through the spectacular landscapes of the High Atlas Mountains.",
                "A guided hike to the stunning Setti Fatma waterfalls.",
                "An authentic visit to a traditional Berber home for tea and cultural insights.",
                "An escape from the heat of Marrakech to the cool, fresh mountain air."
            ],
            additionalInfo: "The waterfall hike is of moderate difficulty and takes about 45 minutes uphill over rocks. Good shoes are essential. Lunch is not included but is available at riverside restaurants for a reasonable price.",
            itinerary: [
                { time: "09:00", title: "Pickup & Mountain Drive Begins", description: "Your driver will pick you up for a scenic drive through the foothills of the Atlas Mountains, with your guide sharing information about Berber culture along the way." },
                { time: "10:30", title: "Traditional Berber House Visit", description: "Stop at an authentic mountain home for a warm welcome with mint tea and homemade bread, and learn about traditional Berber life." },
                { time: "11:30", title: "Arrival at Setti Fatma & Hike Begins", description: "Arrive at the village of Setti Fatma, the gateway to the waterfalls, and begin your moderate hike alongside the river." },
                { time: "12:30", title: "Waterfalls & Free Time", description: "Reach the spectacular first waterfall, where you can take photos and even splash in the cool mountain water." },
                { time: "13:30", title: "Riverside Lunch (Optional)", description: "Enjoy a traditional tagine at one of the many riverside restaurants, with the sound of the rushing water as your soundtrack." }
            ],
            minGroupSize: 2,
            maxGroupSize: 16,
            targetAudience: "Perfect for nature lovers, active travelers, and culture enthusiasts. Ideal for families with older children and anyone seeking a refreshing break from the city.",
            uniqueSellingPoints: [
                "Stunning High Atlas Mountain scenery.",
                "An invigorating waterfall hike with a spectacular payoff.",
                "An authentic Berber home visit for genuine cultural insights.",
                "A welcome escape from the heat of Marrakech."
            ],
            importantNotes: [
                "Hiking shoes are essential as the trail can be rocky and slippery.",
                "A moderate level of fitness is required for the waterfall hike.",
                "The mountains are significantly cooler than Marrakech, so bring a light jacket."
            ],
            whatToExpect: "Your day begins with a scenic drive into the High Atlas Mountains. At a traditional Berber house, you'll be welcomed with warm hospitality and fresh mint tea. The highlight of the trip is a guided hike to the beautiful Setti Fatma waterfalls. The day is a perfect blend of natural beauty, outdoor adventure, and cultural immersion, offering a refreshing contrast to the bustling city of Marrakech.",
            authenticMoroccanElements: [
                "A visit to a traditional Berber house offers a glimpse into authentic mountain life.",
                "The local mountain guide is from the Setti Fatma village and has generational knowledge of the trails.",
                "The experience of a mint tea ceremony and home-baked bread reflects genuine Berber hospitality."
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Berber (Tamazight)"],
            accessibility: "The tour is not wheelchair accessible due to the mountain terrain and hiking. It is not suitable for those with mobility limitations.",
            seasonalNotes: "Available year-round. Spring is the best time to visit for full waterfalls and pleasant temperatures. The summer months offer a cool escape from the city's heat."
        },
        {
            id: "ct-03",
            title: "Essaouira Coastal Escape",
            subtitle: "Windswept Medina by the Sea",
            price: 35,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Essaouira Coastal Escape.jpg",
            duration: "Full Day (10 hours)",
            features: ["Beach", "Seafood", "Game of Thrones Site", "Unesco Heritage", "Portuguese Fortifications"],
            location: "Essaouira, Atlantic Coast",
            tags: ["Excursions", "Beach", "Culture"],
            images: [
                "/Essaouira Coastal Escape.jpg",
                "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1601024445121-e02b51a552a1?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Coastal Vibes Morocco",
                image: "/localexpert.jpg",
                bio: "We specialize in coastal day trips from Marrakech, with a deep knowledge of Essaouira's charming medina, the best seafood spots, and hidden beaches. Our relaxed approach gives you the freedom to explore at your own pace.",
                verified: true
            },
            description: "Trade the heat of Marrakech for the fresh Atlantic breezes of enchanting Essaouira. This UNESCO World Heritage town captivates with its windswept beaches, white-and-blue medina, and relaxed bohemian atmosphere. You'll have approximately 5 hours to explore at your own pace: stroll the historic ramparts (a Game of Thrones filming location), browse art galleries, and feast on incredibly fresh grilled fish straight from the port. The scenic 3-hour drive includes a stop at a women's argan oil cooperative.",
            included: [
                "Round-trip transport in a comfortable, air-conditioned vehicle",
                "A stop at a women's argan oil cooperative with a demonstration",
                "Approximately 5 hours of free time in Essaouira to explore independently",
                "Bottled water during the drive"
            ],
            exclusions: ["Lunch (fresh seafood is available for $8-15 per person)", "Entrance fees to ramparts and museums (minimal, around $1-2)", "Gratuities for the driver"],
            meetingPoint: "Hotel/riad pickup (anywhere in Marrakech)",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the trip for a full refund.",
            requirements: ["Specify your pickup location when booking."],
            ageRestrictions: "Suitable for all ages. A family-friendly experience with a beach and a safe medina.",
            whatToBring: ["A windbreaker or light jacket (Essaouira is known as the 'windy city')", "Comfortable walking shoes", "Swimwear (the water can be cold)", "Sunscreen and sunglasses", "A camera", "Cash for lunch and shopping"],
            experienceHighlights: [
                "Explore a UNESCO World Heritage medina with Portuguese fortifications.",
                "Walk the dramatic ramparts overlooking the Atlantic, a 'Game of Thrones' filming location.",
                "Enjoy incredibly fresh seafood grilled at the harbor.",
                "A relaxed beach town atmosphere that's a perfect escape from the chaos of Marrakech."
            ],
            additionalInfo: "The drive to Essaouira is approximately 3 hours each way. This is not a guided walking tour, but rather transportation with free time to explore independently. Essaouira is safe, easy to navigate, and full of pleasant discoveries.",
            itinerary: [
                { time: "08:00", title: "Pickup & Coastal Drive Begins", description: "Your driver will pick you up for the scenic 3-hour drive to the Atlantic coast, passing through rolling hills and argan tree groves." },
                { time: "10:00", title: "Argan Oil Cooperative Stop", description: "Stop at a women's cooperative to see a demonstration of traditional argan oil production and learn about its many uses." },
                { time: "11:00", title: "Arrival in Essaouira—Free Exploration", description: "Arrive in Essaouira and enjoy approximately 5 hours of free time to explore the medina, ramparts, and harbor at your own pace." },
                { time: "13:00", title: "Suggested: Seafood Lunch at the Port", description: "Head to the bustling fishing port to choose your fresh fish, which will be grilled for you on the spot—a quintessential Essaouira experience." },
                { time: "16:00", title: "Return Journey to Marrakech", description: "Meet your driver for the scenic return drive to Marrakech, arriving at your accommodation in the evening." }
            ],
            minGroupSize: 2,
            maxGroupSize: 17,
            targetAudience: "Perfect for beach lovers, seafood enthusiasts, and art and craft appreciators. Ideal for 'Game of Thrones' fans and anyone seeking a relaxed break from the intensity of Marrakech.",
            uniqueSellingPoints: [
                "A UNESCO World Heritage fortified medina with a rich Portuguese history.",
                "A dramatically different atmosphere from Marrakech—coastal, relaxed, and artistic.",
                "Incredibly fresh seafood grilled at the port is a highlight for food lovers.",
                "A famous 'Game of Thrones' filming location."
            ],
            importantNotes: [
                "Essaouira is windy year-round, so bring a windbreaker or jacket.",
                "This is an independent exploration, not a guided walking tour.",
                "The Atlantic water is cold, even in the summer."
            ],
            whatToExpect: "Your day trip to Essaouira begins with a scenic drive through the Moroccan countryside. Upon arrival, you'll be charmed by the city's blue and white medina, historic ramparts, and bustling fishing port. You'll have ample time to explore on your own, whether you choose to browse the art galleries, relax on the beach, or indulge in the freshest seafood imaginable. The laid-back, artistic vibe of Essaouira offers a perfect contrast to Marrakech and a refreshing seaside escape.",
            authenticMoroccanElements: [
                "The Portuguese colonial history is reflected in the fortifications and architecture.",
                "The traditional production of argan oil by women's cooperatives.",
                "The working fishing port, which offers a glimpse into authentic Moroccan coastal life.",
                "The fresh seafood, grilled using traditional methods."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The tour is mostly accessible, though the ramparts involve stairs. Wheelchair users can enjoy much of Essaouira with some limitations.",
            seasonalNotes: "Available year-round. Spring and fall offer pleasant temperatures. Summer is the busiest season, but the wind keeps it cooler than Marrakech."
        },
        {
            id: "ct-04",
            title: "Ouzoud Waterfalls: Nature Hike & Boat Ride",
            subtitle: "North Africa's Highest Waterfalls",
            price: 30,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
            duration: "Full Day (9 hours)",
            features: ["Highest Falls in North Africa", "Wild Barbary Monkeys", "Boat Ride", "Olive Groves", "Swimming"],
            location: "Ouzoud, Middle Atlas Mountains (150km from Marrakech)",
            tags: ["Adventures", "Excursions", "Nature"],
            images: [
                "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
                "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Nature Tours Morocco",
                image: "/localexpert.jpg",
                bio: "We specialize in excursions to Morocco's natural wonders, combining scenic beauty with wildlife encounters and outdoor adventure to ensure a memorable experience.",
                verified: true
            },
            description: "Escape to one of Morocco's most spectacular natural wonders: the Ouzoud Waterfalls, the highest in North Africa. This full-day adventure takes you deep into the Middle Atlas Mountains to witness thundering cascades, lush greenery, and playful wild monkeys. You'll descend through ancient olive groves on a well-maintained trail, spotting wild Barbary macaques along the way. At the base of the falls, you can take a traditional boat ride to get up close to the cascades and even swim in the natural pools. A riverside lunch at a terrace restaurant with waterfall views completes this perfect day in nature.",
            included: [
                "Round-trip transport in a comfortable vehicle",
                "An experienced mountain guide for the waterfall trails",
                "All trail entrance fees",
                "An optional traditional boat ride to the base of the waterfall",
                "Bottled water"
            ],
            exclusions: ["Lunch (available at riverside restaurants for $5-10)", "Gratuities for the guide and driver", "Peanuts for the monkeys"],
            meetingPoint: "Hotel/riad pickup (anywhere in Marrakech)",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the trip for a full refund.",
            requirements: ["A moderate level of fitness is required for hiking the trails.", "Specify your pickup location when booking."],
            ageRestrictions: "Suitable for ages 6 and up. The trail has stairs and can be slippery, so supervision is required for children.",
            whatToBring: ["Sturdy walking shoes (the trail can be slippery)", "Swimwear and a towel if you want to swim", "A change of clothes", "Sunscreen and a hat", "A camera", "Cash for lunch"],
            experienceHighlights: [
                "Witness North Africa's highest waterfalls in a spectacular natural setting.",
                "Encounter wild Barbary macaques in their natural habitat.",
                "Take an optional traditional boat ride to the thundering base of the waterfall.",
                "Swim in refreshing natural pools.",
                "Hike through ancient olive groves with stunning valley views."
            ],
            additionalInfo: "The trail involves stairs and can be slippery, so good shoes are essential. The wild monkeys are habituated to people but should be treated as wild animals. The boat ride to the base of the waterfall is optional but included in the price.",
            itinerary: [
                { time: "08:00", title: "Pickup & Scenic Mountain Drive", description: "Your driver will pick you up for the 2.5-hour drive to Ouzoud, passing through olive groves and Berber villages." },
                { time: "10:30", title: "Arrival & Trail Descent Begins", description: "Arrive at Ouzoud and meet your mountain guide to begin the descent through ancient olive groves, where you'll encounter wild Barbary macaques." },
                { time: "11:30", title: "Waterfall Base & Boat Ride", description: "Reach the spectacular base of the falls, where you can take a boat ride to get up close to the cascades." },
                { time: "12:30", title: "Swimming & Exploration", description: "Enjoy free time to swim in the natural pools, explore different viewpoints, and photograph the falls." },
                { time: "13:30", title: "Riverside Lunch", description: "Dine at one of the many terrace restaurants offering traditional Moroccan meals with waterfall views." }
            ],
            minGroupSize: 2,
            maxGroupSize: 17,
            targetAudience: "Perfect for nature lovers, wildlife enthusiasts, and active travelers. Ideal for families with children old enough for moderate hiking and anyone craving a green, water-rich environment.",
            uniqueSellingPoints: [
                "North Africa's highest waterfalls—a truly spectacular natural wonder.",
                "A unique wildlife experience with wild Barbary macaques.",
                "A traditional boat ride that gets you up close to the thundering cascades.",
                "The opportunity to swim in natural pools beneath the waterfalls."
            ],
            importantNotes: [
                "The trail involves stairs and can be very slippery, so sturdy shoes are essential.",
                "Prepare to get wet from the spray of the waterfall.",
                "The wild monkeys are habituated but should not be touched."
            ],
            whatToExpect: "Your day trip to Ouzoud begins with a scenic drive into the Middle Atlas Mountains. Upon arrival, you'll be greeted by the roar of the falls and the sight of playful Barbary macaques. A guided hike will take you down to the base of the falls, where you can enjoy a boat ride and a swim. The experience is a refreshing and exhilarating escape into one of Morocco's most beautiful natural landscapes.",
            authenticMoroccanElements: [
                "The ancient olive groves, which reflect traditional Moroccan agriculture.",
                "The wild Barbary macaques, a native Moroccan species.",
                "The traditional boat rides, which use methods that have been unchanged for generations.",
                "The journey through working Berber villages, which shows authentic rural life."
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Berber (Tamazight)"],
            accessibility: "The tour is not wheelchair accessible due to stairs and uneven terrain. It is not suitable for those with mobility limitations.",
            seasonalNotes: "Available year-round. Spring offers the most spectacular water flow. Summer is a popular time to visit for a refreshing swim."
        },
        {
            id: "ct-05",
            title: "Quad Biking Adrenaline Rush",
            subtitle: "Off-Road Desert Adventure",
            price: 45,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Quad Biking Adrenaline Rush.jpg",
            duration: "3 hours (2 hours riding)",
            features: ["Off-Road Adventure", "Safety Gear Included", "Tea Break", "Palm Grove or Desert", "All Skill Levels"],
            location: "Palmeraie Palm Grove or Agafay Desert",
            tags: ["Adventures", "Adrenaline"],
            images: [
                "/Quad Biking Adrenaline Rush.jpg",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Quad Masters Marrakech",
                image: "/localexpert.jpg",
                bio: "As Morocco's premier quad biking operator, we have over 10 years of experience in providing safe and thrilling desert adventures. Our well-maintained fleet and experienced guides ensure an adrenaline-pumping experience for all skill levels.",
                verified: true
            },
            description: "Unleash your inner adventurer on a powerful quad bike. This high-octane experience takes you off-road through either the lush Palmeraie palm grove or the dramatic rocky Agafay Desert. After a comprehensive safety briefing, you'll mount your quad and follow your experienced guide through challenging terrain. You'll zoom through palm groves, race across open desert plains, and navigate sandy tracks and rocky paths. A halfway break for traditional mint tea at a Berber village provides a moment to catch your breath and soak in the culture.",
            included: [
                "Round-trip hotel transfer",
                "A well-maintained, automatic quad bike",
                "All necessary safety equipment, including a helmet, goggles, and protective gear",
                "An experienced guide",
                "A 2-hour quad biking experience",
                "A traditional mint tea break at a Berber village"
            ],
            exclusions: ["Gratuities for the guide", "Personal insurance", "Photos and videos (though your guide can take them on your phone)"],
            meetingPoint: "Hotel/riad pickup",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the experience for a full refund.",
            requirements: ["You must be 16 or older to drive solo. Children ages 6-15 can ride as passengers with an adult.", "No prior quad biking experience is necessary."],
            ageRestrictions: "The minimum age to drive is 16. Children ages 6-15 can ride as passengers with an adult.",
            whatToBring: ["Closed-toe shoes are essential.", "Long pants are recommended.", "Sunglasses", "Sunscreen", "A bandana or scarf for dust protection"],
            experienceHighlights: [
                "Two hours of thrilling off-road quad biking through stunning landscapes.",
                "Your choice of terrain: the lush Palmeraie palm grove or the dramatic Agafay Desert.",
                "No experience is necessary; automatic quads and a full safety briefing are provided.",
                "A traditional mint tea break in an authentic Berber village."
            ],
            additionalInfo: "Morning departures are recommended for cooler temperatures. Expect to get dusty, so wear clothes you don't mind getting dirty. Pregnant women should not participate.",
            itinerary: [
                { time: "Departure Time", title: "Pickup & Transfer to Quad Base", description: "A vehicle will pick you up from your accommodation for a short transfer to the quad biking base, where you'll meet your guide." },
                { time: "+20 min", title: "Safety Briefing & Equipment", description: "Receive a comprehensive safety briefing and get fitted with your helmet, goggles, and protective gear before a practice session." },
                { time: "+30 min", title: "Off-Road Adventure Begins!", description: "Mount your quad and follow your guide into the landscape for an adrenaline-pumping ride through palm groves or across desert plains." },
                { time: "+90 min", title: "Mint Tea Break at Berber Village", description: "Pause at a traditional Berber village for a welcome mint tea and a chance to chat with the locals." },
                { time: "+120 min", title: "Second Half & Return Ride", description: "Get back on your quad for more off-road thrills, including open stretches where you can accelerate and challenging sections to test your skills." }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Perfect for adrenaline junkies, adventure travelers, and groups of friends. Ideal for families with teenagers and anyone who loves speed, dust, and dramatic landscapes.",
            uniqueSellingPoints: [
                "A pure adrenaline rush with 2 hours of off-road quad biking.",
                "No experience is necessary, with automatic quads and full instruction.",
                "Your choice of two stunning and distinct terrains.",
                "A traditional tea break that adds a cultural element to the adventure."
            ],
            importantNotes: [
                "You must be 16 or older to drive a quad solo.",
                "Expect to get very dusty, so dress accordingly.",
                "Closed-toe shoes are mandatory for safety."
            ],
            whatToExpect: "Your quad biking adventure begins with a convenient hotel pickup and a short transfer to the base. After a safety briefing and practice run, you'll be off, following your guide through a stunning Moroccan landscape. The ride is a thrilling mix of speed and scenery, with a cultural break for mint tea at a Berber village. You'll return dusty and exhilarated, with plenty of stories to tell.",
            authenticMoroccanElements: [
                "A ride through authentic Moroccan landscapes, whether palm groves or desert plains.",
                "A traditional mint tea ceremony at a Berber village, reflecting genuine hospitality.",
                "Interaction with local villagers during the tea break.",
                "Routes that pass through working agricultural land and real villages."
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic"],
            accessibility: "The experience is not wheelchair accessible. It requires the ability to mount and dismount a quad and maintain balance while riding.",
            seasonalNotes: "Available year-round. Morning departures are recommended during the hot summer months. Sunset rides are particularly magical in the cooler months."
        },
        {
            id: "ct-06",
            title: "Hot Air Balloon: Sunrise Over Atlas",
            subtitle: "Once-in-a-Lifetime Sky Experience",
            price: 160,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Hot Air Balloon Sunrise Over Atlas.jpg",
            duration: "4 hours",
            features: ["Bucket List", "Berber Breakfast", "Flight Certificate", "Sunrise", "Atlas Views"],
            location: "Marrakech Sky & Desert",
            tags: ["Adventures", "Bucket List"],
            images: [
                "/Hot Air Balloon Sunrise Over Atlas.jpg",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Ciel de Marrakech",
                image: "/localexpert.jpg",
                bio: "As Morocco's premier hot air balloon operator with over 15 years of experience, we are committed to safety and ensuring an unforgettable sunrise flight over the Moroccan landscape.",
                verified: true
            },
            description: "Float peacefully through the sky as the sun rises over Morocco in this unforgettable bucket-list adventure. Your experience begins with a pre-dawn 4x4 pickup and a trip to the launch site, where you'll watch the massive balloons inflate against the pre-dawn sky. You'll then ascend smoothly into the morning air for an hour-long flight over desert landscapes, Berber villages, and the majestic Atlas Mountains. After a gentle landing, you'll celebrate with a traditional Berber breakfast feast in a luxurious tent and receive a personalized flight certificate.",
            included: [
                "A pre-dawn 4x4 pickup from your accommodation",
                "A 1-hour hot air balloon flight",
                "An experienced pilot and ground crew",
                "A traditional Berber breakfast in a luxury tent",
                "A personalized flight certificate",
                "Return transfer to your hotel"
            ],
            exclusions: ["Gratuities for the pilot and crew", "Your hotel breakfast (you'll eat after the flight)"],
            meetingPoint: "Pre-dawn pickup from your hotel/riad (the exact time will be confirmed the day before)",
            endingPoint: "Return to your hotel/riad",
            cancellationPolicy: "Free cancellation up to 48 hours before the flight. Weather-related cancellations will receive a full refund or be rescheduled.",
            requirements: ["Confirm your flight 24 hours in advance.", "A reasonable level of fitness is required for entering the basket."],
            ageRestrictions: "The minimum age is 6 years. Children under 12 must be accompanied by an adult. Not recommended for pregnant women.",
            whatToBring: ["Warm layers (it's cool at altitude)", "Comfortable closed-toe shoes", "A camera or phone", "Sunglasses", "A hat"],
            experienceHighlights: [
                "A once-in-a-lifetime bucket-list adventure.",
                "Witness the sunrise from the sky over the Atlas Mountains.",
                "A peaceful floating sensation, with silence broken only by the roar of the burner.",
                "Bird's-eye views of the desert, villages, and olive groves.",
                "A traditional Berber breakfast in a luxury tent."
            ],
            additionalInfo: "Flights are operated daily, weather permitting. The best season is from October to May. Dress in layers, as it can be cool at dawn but warms up quickly. The total experience lasts 4 hours.",
            itinerary: [
                { time: "05:00", title: "Pre-Dawn Pickup", description: "A 4x4 vehicle will pick you up in the dark for a scenic drive to the launch site in the desert plains outside Marrakech." },
                { time: "05:45", title: "Balloon Preparation", description: "Arrive at the launch site and watch in awe as the massive, colorful balloons are inflated against the lightening sky." },
                { time: "06:30", title: "Liftoff & Sunrise Flight", description: "Ascend smoothly into the peaceful morning air and float silently over the desert landscape as the sun rises spectacularly." },
                { time: "07:30", title: "Gentle Landing", description: "Your pilot will navigate a skilled and gentle landing in the desert, where the ground crew will be waiting." },
                { time: "08:00", title: "Berber Breakfast Feast", description: "Celebrate your flight with a traditional Berber breakfast in a luxury tent, complete with fresh bread, Moroccan pastries, and mint tea." }
            ],
            minGroupSize: 1,
            maxGroupSize: 16,
            targetAudience: "Perfect for couples celebrating a special occasion, adventure seekers, photographers, and anyone drawn to a peaceful and breathtaking experience.",
            uniqueSellingPoints: [
                "One of the world's most spectacular ballooning locations, with the Atlas Mountains as a backdrop.",
                "A safety-first operator with a perfect 15-year safety record.",
                "An intimate group size that ensures personal attention.",
                "Includes a luxurious Berber breakfast and a personalized flight certificate."
            ],
            importantNotes: [
                "Flights are weather-dependent and may be canceled for safety reasons.",
                "An early wake-up is required, but it's absolutely worth it.",
                "Dress in warm layers, as it can be cool at altitude."
            ],
            whatToExpect: "Your magical day begins with a pre-dawn pickup and a trip to the desert launch site. As you watch the giant balloons inflate, the anticipation builds. The flight itself is a serene and breathtaking experience, offering unparalleled views of the sunrise over the Atlas Mountains. After landing, a delicious Berber breakfast awaits you in a luxury tent. The entire experience is a perfect blend of adventure, luxury, and natural beauty.",
            authenticMoroccanElements: [
                "A traditional Berber breakfast that celebrates Moroccan hospitality.",
                "A mint tea ceremony performed with authentic ritual.",
                "Views that showcase authentic Berber villages and traditional agriculture.",
                "An experience that combines modern adventure with traditional Moroccan celebration."
            ],
            difficulty: "Easy",
            languages: ["English", "French"],
            accessibility: "The experience is not wheelchair accessible and requires the ability to climb into the basket. It is not recommended for those with significant mobility limitations.",
            seasonalNotes: "The best season for ballooning is from October to May, when the weather is most stable. Winter flights offer spectacular snow-capped views of the Atlas Mountains."
        },
        {
            id: "ct-07",
            title: "3-Day Desert Expedition: Merzouga Dunes",
            subtitle: "Ultimate Sahara Adventure",
            price: 180,
            rating: 0,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/3-Day Desert Expedition Merzouga.jpg",
            duration: "3 Days / 2 Nights",
            features: ["Real Sahara Dunes", "Dades Valley", "Starry Night", "Ait Benhaddou", "Camel Trek"],
            location: "Sahara Desert (Erg Chebbi, Merzouga)",
            tags: ["Adventures", "Excursions", "Bucket List"],
            images: [
                "/3-Day Desert Expedition Merzouga.jpg",
                "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1473654729523-203e25dfda10?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Sahara Experts Morocco",
                image: "/localexpert.jpg",
                bio: "We have specialized in multi-day Sahara expeditions for over 12 years, combining spectacular desert landscapes with culturally immersive experiences to ensure an unforgettable journey from Marrakech to the real Sahara dunes.",
                verified: true
            },
            description: "Embark on the ultimate Moroccan adventure: a 3-day journey to the towering Sahara dunes of Erg Chebbi. This bucket-list expedition combines dramatic mountain landscapes, ancient kasbahs, and the magical experience of sleeping under the infinite desert stars. On day 1, you'll travel through the High Atlas Mountains and visit the UNESCO World Heritage site of Ait Benhaddou. On day 2, you'll journey to Merzouga, where you'll swap your minibus for a camel and trek into the dunes at sunset for a night at a traditional desert camp. Day 3 brings a sunrise over the dunes and the scenic return journey to Marrakech.",
            included: [
                "Round-trip transport in an air-conditioned minibus",
                "An experienced driver/guide",
                "Hotel accommodation in the Dades Valley on night 1",
                "A night at a traditional desert camp in the Sahara",
                "Dinner on day 1, breakfast and dinner on day 2, and breakfast on day 3",
                "A sunset camel trek into the Erg Chebbi dunes"
            ],
            exclusions: ["Lunches (available at restaurants en route)", "Drinks with meals", "Gratuities for the driver/guide", "Optional activities like sandboarding"],
            meetingPoint: "Hotel/riad pickup early on the morning of day 1",
            endingPoint: "Return to your hotel/riad on the evening of day 3",
            cancellationPolicy: "Free cancellation up to 7 days before departure. A 50% refund is offered for cancellations between 3-7 days before departure. No refund within 3 days of departure.",
            requirements: ["Specify your pickup location and any dietary restrictions when booking.", "Pack light—only what you need for 3 days."],
            ageRestrictions: "Suitable for ages 8 and up. Children must be comfortable with long driving days.",
            whatToBring: ["A small backpack or soft bag", "Layers for temperature changes", "A scarf or bandana for dust protection", "Sunscreen, sunglasses, and a hat", "Comfortable walking shoes", "A power bank"],
            experienceHighlights: [
                "Sleep under the stars in the Sahara Desert—a true bucket-list experience.",
                "A camel trek at sunset into the towering Erg Chebbi dunes.",
                "A visit to the UNESCO World Heritage site of Ait Benhaddou.",
                "Cross the spectacular High Atlas Mountains and the Tizi n'Tichka pass.",
                "Experience the Dades Valley and the dramatic Todra Gorge."
            ],
            additionalInfo: "The desert can be very cold at night, even in the summer, so bring warm layers. The desert camp has basic but comfortable facilities. Camel riding is for approximately 1 hour each way.",
            itinerary: [
                { time: "Day 1: 07:30", title: "Pickup & Atlas Mountains", description: "An early morning pickup from your accommodation is followed by a scenic drive through the High Atlas Mountains, including a stop at the breathtaking Tizi n'Tichka pass." },
                { time: "Day 1: 11:00", title: "Ait Benhaddou UNESCO Site", description: "Arrive at the ancient fortified village of Ait Benhaddou for a guided tour of this stunning UNESCO World Heritage kasbah." },
                { time: "Day 2: 14:00", title: "Arrival in Merzouga", description: "After a journey through the Todra Gorge, you'll reach Merzouga, where you'll meet your camels for a 1-hour trek into the dunes at golden hour." },
                { time: "Day 2: 19:00", title: "Desert Camp & Starlit Dinner", description: "Arrive at a traditional Berber desert camp, where you'll enjoy dinner, a campfire, and traditional Berber music under a sky full of stars." },
                { time: "Day 3: 05:30", title: "Sunrise Over Sahara & Return Trek", description: "Wake before dawn to watch the sun rise over the dunes, then enjoy breakfast before your camel trek back to Merzouga and the return journey to Marrakech." }
            ],
            minGroupSize: 2,
            maxGroupSize: 14,
            targetAudience: "Perfect for adventure travelers, bucket-list enthusiasts, and photographers. Ideal for couples, families with older children, and anyone dreaming of an epic Moroccan road trip.",
            uniqueSellingPoints: [
                "Sleep in the real Sahara Desert, among towering dunes.",
                "A comprehensive 3-day journey that showcases Morocco's geographic diversity.",
                "Sunset and sunrise camel treks into the massive dunes.",
                "A traditional desert camp experience with Berber music under the stars."
            ],
            importantNotes: [
                "The driving days are long, so be prepared for 6-8 hours of travel on days 1 and 3.",
                "The desert nights are very cold, so pack warm layers.",
                "Pack light, as you'll only need a small backpack or soft bag."
            ],
            whatToExpect: "This 3-day expedition is the ultimate Moroccan road trip, taking you from the bustling city of Marrakech to the serene and majestic Sahara Desert. You'll travel through breathtaking mountain passes, visit ancient kasbahs, and ride a camel into the sunset. The highlight of the trip is undoubtedly the night spent at a Berber camp in the heart of the desert, where you'll be mesmerized by the star-filled sky. It's an adventure that combines natural beauty, cultural immersion, and unforgettable experiences.",
            authenticMoroccanElements: [
                "A visit to the UNESCO World Heritage site of Ait Benhaddou.",
                "Sunset and sunrise camel treks, reflecting traditional Sahara Berber transportation.",
                "A traditional desert camp with Berber music and storytelling around a campfire.",
                "Home-cooked Moroccan meals, including tagine and couscous."
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Berber (Tamazight)"],
            accessibility: "The tour is not wheelchair accessible. It requires the ability to mount and dismount camels and handle long vehicle journeys.",
            seasonalNotes: "Available year-round. Spring and fall offer the most pleasant temperatures. Summer days are very hot in the desert, while winter nights are very cold."
        }
    ],
    workshops: [
        {
            id: "ot-01",
            title: "Master the Tagine: Cooking Class",
            subtitle: "Hands-On Moroccan Culinary Journey",
            price: 45,
            rating: 0,
            reviews: 0,
            category: "Workshops",
            image: "/Master the Tagine Cooking Class.jpg",
            duration: "4 hours",
            features: ["Market Visit", "Hands-on Cooking", "Full Lunch Included", "Recipe Cards", "Small Group"],
            location: "Traditional Riad Kitchen, Medina",
            tags: ["Food & Drink", "Culture", "Hands-on"],
            images: [
                "/Master the Tagine Cooking Class.jpg",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Chef Fatema",
                image: "/localexpert.jpg",
                bio: "With over 15 years of experience, Chef Fatema shares her family's treasured recipes and techniques, passed down through generations. Her warm and patient teaching style makes even beginners feel confident and inspired.",
                verified: true
            },
            description: "Discover the aromatic secrets of Moroccan cuisine in this immersive, hands-on cooking class. Your culinary journey begins in the vibrant souks of the Medina, where you'll learn to select the finest ingredients like a local. Then, in a beautiful riad kitchen, you'll prepare a complete Moroccan feast from scratch, including a traditional tagine, hand-rolled couscous, and fresh salads. The best part? You'll eat everything you create in a communal feast. You'll leave with recipe cards and the confidence to recreate Morocco's flavors at home.",
            included: [
                "All fresh ingredients from the souk",
                "A guided souk shopping tour",
                "Hands-on cooking instruction from a professional chef",
                "A full 3-course lunch (that you create!)",
                "Traditional recipe cards to take home",
                "A small group size (max 8 people)"
            ],
            exclusions: ["Transportation to and from the riad", "Gratuities for the chef"],
            meetingPoint: "A traditional riad kitchen in the Medina (exact address provided upon booking)",
            endingPoint: "Same as the meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the class for a full refund.",
            requirements: ["Inform the chef of any dietary restrictions or allergies when booking."],
            ageRestrictions: "Suitable for ages 10 and up. Children under 16 must be accompanied by an adult.",
            whatToBring: ["An appetite!", "A camera", "Your enthusiasm"],
            experienceHighlights: [
                "An authentic, hands-on cooking class where you do the work, not just watch.",
                "A guided souk shopping tour to learn about ingredient selection.",
                "Learn from an experienced chef with generational family recipes.",
                "Master traditional techniques like spice blending and tagine cooking.",
                "Eat your delicious creation in a communal feast."
            ],
            additionalInfo: "Classes are held daily at 10:00 AM. Vegetarian and vegan options are available with advance notice. Private classes are also available. The class is conducted in English and French.",
            itinerary: [
                { time: "10:00", title: "Souk Shopping Adventure", description: "Meet Chef Fatema at the riad and walk together to the nearby souks to select fresh ingredients for your feast." },
                { time: "11:00", title: "Hands-On Cooking Begins", description: "Return to the beautiful riad kitchen to begin your hands-on cooking class, where you'll learn to prepare a tagine, couscous, and salads from scratch." },
                { time: "12:30", title: "Final Preparations", description: "As the tagine simmers and the couscous steams, you'll set the traditional table and brew fresh mint tea." },
                { time: "13:00", title: "Communal Feast!", description: "Sit down with your new friends to devour the delicious meal you've created, sharing stories and laughter over a pot of mint tea." }
            ],
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "Perfect for food lovers, hands-on learners, and anyone seeking an authentic cultural experience. Ideal for couples, families with older children, and solo travelers.",
            uniqueSellingPoints: [
                "A truly hands-on class where you do the cooking.",
                "A guided souk shopping tour that provides cultural insights.",
                "Generational family recipes for an authentic taste of Morocco.",
                "A small group size ensures personalized attention."
            ],
            importantNotes: [
                "Inform the chef of any dietary restrictions when booking.",
                "The souk walk involves about 15-20 minutes of walking.",
                "Come hungry, as the lunch is substantial."
            ],
            whatToExpect: "Your cooking class begins with a sensory journey through the souks of Marrakech. Back in the beautiful riad kitchen, you'll learn the secrets of Moroccan cuisine from a master. The class is a fun, interactive, and delicious way to immerse yourself in the local culture. You'll not only learn to cook a traditional meal but also gain insight into the Moroccan way of life. The highlight of the day is savoring the fruits of your labor in a joyful, communal feast.",
            authenticMoroccanElements: [
                "The class features generational family recipes.",
                "The souk shopping tour teaches traditional Moroccan ingredient selection.",
                "You'll learn hands-on traditional techniques like hand-rolling couscous.",
                "The communal meal reflects Moroccan hospitality."
            ],
            difficulty: "Easy",
            languages: ["English", "French"],
            accessibility: "The riad has a ground-floor kitchen and is wheelchair accessible with advance notice. The souk walk can be modified.",
            seasonalNotes: "Available year-round. The recipes feature seasonal produce, so the ingredients will vary depending on the time of year."
        },
        {
            id: "ot-02",
            title: "Perfume Making Workshop",
            subtitle: "Create Your Signature Scent",
            price: 50,
            rating: 0,
            reviews: 0,
            category: "Workshops",
            image: "/Perfume Making Workshop.jpg",
            duration: "2 hours",
            features: ["Creative", "Take Home 30ml Perfume", "Sensory Experience", "Natural Essences"],
            location: "Medina Atelier (Central Marrakech)",
            tags: ["Culture", "Creative"],
            images: [
                "/Perfume Making Workshop.jpg",
                "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1588405748879-acb4f5b2d0e4?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Aroma Atelier Marrakech",
                image: "/localexpert.jpg",
                bio: "Our master perfumers have a deep knowledge of Moroccan essential oils and traditional perfume-making techniques. We combine ancient methods with creative freedom to help each guest create a truly unique signature scent.",
                verified: true
            },
            description: "Discover the ancient art of perfume-making in this hands-on sensory workshop. You'll learn to compose your own signature fragrance under the guidance of an expert perfumer. The session begins with an introduction to perfume structure and the olfactory families. You'll then explore a collection of over 50 natural essential oils and absolutes, learning to balance notes and create a harmonious composition. You'll leave with a 30ml bottle of your unique perfume and a personalized formula card so you can reorder it anytime.",
            included: [
                "A 2-hour workshop with a master perfumer",
                "Access to over 50 natural essential oils and essences",
                "Professional guidance on scent composition",
                "A 30ml bottle of your custom perfume to take home",
                "A personalized formula card for reordering"
            ],
            exclusions: ["Hotel pickup and drop-off", "Additional perfume bottles (available for purchase)"],
            meetingPoint: "An atelier in the central Medina (exact address provided upon booking)",
            endingPoint: "Same as the meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the workshop for a full refund.",
            requirements: ["Book 1-2 days in advance to ensure availability.", "Suitable for ages 14 and up."],
            ageRestrictions: "Suitable for ages 14 and up.",
            whatToBring: ["Curiosity and an open mind.", "Optional: notes on scents you love for inspiration."],
            experienceHighlights: [
                "Create your own unique signature perfume to take home in a 30ml bottle.",
                "Learn from a master perfumer about scent structure and blending.",
                "Explore over 50 natural Moroccan essential oils and essences.",
                "Receive a personalized formula for reordering your signature scent."
            ],
            additionalInfo: "Workshops are held daily in the morning and afternoon. The workshop is conducted in English and French. The atelier is located in an easily accessible part of the central Medina.",
            itinerary: [
                { time: "00:00", title: "Welcome & Perfume Introduction", description: "Arrive at the beautiful atelier for a welcome mint tea and an introduction to the history of perfume in Morocco, the olfactory families, and the principles of scent composition." },
                { time: "+20 min", title: "Sensory Discovery", description: "Explore a collection of over 50 natural essential oils, smelling and comparing them to discover what you love and begin forming your scent vision." },
                { time: "+45 min", title: "Creation & Blending", description: "With guidance from the master perfumer, you'll start blending your base, middle, and top notes, experimenting and refining until you've created your perfect scent." },
                { time: "+90 min", title: "Finalization & Bottling", description: "Once you're satisfied with your formula, your perfume will be professionally bottled in an elegant 30ml glass bottle to take home." }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Perfect for perfume enthusiasts, creative travelers, and anyone interested in Moroccan essential oils and aromatherapy. A unique and memorable souvenir-making experience.",
            uniqueSellingPoints: [
                "You'll create an actual wearable signature perfume to take home.",
                "Access to over 50 natural Moroccan essential oils and rare essences.",
                "Expert guidance from a master perfumer.",
                "A personalized formula card that allows you to reorder your scent anytime."
            ],
            importantNotes: [
                "The perfume contains alcohol and may not be suitable for very sensitive skin.",
                "The workshop requires focus and sensory attention, so it is not suitable for young children.",
                "Your 30ml bottle is TSA-compliant for carry-on luggage."
            ],
            whatToExpect: "Your perfume-making journey begins in a beautiful and inspiring atelier in the heart of the Medina. Under the guidance of a master perfumer, you'll explore a world of scents and learn the art of blending. The workshop is a creative and sensory experience that will leave you with a unique and personal memento of your time in Morocco. You'll walk away with not only a bottle of your own signature scent but also a deeper appreciation for the ancient art of perfumery.",
            authenticMoroccanElements: [
                "The workshop teaches traditional Moroccan perfumery techniques.",
                "You'll work with natural essences from Moroccan flora, such as orange blossom and rose.",
                "The experience reflects Morocco's long history as a crossroads of perfume trade.",
                "The atelier is located in the historic Medina, in the traditional craftsman quarter."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "The ground-floor atelier is wheelchair accessible with advance notice. The workshop requires a sense of smell and fine motor skills.",
            seasonalNotes: "Available year-round. A perfect activity for any weather, as it's held indoors in a climate-controlled environment."
        },
        {
            id: "ot-03",
            title: "Pottery & Zellige Workshop",
            subtitle: "Traditional Moroccan Crafts",
            price: 35,
            rating: 0,
            reviews: 0,
            category: "Workshops",
            image: "/Pottery & Zellige Workshop.jpg",
            duration: "3 hours",
            features: ["Kid Friendly", "Traditional Art", "Clay", "Hands-On", "Take Home"],
            location: "Artisan District (Bab Doukkala)",
            tags: ["Culture", "Family-Friendly"],
            images: [
                "/Pottery & Zellige Workshop.jpg",
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Crafts Collective Marrakech",
                image: "/localexpert.jpg",
                bio: "We are a working artisan cooperative dedicated to preserving the traditional crafts of pottery and zellige. Our master craftsmen have decades of experience and a passion for sharing these ancient techniques with visitors of all ages.",
                verified: true
            },
            description: "Get hands-on with Morocco's most beautiful traditional crafts in this immersive 3-hour workshop. You can choose to focus on either pottery on a traditional wheel or the art of zellige (intricate geometric mosaic). In the pottery session, you'll learn to center clay and shape vessels under the guidance of a master potter. In the zellige session, you'll learn the ancient art of Moroccan mosaic, cutting and arranging glazed tiles into complex geometric patterns. You'll create a piece to take home, offering a cultural immersion in a working artisan cooperative.",
            included: [
                "A 3-hour workshop with a master artisan",
                "All materials, including clay, tools, and tiles",
                "Your finished piece to take home (zellige) or have shipped (pottery)",
                "A visit to the working artisan studios",
                "Mint tea"
            ],
            exclusions: ["Pottery shipping costs (approximately $15-25 for international shipping)", "Hotel pickup (the artisan district is easily accessible by taxi)"],
            meetingPoint: "An artisan cooperative in the Bab Doukkala district (address provided upon booking)",
            endingPoint: "Same as the meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the workshop for a full refund.",
            requirements: ["Specify your preference for pottery or zellige when booking.", "Wear clothes you don't mind getting dirty."],
            ageRestrictions: "Suitable for ages 6 and up. A great family-friendly experience.",
            whatToBring: ["Old clothes that you don't mind getting clay or paint on.", "A camera"],
            experienceHighlights: [
                "A hands-on experience with traditional Moroccan crafts: pottery or zellige mosaic.",
                "Learn from master artisans with generational knowledge.",
                "Create your own authentic souvenir.",
                "Visit a working artisan cooperative and see traditional crafts in action."
            ],
            additionalInfo: "Pottery pieces require kiln-firing and can be shipped internationally or picked up later. Zellige pieces can be taken home the same day. The workshop is suitable for absolute beginners.",
            itinerary: [
                { time: "09:00", title: "Welcome & Artisan District Tour", description: "Arrive at the working artisan cooperative for a welcome mint tea and a brief tour of the workshops, where you'll see potters and zellige cutters at work." },
                { time: "09:30", title: "Technique Demonstration", description: "Your master craftsman will demonstrate the technique, whether it's centering clay on the wheel or designing and cutting zellige patterns." },
                { time: "10:00", title: "Hands-On Practice", description: "Try your hand at the wheel or begin arranging your zellige tiles. The process is engaging and meditative, with plenty of room for laughter and learning." },
                { time: "11:00", title: "Creating Your Piece", description: "With guidance from the artisan, you'll create your final piece—a bowl or cup on the pottery wheel, or a mosaic coaster or tile panel." },
                { time: "11:45", title: "Finishing & Kiln/Assembly", description: "Your pottery piece will be prepared for kiln-firing, while your zellige piece will be assembled and finished for you to take home." }
            ],
            minGroupSize: 2,
            maxGroupSize: 10,
            targetAudience: "Perfect for families with children, craft enthusiasts, and hands-on learners. Ideal for anyone seeking an authentic cultural immersion and a meaningful handmade souvenir.",
            uniqueSellingPoints: [
                "A hands-on workshop where you'll do the actual creating.",
                "Learn from master artisans at a working cooperative.",
                "Create a genuine piece to take home as an authentic souvenir.",
                "A family-friendly experience that's suitable for all skill levels."
            ],
            importantNotes: [
                "Wear old clothes, as you're likely to get messy, especially with the clay.",
                "Pottery pieces need to be fired, so plan for shipping or a later pickup.",
                "The workshop is in a real artisan cooperative, which is authentic but not overly polished."
            ],
            whatToExpect: "Your workshop takes place in a bustling artisan cooperative, where you'll be surrounded by the sights and sounds of traditional Moroccan crafts. Whether you choose pottery or zellige, a master artisan will guide you through the creative process. The experience is a satisfying and meditative one, allowing you to connect with an ancient tradition and create a beautiful piece of art with your own hands. You'll leave with a unique souvenir and a deep appreciation for the skill and dedication of Moroccan craftsmen.",
            authenticMoroccanElements: [
                "The use of traditional pottery wheel techniques that have been unchanged for centuries.",
                "The art of zellige geometric mosaic, a signature Moroccan craft.",
                "The workshop is held in a working artisan cooperative that supports traditional craftsmen.",
                "The techniques and tools used are genuinely traditional, not simplified for tourists."
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Berber (Tamazight)"],
            accessibility: "The workshop is partially wheelchair accessible. The pottery wheel requires some mobility, while zellige is a seated activity.",
            seasonalNotes: "Available year-round. A great activity for any weather, as the workshops are covered. A perfect way to escape the heat on a summer afternoon."
        }
    ],
    entertainment: [
        {
            id: "ot-04",
            title: "Chez Ali Fantasia Dinner Show",
            subtitle: "Spectacular Moroccan Folklore Evening",
            price: 45,
            rating: 0,
            reviews: 0,
            category: "Entertainment",
            image: "/Chez Ali Fantasia Dinner Show.jpg",
            duration: "4 hours",
            features: ["Horse Show", "Traditional Dinner", "Folk Music", "Fantasia Riders", "Berber Dancers"],
            location: "Palmeraie (Route de Casablanca)",
            tags: ["Food & Drink", "Culture", "Entertainment"],
            images: [
                "/Chez Ali Fantasia Dinner Show.jpg",
                "https://images.unsplash.com/photo-1571934781635-5d3e1d44d76e?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1586973825876-76c5bf8ffbaf?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Fantasia Nights Morocco",
                image: "/localexpert.jpg",
                bio: "For over 30 years, we have been Morocco's most famous folklore dinner show, combining traditional hospitality with spectacular entertainment to ensure an unforgettable cultural evening.",
                verified: true
            },
            description: "Experience Morocco's most spectacular folkloric dinner show—a theatrical feast for all the senses. This legendary evening at Chez Ali combines traditional Moroccan hospitality with a lavish feast and breathtaking entertainment. You'll dine in massive traditional tents as folkloric musicians wander between tables. After dinner, the real spectacle begins in a huge outdoor arena with the Fantasia, a traditional exhibition of horsemanship. You'll also see acrobatic performers, Berber dancers, and belly dancers in a riot of color, music, and celebration.",
            included: [
                "Round-trip transport from your Marrakech accommodation",
                "A traditional Moroccan feast with multiple courses",
                "The Fantasia horse show with rifle volleys",
                "A folklore show with dancers, acrobats, and musicians",
                "Reserved seating in a traditional tent"
            ],
            exclusions: ["Alcoholic beverages (soft drinks and mint tea are included)", "Gratuities for the staff and performers"],
            meetingPoint: "Hotel/riad pickup",
            endingPoint: "Return to your accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before the show for a full refund.",
            requirements: ["Specify your pickup location when booking.", "Arrive hungry—the feast is substantial."],
            ageRestrictions: "Suitable for all ages. A family-friendly experience.",
            whatToBring: ["A camera or phone for photos.", "A light jacket (the outdoor show can be cool in the winter)."],
            experienceHighlights: [
                "The spectacular Fantasia horse show, with charging riders firing antique rifles in sync.",
                "A traditional Moroccan feast with multiple courses.",
                "Folklore performances featuring Berber dancers, acrobats, and Gnawa musicians.",
                "A family-friendly evening of entertainment that's perfect for all ages."
            ],
            additionalInfo: "The show runs nightly, year-round. Pickup is typically at 7:30 PM, with a return around midnight. The feast is substantial, so arrive hungry. Vegetarian options are limited.",
            itinerary: [
                { time: "19:30", title: "Pickup & Transfer", description: "A comfortable vehicle will pick you up from your accommodation for a scenic drive to the Chez Ali complex in the Palmeraie." },
                { time: "20:00", title: "Welcome & Seating", description: "Enter a traditional Berber tent and be shown to your reserved table for a welcome mint tea." },
                { time: "20:15", title: "Traditional Feast Begins", description: "The feast begins with a course of Moroccan salads, followed by roasted lamb, tagine, and couscous, all served family-style." },
                { time: "22:00", title: "The Fantasia Horse Show", description: "Move to the outdoor arena for the main event: a thrilling display of horsemanship, with riders in traditional dress charging at full gallop and firing antique rifles." },
                { time: "22:30", title: "Folklore Performance Spectacular", description: "The variety show continues with Berber dancers, acrobats, Gnawa musicians, and belly dancers in a dazzling display of color and movement." }
            ],
            minGroupSize: 1,
            maxGroupSize: 500,
            targetAudience: "Perfect for families with children, large groups, and first-time visitors to Morocco. Ideal for anyone wanting a big, colorful evening of Moroccan entertainment.",
            uniqueSellingPoints: [
                "Morocco's most famous and longest-running folklore dinner show.",
                "The spectacular Fantasia, an authentic traditional display of horsemanship.",
                "A lavish traditional feast is included.",
                "A comprehensive folklore showcase with performers from across Morocco."
            ],
            importantNotes: [
                "This is a large-scale tourist show, not an intimate experience.",
                "The rifle fire during the Fantasia is very loud and may startle young children.",
                "Seating is at long, communal tables."
            ],
            whatToExpect: "Your evening at Chez Ali is a feast for the senses. From the moment you enter the magical, lamp-lit world of the Palmeraie, you'll be transported to a world of Moroccan folklore and fantasy. The food is plentiful, the entertainment is spectacular, and the atmosphere is electric. The highlight is the Fantasia, a breathtaking display of horsemanship that will leave you in awe. It's a touristy but undeniably fun and memorable way to experience Moroccan culture.",
            authenticMoroccanElements: [
                "The Fantasia is a genuine Moroccan tradition, a display of Berber horsemanship.",
                "The traditional roasted lamb is prepared in authentic underground ovens.",
                "The folklore performances showcase regional dances and music from across Morocco.",
                "The Gnawa music represents Morocco's spiritual musical traditions."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Spanish", "Arabic"],
            accessibility: "The venue is partially wheelchair accessible, with a wheelchair section available in the arena with advance notice.",
            seasonalNotes: "The show runs nightly, year-round. Spring and fall offer the most pleasant temperatures for the outdoor portion of the show."
        }
    ],
    transfers: [
        {
            id: "ot-05",
            title: "Private Airport Transfer",
            subtitle: "Stress-Free Arrival or Departure",
            price: 25,
            rating: 0,
            reviews: 0,
            category: "Transfers",
            image: "/Private Airport Transfer.jpg",
            duration: "30-40 minutes",
            features: ["24/7 Service", "Meet & Greet", "AC Vehicle", "Flight Tracking", "Professional Driver"],
            location: "Marrakech Menara Airport (RAK)",
            tags: ["Transport"],
            images: [
                "/Private Airport Transfer.jpg",
                "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=1500&auto=format&fit=crop"
            ],
            host: {
                name: "Marrakech Shuttle Services",
                image: "/localexpert.jpg",
                bio: "Our professional airport transfer service has been operating 24/7 for over 8 years. Our courteous drivers and reliable vehicles ensure that your journey to or from the airport is stress-free.",
                verified: true
            },
            description: "Start or end your trip to Morocco the right way with a professional and stress-free private airport transfer. For arrivals, your driver will be waiting for you in the arrivals hall with a sign bearing your name. For departures, you'll be picked up from your accommodation at your specified time. Our flight tracking service means we'll be there even if your flight is delayed. Our professional, English-speaking drivers and clean, air-conditioned vehicles ensure a comfortable and reliable journey.",
            included: [
                "A private vehicle (sedan for 1-3 people, minivan for 4+)",
                "A professional, English-speaking driver",
                "Meet and greet with a name sign for arrivals",
                "Luggage assistance",
                "Flight tracking for arrivals",
                "30 minutes of free waiting time"
            ],
            exclusions: ["Gratuity for the driver (optional but appreciated)"],
            meetingPoint: "For arrivals, your driver will meet you in the arrivals hall with a name sign. For departures, you'll be picked up at your accommodation.",
            endingPoint: "For arrivals, your accommodation address. For departures, the airport terminal.",
            cancellationPolicy: "Free cancellation up to 12 hours before pickup for a full refund.",
            requirements: ["Provide your flight number for arrivals so we can track your flight.", "Provide your accurate accommodation address.", "Specify the number of passengers and luggage."],
            ageRestrictions: "Suitable for all ages. Car seats are available upon request for infants and toddlers.",
            whatToBring: ["Your flight details and accommodation address.", "Local currency for an optional tip."],
            experienceHighlights: [
                "A professional meet and greet, with a driver waiting for you with a name sign.",
                "A private vehicle, not a shared shuttle.",
                "Flight tracking to ensure your driver is there, even if your flight is delayed.",
                "24/7 service for any arrival or departure time."
            ],
            additionalInfo: "The service operates 24/7, year-round. The drive from the airport to the city center is 30-40 minutes, depending on traffic. Book at least 12 hours in advance.",
            itinerary: [
                { time: "Arrival", title: "Meet & Greet in Arrivals Hall", description: "After clearing customs and collecting your luggage, you'll find your driver waiting for you in the arrivals hall with a sign bearing your name." },
                { time: "+5 min", title: "Comfortable Drive to Accommodation", description: "Settle into a clean, air-conditioned vehicle for a smooth and safe drive to your accommodation, with your driver providing a helpful orientation to Marrakech." },
                { time: "+35 min", title: "Arrival at Your Accommodation", description: "Your driver will navigate to your hotel or riad and assist you with your luggage to the reception, ensuring your Morocco journey begins smoothly." }
            ],
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Perfect for first-time visitors, travelers arriving late at night, and families with children. Ideal for anyone who prefers fixed-price transparency over haggling with taxis.",
            uniqueSellingPoints: [
                "A meet and greet with a name sign eliminates any confusion or searching.",
                "Flight tracking means your driver will adjust for delays automatically.",
                "A private transfer, not a shared shuttle.",
                "A fixed, transparent price with no surprise charges."
            ],
            importantNotes: [
                "Provide your flight number for arrivals to enable tracking.",
                "Provide your accurate accommodation address to help the driver navigate.",
                "Book at least 12-24 hours in advance."
            ],
            whatToExpect: "Your private airport transfer is the most relaxing way to start or end your Moroccan adventure. Your professional driver will be waiting for you, ready to assist with your luggage and provide a safe and comfortable journey to your destination. There's no need to worry about navigating a new city or haggling with taxi drivers. It's a seamless, stress-free experience from start to finish.",
            authenticMoroccanElements: [
                "Your driver will provide a local's orientation to Marrakech.",
                "Experience professional Moroccan hospitality from the first moment.",
                "The drivers are locals with deep knowledge of the city.",
                "The service reflects Morocco's evolving professionalism in the tourism sector."
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "The service is wheelchair accessible with advance notice. Car seats are available for infants and toddlers upon request.",
            seasonalNotes: "Available 24/7, year-round. Book in advance during peak season to guarantee availability."
        }
    ]
};


export const activities: Activity[] = [
    ...activitiesData.healthServices,
    ...activitiesData.cityRoaming,
    ...activitiesData.cityTrips,
    ...activitiesData.workshops,
    ...activitiesData.entertainment,
    ...activitiesData.transfers
];
