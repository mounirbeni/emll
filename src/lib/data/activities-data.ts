import { Activity } from "@/lib/types";

export const activitiesData: Record<string, Activity[]> = {
    healthServices: [
        {
            id: "h-01",
            title: "Rooftop Sunrise Yoga & Wellness",
            subtitle: "Begin your day with serenity and breathtaking views over the ancient Medina",
            price: 20,
            rating: 4.8,
            reviews: 0,
            category: "Health Services",
            image: "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
            images: [
                "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
                "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
                "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg",
                "/Rooftop Sunrise Yoga & Wellness in Marrakech.jpg"
            ],
            duration: "1.5 hours",
            features: ["Sunrise View", "Certified Instructor", "Meditation", "Organic Herbal Tea", "Luxury Mat"],
            location: "Medina Rooftop",
            tags: ["Wellness", "Luxury", "Spiritual"],
            host: {
                name: "Yasmina El Mansouri",
                image: "/localexpert.jpg",
                bio: "Certified yoga instructor with 10+ years experience in holistic wellness. Specializes in sunrise meditation sessions with stunning panoramic views.",
                verified: true
            },
            description: "Awaken your senses with an exclusive sunrise yoga session overlooking the ancient Medina of Marrakech. This carefully curated experience combines traditional Hatha flow with guided meditation, all while witnessing the golden dawn illuminate the red city's skyline. Suitable for all levels, our session is designed to harmonize your mind, body, and spirit.",
            included: ["Premium Manduka yoga mat", "Organic herbal tea ceremony", "Mineral water", "Guided meditation session", "Post-session wellness consultation"],
            exclusions: ["Personal yoga mat", "Transportation to/from the location", "Additional wellness products"],
            meetingPoint: "Luxury rooftop terrace in the heart of the Medina, exact address provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the experience. Within 24 hours, 50% refund applies.",
            requirements: ["Comfortable athletic clothing", "No prior yoga experience required", "Open mind and positive energy"],
            ageRestrictions: "Suitable for ages 12 and up. Minors must be accompanied by an adult.",
            whatToBring: ["Comfortable athletic clothes", "Light jacket for post-session cool down"],
            experienceHighlights: [
                "Breathtaking 360-degree sunrise views over the Medina",
                "Personalized guidance from certified yoga instructor",
                "Luxury Manduka mats and premium props",
                "Organic herbal tea ceremony post-session",
                "Relaxing guided meditation session"
            ],
            additionalInfo: "Please arrive 15 minutes early for a welcoming herbal tea. The session is held rain or shine, but may be rescheduled in extreme weather conditions. We recommend wearing modest clothing as this experience takes place on a public rooftop.",
            itinerary: [
                { time: "07:00", title: "Welcome Ceremony", description: "Meet & greet with organic herbal tea and wellness consultation" },
                { time: "07:15", title: "Sunrise Yoga Flow", description: "60-minute Hatha flow sequence synchronized with the rising sun" },
                { time: "08:15", title: "Meditation & Closing", description: "Guided meditation session and gratitude practice" }
            ],
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "Perfect for wellness enthusiasts, spiritual seekers, and travelers looking for a mindful start to their day.",
            uniqueSellingPoints: [
                "Exclusive rooftop location with panoramic Medina views",
                "Certified instructor with specialization in sunrise meditation",
                "Luxury equipment and personalized attention",
                "Organic tea ceremony featuring local herbs",
                "Small groups for intimate experience"
            ],
            premiumAddons: [
                { name: "Aromatherapy Upgrade", price: 10, description: "Enhance your session with personalized essential oil blend" },
                { name: "Private Session", price: 80, description: "One-on-one instruction for a deeply personal experience" }
            ],
            importantNotes: [
                "Sessions are weather-dependent and may be rescheduled",
                "Photography is permitted but please be respectful of others",
                "Please inform us of any injuries or health concerns in advance"
            ],
            whatToExpect: "Upon arrival, you'll be welcomed with a calming herbal tea ceremony while watching the city slowly awaken. The yoga session begins precisely at sunrise, with flowing movements designed to energize your body. The meditation segment focuses on gratitude and setting intentions for your day. The experience concludes with a brief wellness consultation.",
            authenticMoroccanElements: [
                "Organic mint and herbal teas sourced locally",
                "Traditional Berber meditation techniques",
                "Handwoven yoga bolsters crafted by local artisans",
                "Views of ancient Koutoubia Mosque and the Atlas Mountains"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic"],
            accessibility: "Limited accessibility due to rooftop location. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter sessions start earlier due to shorter daylight hours. Summer sessions offer cooler morning temperatures."
        },
        {
            id: "h-02",
            title: "Royal Moroccan Hammam & Spa Ritual",
            subtitle: "Indulge in the centuries-old tradition of Moroccan wellness with premium organic treatments",
            price: 45,
            rating: 4.8,
            reviews: 0,
            category: "Health Services",
            image: "/Royal Moroccan Hammam & Spa Ritual.jpg",
            images: [
                "/Royal Moroccan Hammam & Spa Ritual.jpg",
                "/Royal Moroccan Hammam & Spa Ritual.jpg",
                "/Royal Moroccan Hammam & Spa Ritual.jpg",
                "/Royal Moroccan Hammam & Spa Ritual.jpg"
            ],
            duration: "Variable",
            features: ["Luxury Spa", "Black Soap Scrub", "Argan Massage", "Organic Ingredients", "Private Suite"],
            location: "Marrakech Medina",
            tags: ["Wellness", "Luxury", "Traditional"],
            host: {
                name: "Fatima Zahra",
                image: "/localexpert.jpg",
                bio: "Third-generation hammam specialist trained in traditional Moroccan wellness rituals. Expert in organic skincare using locally-sourced ingredients.",
                verified: true
            },
            description: "Step into a world of ancient Moroccan wellness traditions with our authentic hammam ritual. Experience the therapeutic benefits of black soap, rhassoul clay, and pure argan oil in our luxurious private spa suite. This ancestral cleansing ritual rejuvenates both body and soul while connecting you to centuries of Moroccan culture.",
            included: [
                "Traditional cotton bathrobe and slippers",
                "Premium organic black soap and rhassoul clay",
                "Pure argan oil massage",
                "Refreshing mint tea and traditional pastries",
                "Private spa suite with heated marble platform",
                "Personal attendant throughout the experience"
            ],
            exclusions: ["Additional spa treatments", "Transportation to/from the spa", "Hair washing services", "Nail care services"],
            meetingPoint: "Luxury spa riad in the heart of the Medina, exact address provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: ["Reservation required at least 24 hours in advance", "Comfortable with traditional spa rituals", "No medical conditions that contraindicate heat exposure"],
            ageRestrictions: "Suitable for ages 16 and up. Minors must be accompanied by an adult.",
            whatToBring: ["Swimwear (optional)", "Personal toiletries if preferred"],
            experienceHighlights: [
                "Authentic Moroccan hammam experience in private suite",
                "Therapeutic black soap scrub with organic ingredients",
                "Nourishing argan oil massage by certified therapist",
                "Traditional mint tea ceremony with local pastries",
                "Luxurious heated marble platform and private ambiance"
            ],
            additionalInfo: "Please arrive 15 minutes early for consultation. All treatments are private and tailored to your preferences. We recommend avoiding heavy meals 2 hours before the experience.",
            itinerary: [
                { time: "Flexible", title: "Welcome & Consultation", description: "Personalized discussion of your wellness goals and preferences" },
                { time: "Flexible", title: "Steam & Purification", description: "Traditional steam bath to open pores and relax muscles" },
                { time: "Flexible", title: "Black Soap Treatment", description: "Full-body application of organic black soap for deep cleansing" },
                { time: "Flexible", title: "Rhassoul Clay Mask", description: "Mineral-rich clay mask for detoxification and skin renewal" },
                { time: "Flexible", title: "Argan Oil Massage", description: "Therapeutic massage with pure Moroccan argan oil" },
                { time: "Flexible", title: "Cool Down & Refreshments", description: "Mint tea ceremony and traditional pastries to conclude" }
            ],
            minGroupSize: 1,
            maxGroupSize: 2,
            targetAudience: "Ideal for travelers seeking authentic cultural experiences, wellness enthusiasts, and couples looking for romantic indulgence.",
            uniqueSellingPoints: [
                "Centuries-old traditional hammam techniques passed down through generations",
                "100% organic, locally-sourced ingredients",
                "Private luxury spa suite with heated marble platform",
                "Certified therapists with extensive traditional training",
                "Customizable treatments based on individual needs"
            ],
            premiumAddons: [
                { name: "Rose Petal Infusion", price: 15, description: "Luxurious rose petal treatment for enhanced relaxation" },
                { name: "Gold Dust Treatment", price: 25, description: "24k gold dust infusion for radiant skin glow" },
                { name: "Aromatic Oil Upgrade", price: 12, description: "Premium essential oil blend customized to your needs" }
            ],
            importantNotes: [
                "All treatments are private and gender-specific",
                "Please inform us of any skin sensitivities or medical conditions",
                "Shaving is not included in standard treatments",
                "Hair washing available for additional fee"
            ],
            whatToExpect: "Your journey begins with a warm welcome and consultation to understand your wellness goals. You'll then enter our private heated suite where the traditional steam bath prepares your skin. The black soap treatment deeply cleanses, followed by a rhassoul clay mask rich in minerals. The experience culminates with a therapeutic argan oil massage, concluding with a refreshing mint tea ceremony.",
            authenticMoroccanElements: [
                "Traditional black soap made from olives and potash",
                "Rhassoul clay mined from the Atlas Mountains",
                "Pure argan oil from women's cooperatives in Souss region",
                "Heated marble platform (takht el hammam) typical of Moroccan baths",
                "Mint tea served in traditional silver teapot"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Wheelchair accessible entrance available. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter treatments are particularly popular for their warming properties. Summer sessions offer cooling relief from the desert heat.",
            packageCategories: [
                {
                    name: "PREMIUM PACKAGES",
                    description: "Elevated combinations for the ultimate Moroccan wellness experience",
                    packages: [
                        {
                            name: "Package Oriental Express",
                            price: 65,
                            description: "75 min: Traditional Hammam Scrub (30 min) & Relaxing or Deep Tissue Massage (45 min)",
                            included: ["Traditional Hammam Scrub", "Relaxing or Deep Tissue Massage", "Mint Tea Ceremony"],
                            notIncluded: ["Premium add-ons", "Extended relaxation time"]
                        },
                        {
                            name: "Package Oriental Deluxe",
                            price: 79.5,
                            description: "105 min: Full Hammam Ritual with Rhassoul Clay Mask (45 min) + Relaxing or Deep Tissue Massage (60 min)",
                            included: ["Full Hammam Ritual", "Rhassoul Clay Mask", "Relaxing or Deep Tissue Massage", "Mint Tea Ceremony"],
                            notIncluded: ["Premium add-ons", "Hair washing"]
                        },
                        {
                            name: "Package Slimming & Body Contouring",
                            price: 89.5,
                            description: "90 min: Hammam with Organic Coffee Scrub (45 min) + Maderotherapy Massage (45 min)",
                            included: ["Organic Coffee Scrub", "Maderotherapy Massage", "Mint Tea Ceremony"],
                            notIncluded: ["Premium add-ons", "Extended relaxation time"]
                        },
                        {
                            name: "Package Couple's Romance",
                            price: 169.5,
                            description: "120 min (Duo): Complete Hammam Ritual with Rhassoul Clay Mask (45 min) + Couples Massage (75 min)",
                            included: ["Complete Hammam Ritual", "Rhassoul Clay Mask", "Couples Massage", "Romantic Setting", "Mint Tea Ceremony"],
                            notIncluded: ["Premium add-ons", "Hair washing"]
                        }
                    ]
                }
            ]
        }
    ],
    cityRoaming: [
        {
            id: "cr-01",
            title: "Hidden Gems of the Medina: Walking Tour",
            subtitle: "Uncover the secret treasures and ancient stories of Marrakech's UNESCO World Heritage medina",
            price: 25,
            rating: 4.8,
            reviews: 0,
            category: "City Roaming",
            image: "/Hidden Gems of the Medina Walking Tour.jpg",
            images: [
                "/Hidden Gems of the Medina Walking Tour.jpg",
                "/Hidden Gems of the Medina Walking Tour.jpg",
                "/Hidden Gems of the Medina Walking Tour.jpg",
                "/Hidden Gems of the Medina Walking Tour.jpg"
            ],
            duration: "3.5 hours",
            features: ["Licensed UNESCO Guide", "Skip-the-line Access", "Architecture", "Historical Insights", "Cultural Immersion"],
            location: "Marrakech Medina",
            tags: ["City Tours", "Culture", "UNESCO Heritage", "Luxury"],
            host: {
                name: "Mustapha Bennani",
                image: "/localexpert.jpg",
                bio: "UNESCO-certified cultural guide with 15+ years expertise in Marrakech's history. Specializes in revealing hidden architectural gems and sharing untold stories of the medina.",
                verified: true
            },
            description: "Embark on an extraordinary journey through the labyrinthine alleys of Marrakech's UNESCO World Heritage medina. Our expert guide reveals secret communal ovens, forgotten caravanserais, and the intricate geometric patterns of the Ben Youssef Madrasa that most visitors never discover. This immersive experience connects you with the authentic soul of the ancient city.",
            included: [
                "Expert UNESCO-certified guide",
                "Entrance fees to all visited sites",
                "Premium headsets for clear audio",
                "Cultural insight booklet",
                "Bottled water throughout the tour"
            ],
            exclusions: [
                "Personal transportation to/from meeting point",
                "Meals and drinks except water provided",
                "Souvenir purchases",
                "Tips for your guide (recommended but not required)"
            ],
            meetingPoint: "Near Jemaa el-Fna square, exact location provided upon booking along with detailed meeting instructions",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 24 hours before the experience. Within 24 hours, 50% refund applies.",
            requirements: [
                "Comfortable walking shoes with good grip",
                "Modest clothing covering shoulders and knees for religious site visits",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Capacity for moderate walking (approximately 3km)"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Comfortable walking shoes",
                "Water bottle (refill stations available)",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Camera for photo opportunities",
                "Small backpack for personal items"
            ],
            experienceHighlights: [
                "Exclusive access to hidden Medina gems inaccessible to large groups",
                "Expert guide with deep local knowledge and storytelling ability",
                "Interactive cultural insights into daily life and traditions",
                "Architectural marvels beyond the typical tourist trail",
                "Intimate small-group experience with maximum 8 participants"
            ],
            additionalInfo: "The tour involves moderate walking on uneven surfaces. Please wear comfortable shoes and bring water. Rest stops are included. Photography is encouraged but please be respectful of local residents.",
            itinerary: [
                { time: "09:30", title: "Koutoubia Minaret", description: "Historical significance and architectural details of Marrakech's iconic landmark" },
                { time: "10:15", title: "Secret Communal Ovens", description: "Discover hidden bread ovens still used by local families" },
                { time: "11:00", title: "Ancient Caravanserais", description: "Explore former trading posts where merchants once rested their camels" },
                { time: "11:45", title: "Ben Youssef Madrasa", description: "Intricate Islamic architecture and educational heritage" },
                { time: "12:30", title: "Jemaa el-Fna Square", description: "Cultural melting pot and UNESCO World Heritage site conclusion" }
            ],
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "Perfect for culturally curious travelers, architecture enthusiasts, and anyone seeking an authentic glimpse into Marrakech's heritage.",
            uniqueSellingPoints: [
                "UNESCO-certified guide with specialized historical knowledge",
                "Access to hidden locations unavailable to standard tours",
                "Intimate small-group format for personalized attention",
                "Multilingual guides offering rich storytelling experience",
                "Premium amenities including headsets and cultural materials"
            ],
            premiumAddons: [
                { name: "Private Guide Upgrade", price: 50, description: "Exclusive one-on-one experience with our lead guide" },
                { name: "Extended Tour", price: 20, description: "Additional hour including rooftop café with panoramic views" }
            ],
            importantNotes: [
                "Tour operates in all weather conditions except extreme heat or storms",
                "Please notify us of mobility limitations in advance",
                "Photography is welcome but please respect local customs",
                "Meeting point details sent 24 hours before tour"
            ],
            whatToExpect: "Your experience begins with a warm welcome from your expert guide who will share fascinating insights about Marrakech's history. You'll navigate the maze-like souks with confidence, discovering hidden courtyards and architectural wonders. The journey includes visits to lesser-known historical sites, interactions with local artisans, and stories passed down through generations. The tour concludes with time to reflect on your discoveries in the vibrant Jemaa el-Fna square.",
            authenticMoroccanElements: [
                "Stories of traditional crafts and artisan techniques",
                "Insights into daily life in the ancient medina",
                "Visits to family-run workshops and businesses",
                "Explanation of Islamic architectural symbolism",
                "Introduction to traditional Moroccan hospitality"
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "German", "Spanish"],
            accessibility: "Limited accessibility due to narrow alleyways and uneven surfaces. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer more comfortable walking temperatures. Summer tours begin early to avoid peak heat. Ramadan may affect site opening times."
        },
        {
            id: "cr-02",
            title: "Vintage Sidecar Adventure",
            subtitle: "Experience Marrakech in ultimate style with a restored 1960s Vespa sidecar through the city's most photogenic districts",
            price: 110,
            rating: 4.8,
            reviews: 0,
            category: "City Roaming",
            image: "/Vintage Sidecar Adventure.jpg",
            images: [
                "/Vintage Sidecar Adventure.jpg",
                "/Vintage Sidecar Adventure.jpg",
                "/Vintage Sidecar Adventure.jpg",
                "/Vintage Sidecar Adventure.jpg"
            ],
            duration: "1.5 hours",
            features: ["Private Tour", "Restored 1960s Vespa", "Photo Opportunities", "Expert Guide", "Luxury Experience"],
            location: "Gueliz & Medina",
            tags: ["City Tours", "Adventures", "Luxury", "Romantic"],
            host: {
                name: "Karim Essaadi",
                image: "/localexpert.jpg",
                bio: "Passionate vintage vehicle restorer and certified tour guide with 12+ years experience. Specializes in unique perspectives of Marrakech through restored classic vehicles.",
                verified: true
            },
            description: "Feel the wind in your hair as you cruise through Marrakech in ultimate style aboard a meticulously restored 1960s Vespa sidecar. This exhilarating private tour takes you through the elegant Art Deco district of Gueliz and along the ancient ramparts of the Medina, offering breathtaking photo opportunities and unforgettable memories.",
            included: [
                "Restored 1960s Vespa sidecar with premium safety features",
                "Professional driver and licensed tour guide",
                "Premium helmet with Bluetooth communication system",
                "Bottled water and luxury towel",
                "Professional photo package (10 edited photos)",
                "Personalized tour route based on your interests"
            ],
            exclusions: [
                "Personal transportation to/from pickup location",
                "Meals and additional beverages",
                "Gratuities for your driver (recommended but not required)",
                "Damage insurance (included in base price)"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Valid passport or ID for insurance purposes",
                "Comfortable with open-air transportation",
                "Ability to sit comfortably for 1.5 hours",
                "No serious back or neck conditions"
            ],
            ageRestrictions: "Suitable for ages 18 and up. Passengers must weigh under 120kg/265lbs for safety reasons.",
            whatToBring: [
                "Sunglasses and sunscreen for UV protection",
                "Scarf or bandana to protect from dust",
                "Camera or smartphone for photos",
                "Light jacket for cooler mornings/evenings"
            ],
            experienceHighlights: [
                "Unique vintage sidecar experience in restored 1960s Vespa",
                "Scenic routes through Gueliz's Art Deco landmarks and Medina walls",
                "Professional driver/guide with local expertise",
                "Stunning photo opportunities at iconic viewpoints",
                "Private tour customizable to your interests"
            ],
            additionalInfo: "Sidecar tours operate in all weather except heavy rain or extreme winds. Alternative transportation options available if needed. Tours are private and can accommodate up to 2 passengers.",
            itinerary: [
                { time: "Flexible", title: "Pick-up & Welcome", description: "Hotel or riad pickup with safety briefing and photo orientation" },
                { time: "Flexible", title: "Gueliz Exploration", description: "Art Deco architectural highlights and modern Marrakech districts" },
                { time: "Flexible", title: "Medina Ramparts", description: "Panoramic views of ancient city walls and surrounding palm groves" },
                { time: "Flexible", title: "Photo Stops", description: "Picture-perfect locations with professional photography assistance" },
                { time: "Flexible", title: "Return Journey", description: "Scenic route back to your accommodation with final photo session" }
            ],
            minGroupSize: 1,
            maxGroupSize: 2,
            targetAudience: "Ideal for couples seeking a romantic adventure, photography enthusiasts, and travelers wanting a unique perspective of Marrakech.",
            uniqueSellingPoints: [
                "Exclusively restored 1960s Vespa sidecars with premium safety features",
                "Professional drivers with extensive local knowledge and photography skills",
                "Private customizable tours for intimate experiences",
                "Professional photo package included with every tour",
                "Luxury amenities including Bluetooth helmets and premium towels"
            ],
            premiumAddons: [
                { name: "Extended Tour", price: 40, description: "Additional hour including stops at hidden viewpoints" },
                { name: "Sunset Experience", price: 30, description: "Evening tour timed for golden hour photography" },
                { name: "Professional Photo Shoot", price: 60, description: "Additional 20 professionally edited photos" }
            ],
            importantNotes: [
                "Weather-dependent experience with alternative options if needed",
                "Weight limit strictly enforced for passenger safety",
                "Tours operate daily from 9am to 6pm except Friday prayers",
                "Advance booking recommended especially for weekend dates"
            ],
            whatToExpect: "Your adventure begins with a warm welcome at your accommodation where your driver will conduct a safety briefing and discuss your preferred route. You'll then climb aboard our meticulously restored 1960s Vespa sidecar, equipped with premium safety features and Bluetooth communication. The journey takes you through the elegant Art Deco district of Gueliz, showcasing colonial-era architecture, before continuing along the ancient ramparts of the Medina for breathtaking panoramic views. Throughout the tour, your guide will share fascinating stories about Marrakech while stopping at photogenic locations for professional-quality photos.",
            authenticMoroccanElements: [
                "Vintage Italian scooter culture adapted to Moroccan lifestyle",
                "Stories of Marrakech's evolution from colonial era to present",
                "Views of traditional palm groves contrasting with modern districts",
                "Insights into local transportation and daily life",
                "Photography of authentic neighborhood scenes away from tourist crowds"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Italian", "Spanish"],
            accessibility: "Not suitable for individuals with mobility challenges or balance issues. Strict weight limit of 120kg/265lbs applies.",
            seasonalNotes: "Spring and autumn offer ideal temperatures for comfortable touring. Summer tours start early to avoid midday heat. Winter tours include light blankets for warmth."
        },
        {
            id: "cr-03",
            title: "Ultimate Street Food Tasting Trail",
            subtitle: "An epicurean journey through the flavors of Marrakech with 12+ authentic tastings led by passionate local food experts",
            price: 35,
            rating: 4.8,
            reviews: 0,
            category: "City Roaming",
            image: "/Ultimate Street Food Tasting Trail.jpg",
            images: [
                "/Ultimate Street Food Tasting Trail.jpg",
                "/Ultimate Street Food Tasting Trail.jpg",
                "/Ultimate Street Food Tasting Trail.jpg",
                "/Ultimate Street Food Tasting Trail.jpg"
            ],
            duration: "3 hours",
            features: ["12+ Authentic Tastings", "Small Luxury Group", "Dinner Substitute", "Expert Food Guide", "Cultural Stories"],
            location: "Old Medina",
            tags: ["City Tours", "Food & Drink", "Cultural", "Luxury"],
            host: {
                name: "Leila Amellah",
                image: "/localexpert.jpg",
                bio: "Celebrity chef and food anthropologist with 20+ years documenting Moroccan culinary traditions. Winner of multiple international food awards and author of 'Flavors of the Medina.'",
                verified: true
            },
            description: "Embark on an extraordinary culinary adventure through the aromatic alleyways of Marrakech's Old Medina. Led by award-winning chef Leila Amellah, this exclusive tasting experience introduces you to 12+ authentic Moroccan delicacies, from slow-roasted mechoui lamb to delicate msemen pancakes, each paired with captivating stories of culinary heritage and cultural significance.",
            included: [
                "12+ premium food tastings from renowned local vendors",
                "Bottled water and traditional mint tea service",
                "Expert food guide with culinary expertise and storytelling",
                "Luxury foodie map of the Medina",
                "Recipe cards for featured dishes",
                "Premium hand sanitizer and napkins throughout"
            ],
            exclusions: [
                "Alcoholic beverages",
                "Transportation to/from the Medina",
                "Additional food purchases",
                "Gratuities for your guide (recommended but not required)"
            ],
            meetingPoint: "Central location in the heart of the Medina, exact address and detailed directions provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Comfortable walking shoes for cobblestone streets",
                "Openness to trying diverse local foods and spices",
                "No severe food allergies (please inform us in advance)",
                "Appetite for an extensive tasting experience"
            ],
            ageRestrictions: "Suitable for ages 12 and up. Children under 16 must be accompanied by an adult.",
            whatToBring: [
                "Empty stomach ready for culinary adventure",
                "Comfortable walking shoes",
                "Small bag for personal items",
                "Camera to document delicious moments"
            ],
            experienceHighlights: [
                "Authentic local street food tasting with celebrity chef",
                "Expert guide with deep culinary knowledge and stories",
                "Cultural immersion through food and tradition",
                "Access to renowned vendors unknown to typical tourists",
                "Comprehensive tasting of 12+ Moroccan specialties"
            ],
            additionalInfo: "The tour involves moderate walking on uneven surfaces. Vegetarian, vegan, and gluten-free options available with advance notice. Please inform us of any dietary restrictions when booking.",
            itinerary: [
                { time: "18:00", title: "Welcome & Appetizers", description: "Fresh olives, preserved lemons, and traditional msemen pancakes with honey" },
                { time: "18:30", title: "Street Soup Experience", description: "Optional snail soup and harira (traditional soup) with fresh bread" },
                { time: "19:00", title: "Mechoui Alley", description: "Slow-roasted lamb and beef with cumin and saffron" },
                { time: "19:30", title: "Sweet Delights", description: "Chebakia (honey pastries) and sellou (traditional almond cookie)" },
                { time: "20:00", title: "Spice Market", description: "Saffron tea and spiced nuts from family-owned vendors" },
                { time: "20:30", title: "Grand Finale", description: "Spiced mint tea ceremony on private rooftop with panoramic views" }
            ],
            minGroupSize: 2,
            maxGroupSize: 6,
            targetAudience: "Perfect for food enthusiasts, culinary travelers, and anyone eager to experience authentic Moroccan flavors through expert guidance.",
            uniqueSellingPoints: [
                "Led by celebrity chef and cookbook author with international recognition",
                "Access to exclusive vendors and family-owned establishments",
                "Comprehensive tasting of 12+ authentic specialties",
                "Cultural storytelling with each dish and ingredient",
                "Luxury amenities including premium foodie map and recipe cards"
            ],
            premiumAddons: [
                { name: "Wine Pairing", price: 25, description: "Carefully selected Moroccan wines with each course" },
                { name: "Cooking Class Add-on", price: 40, description: "Extend your experience with hands-on cooking lesson" },
                { name: "Private Chef Experience", price: 120, description: "One-on-one culinary session with Chef Leila" }
            ],
            importantNotes: [
                "Vegetarian, vegan, and gluten-free options available with 48-hour notice",
                "Please inform us of any food allergies or dietary restrictions",
                "Tours operate daily except during major Islamic holidays",
                "Meeting point details sent 24 hours before tour with backup contact"
            ],
            whatToExpect: "Your culinary journey begins with a warm welcome from award-winning Chef Leila, who will share her passion for Moroccan cuisine. You'll navigate the aromatic alleyways of the Old Medina, stopping at exclusive family-owned establishments that have perfected their recipes over generations. Each tasting is paired with captivating stories of culinary heritage, from the significance of saffron in Moroccan culture to the art of slow-cooking mechoui. The experience culminates with a traditional mint tea ceremony on a private rooftop, offering panoramic views of the illuminated city.",
            authenticMoroccanElements: [
                "Recipes passed down through generations of family chefs",
                "Ingredients sourced directly from local markets and cooperatives",
                "Traditional cooking techniques using clay tagines and wood fires",
                "Cultural significance of each dish and spice",
                "Hospitality rituals centered around food and tea ceremonies"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Limited accessibility due to narrow alleyways and steps. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter evenings offer perfect temperatures for outdoor dining. Summer tours start earlier to avoid extreme heat. Ramadan may affect vendor hours and availability."
        },
        {
            id: "cr-04",
            title: "Yves Saint Laurent & Majorelle Garden VIP",
            subtitle: "An exclusive artistic journey through Yves Saint Laurent's muse and Morocco's most enchanting botanical sanctuary",
            price: 40,
            rating: 4.8,
            reviews: 0,
            category: "City Roaming",
            image: "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
            images: [
                "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
                "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
                "/Yves Saint Laurent & Majorelle Garden VIP.jpg",
                "/Yves Saint Laurent & Majorelle Garden VIP.jpg"
            ],
            duration: "3 hours",
            features: ["VIP Skip-the-Line Access", "Botanic Garden", "Fashion History", "Luxury Transfer", "Expert Guide"],
            location: "Guéliz",
            tags: ["City Tours", "Culture", "Art", "Luxury"],
            host: {
                name: "Sophia Benjelloun",
                image: "/localexpert.jpg",
                bio: "Art historian and fashion curator with expertise in Yves Saint Laurent's Moroccan period. Regular contributor to international fashion publications and museums.",
                verified: true
            },
            description: "Step into the enchanting world where haute couture meets exotic botany. This exclusive VIP experience offers unparalleled access to the legendary Majorelle Garden and Yves Saint Laurent Museum, with skip-the-line privileges and expert insights into the designer's profound connection with Morocco.",
            included: [
                "Luxury air-conditioned transportation with meet-and-greet",
                "VIP skip-the-line entrance to both venues",
                "Expert art and fashion historian guide",
                "Professional headsets for clear audio",
                "Complimentary coffee or tea at the garden café",
                "Exclusive YSL Museum guidebook",
                "Priority seating during guided portions"
            ],
            exclusions: [
                "Personal transportation to/from pickup location",
                "Meals and drinks except as specified",
                "Souvenir purchases",
                "Gratuities for your guide (recommended but not required)"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking with dedicated chauffeur contact",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 72 hours before the experience. Within 72 hours, 50% refund applies.",
            requirements: [
                "Comfortable walking shoes for garden paths",
                "Valid passport or ID for museum entry",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Interest in art, fashion, or botany"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Camera for photo opportunities",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Comfortable walking shoes",
                "Light jacket for air-conditioned museums"
            ],
            experienceHighlights: [
                "VIP skip-the-line access to Majorelle Garden and YSL Museum",
                "Expert guide with deep knowledge of fashion history and botany",
                "Exclusive insights into YSL's Moroccan inspiration and creative process",
                "Luxury transportation with dedicated chauffeur",
                "Complimentary refreshments at the iconic garden café"
            ],
            additionalInfo: "Transport is included with luxury air-conditioned vehicles. Gardens may have limited access during special events, in which case we'll provide alternative arrangements. Photography is permitted in the garden but restricted in the museum.",
            itinerary: [
                { time: "09:00", title: "Luxury Pickup", description: "Meet your dedicated chauffeur at your accommodation with bottled water" },
                { time: "09:30", title: "Majorelle Garden VIP Entry", description: "Exclusive access to the 12-acre botanical masterpiece with expert commentary" },
                { time: "10:45", title: "Garden Café Interlude", description: "Complimentary coffee or tea at YSL's favorite spot overlooking the lagoon" },
                { time: "11:15", title: "YSL Museum Exclusive Entry", description: "Skip-the-line access to the designer's former studio and rotating exhibitions" },
                { time: "12:15", title: "Designer's Perspective Tour", description: "In-depth exploration of YSL's Moroccan collections and creative inspirations" },
                { time: "13:00", title: "Return Journey", description: "Luxury transport back to your accommodation with photo sharing" }
            ],
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "Ideal for art lovers, fashion enthusiasts, garden admirers, and culturally curious travelers seeking exclusive access.",
            uniqueSellingPoints: [
                "VIP skip-the-line access saving up to 90 minutes of waiting",
                "Expert guide with specialized knowledge of YSL's Moroccan period",
                "Luxury transportation with dedicated professional chauffeur",
                "Complimentary refreshments at the iconic garden café",
                "Exclusive museum guidebook and priority seating"
            ],
            premiumAddons: [
                { name: "Private Curator Tour", price: 75, description: "One-hour behind-the-scenes tour with museum curator" },
                { name: "Fashion Photography Session", price: 60, description: "Professional photo shoot in the garden's most photogenic spots" },
                { name: "Extended Art Workshop", price: 45, description: "Hands-on workshop creating YSL-inspired sketches" }
            ],
            importantNotes: [
                "Museum photography restricted to designated areas only",
                "Garden paths include steps and uneven surfaces",
                "Comfortable walking shoes essential for full enjoyment",
                "Weather-independent experience with indoor alternatives if needed"
            ],
            whatToExpect: "Your exclusive journey begins with a seamless pickup by your dedicated chauffeur in a luxury air-conditioned vehicle. Upon arrival at the Majorelle Garden, you'll bypass the queues with VIP access, entering this botanical wonderland where Yves Saint Laurent found his greatest inspiration. Your expert guide will share fascinating stories about Jacques Majorelle's artistic vision and YSL's transformation of the space. The experience includes a delightful coffee or tea break at the garden café, YSL's favorite spot. Continuing to the museum, you'll enjoy priority entry to explore the designer's former studio, personal collections, and temporary exhibitions with unparalleled insight into his creative process and Moroccan influences.",
            authenticMoroccanElements: [
                "Jacques Majorelle's fusion of Art Deco and Moroccan architectural styles",
                "Indigenous plant species representing Morocco's diverse ecosystems",
                "YSL's incorporation of Moroccan motifs in haute couture designs",
                "Traditional Moroccan craftsmanship displayed in museum exhibits",
                "Café culture reflecting authentic Moroccan hospitality traditions"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Italian", "Spanish"],
            accessibility: "Partially accessible with paved paths in the garden. Museum has wheelchair access but some exhibition areas have steps. Please contact us to discuss specific needs.",
            seasonalNotes: "Spring offers blooming flowers and perfect temperatures. Summer requires early morning scheduling for comfort. Autumn provides comfortable conditions and fewer crowds. Winter visits offer unique lighting for photography."
        }
    ],
    cityTrips: [
        {
            id: "ct-01",
            title: "Agafay Desert: Sunset, Camel & Dinner Show",
            subtitle: "An enchanting escape to Morocco's mystical 'Stone Desert' with luxury camel rides, gourmet Berber cuisine, and mesmerizing traditional performances",
            price: 55,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
            images: [
                "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
                "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
                "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg",
                "/Agafay Desert Sunset, Camel & Dinner Show show something luxury.jpg"
            ],
            duration: "6 hours",
            features: ["Stone Desert", "Luxury Camel Ride", "Gourmet Berber Feast", "Live Music", "Fire Eater", "Stargazing"],
            location: "Agafay Desert",
            tags: ["Adventures", "Excursions", "Luxury", "Romantic"],
            host: {
                name: "Ahmed El Fassi",
                image: "/localexpert.jpg",
                bio: "Third-generation desert guide with deep knowledge of Berber traditions and storytelling. Specializes in luxury desert experiences blending authenticity with comfort.",
                verified: true
            },
            description: "Escape to the mystical 'Stone Desert' of Agafay for an unforgettable evening of luxury and tradition. Experience the magic of a sunset camel ride across golden dunes, savor an exquisite Berber feast under the stars, and be captivated by authentic Gnawa music and fire performances in this otherworldly landscape.",
            included: [
                "Luxury air-conditioned transport with bottled water",
                "Professional English-speaking guide",
                "Sunset camel ride with premium saddles",
                "Gourmet 3-course Berber feast with wine pairings",
                "Traditional entertainment (Gnawa music, fire show)",
                "Blankets and cushions for stargazing",
                "Professional photography service",
                "Desert survival kit (lantern, tissues, hand sanitizer)"
            ],
            exclusions: [
                "Alcoholic beverages (available for purchase)",
                "Personal transportation to/from pickup location",
                "Gratuities for performers (recommended but not required)",
                "Additional activities beyond program"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking with dedicated driver contact",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 72 hours before the experience. Within 72 hours, 50% refund applies.",
            requirements: [
                "Comfortable clothing suitable for desert climate",
                "Closed-toe shoes for camel riding safety",
                "Layered clothing for temperature changes",
                "No serious mobility issues (light walking required)"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Light jacket or sweater for cool evenings",
                "Sun protection (hat, sunglasses, sunscreen) for afternoon",
                "Camera for capturing stunning desert vistas",
                "Cash for optional purchases or gratuities"
            ],
            experienceHighlights: [
                "Magical sunset camel ride across golden stone dunes",
                "Gourmet traditional Berber feast with premium ingredients",
                "Authentic Gnawa music and mesmerizing fire eater performance",
                "Luxury transportation with professional driver",
                "Stargazing session with traditional Berber storytelling"
            ],
            additionalInfo: "The desert gets significantly cooler after sunset. We provide blankets but recommend bringing a jacket. Vegetarian, vegan, and special dietary options available with advance notice. Photography is encouraged throughout the experience.",
            itinerary: [
                { time: "16:00", title: "Luxury Pickup", description: "Meet your dedicated driver at your accommodation with refreshments" },
                { time: "17:00", title: "Scenic Desert Drive", description: "Journey through the Palmeraie and into the Stone Desert landscape" },
                { time: "17:30", title: "Sunset Camel Ride", description: "Luxury camel trek with premium saddles to watch the sun descend" },
                { time: "18:30", title: "Berber Camp Setup", description: "Arrival at exclusive campsite with traditional decorations" },
                { time: "19:00", title: "Welcome Feast", description: "Gourmet 3-course Berber dinner with traditional music accompaniment" },
                { time: "20:30", title: "Entertainment Showcase", description: "Gnawa musicians and fire eater performance under the stars" },
                { time: "21:30", title: "Stargazing & Storytelling", description: "Berber tales shared while admiring the brilliant desert night sky" },
                {
                    time: "22:00", title: "Return Journey", description: "Comfortable transport back to your accommodation"
                }
            ],
            minGroupSize: 2,
            maxGroupSize: 12,
            targetAudience: "Perfect for couples seeking romance, families wanting cultural experiences, and travelers desiring authentic Moroccan desert adventures.",
            uniqueSellingPoints: [
                "Exclusive access to premium desert campsites away from crowds",
                "Gourmet dining with locally-sourced ingredients and wine pairings",
                "Luxury camel saddles for maximum comfort during rides",
                "Professional photographers capturing magical moments",
                "Expert guides with deep Berber cultural knowledge"
            ],
            premiumAddons: [
                { name: "Private Desert Experience", price: 180, description: "Exclusive experience for your group with personalized service" },
                { name: "Astrology Session", price: 35, description: "Professional stargazing with telescope and astronomy guide" },
                { name: "Premium Wine Pairing", price: 25, description: "Curated Moroccan wines with each course of your feast" }
            ],
            importantNotes: [
                "Evening temperatures can drop significantly after sunset",
                "Camel riding requires basic balance and mobility",
                "Dietary restrictions accommodated with 48-hour advance notice",
                "Transportation includes luxury vehicles with experienced drivers"
            ],
            whatToExpect: "Your luxury desert adventure begins with a seamless pickup by your dedicated driver in a premium air-conditioned vehicle. As you journey through the iconic Palmeraie palm groves toward the Agafay Desert, your guide will share fascinating insights about the landscape and Berber culture. Upon arrival, you'll embark on a serene sunset camel ride across the golden stone dunes, a truly magical experience. The evening continues at our exclusive desert camp, where you'll be welcomed with traditional mint tea before enjoying a sumptuous 3-course Berber feast featuring premium local ingredients. As darkness falls, traditional Gnawa musicians will enchant you with their hypnotic rhythms, followed by a mesmerizing fire eater performance. The evening concludes with Berber storytelling under the brilliant desert stars, creating memories that will last a lifetime.",
            authenticMoroccanElements: [
                "Traditional Berber hospitality and customs",
                "Authentic camel riding techniques passed through generations",
                "Gnawa musical traditions with spiritual significance",
                "Local ingredients sourced from regional cooperatives",
                "Storytelling preserving ancient Berber oral history"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "German"],
            accessibility: "Limited accessibility due to desert terrain and camel riding. Not suitable for individuals with mobility challenges. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer comfortable daytime temperatures but cool evenings. Spring and autumn provide ideal conditions year-round. Summer experiences start earlier to avoid extreme heat."
        },
        {
            id: "ct-02",
            title: "Atlas Mountains & Ourika Valley Day Trip",
            subtitle: "A breathtaking journey through Morocco's highest mountain range with cascading waterfalls, traditional Berber villages, and authentic cultural immersion",
            price: 30,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Atlas Mountains & Ourika Valley Day Trip.jpg",
            images: [
                "/Atlas Mountains & Ourika Valley Day Trip.jpg",
                "/Atlas Mountains & Ourika Valley Day Trip.jpg",
                "/Atlas Mountains & Ourika Valley Day Trip.jpg",
                "/Atlas Mountains & Ourika Valley Day Trip.jpg"
            ],
            duration: "Full Day",
            features: ["Scenic Mountain Drives", "Waterfalls", "Berber House Visit", "Cultural Immersion", "Nature"],
            location: "High Atlas",
            tags: ["Adventures", "Excursions", "Nature", "Cultural"],
            host: {
                name: "Mohammed Ait Brahim",
                image: "/localexpert.jpg",
                bio: "Native Berber guide from a mountain village with 15+ years of experience sharing his homeland's natural beauty and cultural heritage with international visitors.",
                verified: true
            },
            description: "Embark on an extraordinary journey through the majestic High Atlas Mountains, Morocco's highest range. Experience the refreshing beauty of cascading waterfalls at Setti Fatma, immerse yourself in authentic Berber culture during a traditional home visit, and witness breathtaking mountain vistas that will leave you spellbound.",
            included: [
                "Luxury 4x4 transportation with bottled water",
                "Expert bilingual local guide from the mountains",
                "Traditional mint tea ceremony at Berber home",
                "Entrance fees to all visited sites",
                "Professional headsets for clear communication",
                "First aid kit and emergency support",
                "Cultural insight booklet with local stories"
            ],
            exclusions: [
                "Meals (lunch available for extra charge)",
                "Personal transportation to/from pickup location",
                "Hiking equipment (walking sticks available for rent)",
                "Gratuities for your guide (recommended but not required)"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking with dedicated driver contact",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Comfortable hiking shoes with good grip",
                "Modest clothing covering shoulders and knees for village visits",
                "Layered clothing for temperature variations",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Capacity for moderate hiking (approximately 3km)"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Sturdy hiking shoes with ankle support",
                "Layered clothing for changing mountain temperatures",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Water bottle (refill stations available)",
                "Small backpack for personal items",
                "Camera for capturing stunning mountain vistas"
            ],
            experienceHighlights: [
                "Stunning Atlas Mountain scenery with panoramic viewpoints",
                "Visit to traditional Berber home with authentic hospitality",
                "Refreshing waterfall hike at Setti Fatma",
                "Luxury 4x4 transportation with experienced mountain driver",
                "Cultural insights from native Berber guide"
            ],
            additionalInfo: "The hike involves moderate walking on uneven terrain with some steep sections. Lunch can be arranged for an additional fee with advance notice. Photography is encouraged but please be respectful of local residents.",
            itinerary: [
                { time: "08:00", title: "Luxury Pickup", description: "Meet your dedicated driver at your accommodation with refreshments" },
                { time: "09:00", title: "Scenic Mountain Drive", description: "Journey through the Ourika Valley with breathtaking mountain vistas" },
                { time: "11:00", title: "Traditional Berber Village", description: "Visit to authentic mountain community with cultural exchange" },
                { time: "11:30", title: "Waterfall Hike", description: "Moderate walk to cascading waterfalls at Setti Fatma" },
                { time: "13:00", title: "Berber Hospitality", description: "Traditional mint tea ceremony in local family home" },
                { time: "14:00", title: "Mountain Panorama", description: "Visit to scenic viewpoint with panoramic Atlas views" },
                { time: "16:00", title: "Return Journey", description: "Scenic drive back to Marrakech with photo stops" }
            ],
            minGroupSize: 2,
            maxGroupSize: 10,
            targetAudience: "Ideal for nature lovers, cultural explorers, active travelers, and anyone seeking authentic Moroccan mountain experiences.",
            uniqueSellingPoints: [
                "Native Berber guide sharing personal family connections to the region",
                "Authentic cultural exchanges with traditional mountain communities",
                "Luxury 4x4 transportation designed for mountain terrain",
                "Small group sizes for personalized attention",
                "Comprehensive cultural materials and local storytelling"
            ],
            premiumAddons: [
                { name: "Private Guide Experience", price: 80, description: "Exclusive tour with personal Berber guide and vehicle" },
                { name: "Traditional Lunch", price: 15, description: "Authentic Berber meal in mountain village setting" },
                { name: "Photography Workshop", price: 35, description: "Professional tips for capturing mountain landscapes" }
            ],
            importantNotes: [
                "Mountain weather can change rapidly - layered clothing essential",
                "Hiking involves moderate terrain with some steep sections",
                "Village visits require respect for local customs and traditions",
                "Transportation includes 4x4 vehicles suitable for mountain roads"
            ],
            whatToExpect: "Your mountain adventure begins with a comfortable pickup by your dedicated driver in a premium 4x4 vehicle. As you ascend through the Ourika Valley, your native Berber guide will share fascinating insights about the region's geology, flora, and cultural heritage. The journey includes a visit to an authentic mountain village where you'll experience genuine Berber hospitality during a traditional mint tea ceremony. The highlight is a refreshing hike to the famous Setti Fatma waterfalls, where you can cool off in the natural pools. The day concludes with a visit to a scenic mountain viewpoint offering panoramic vistas of the High Atlas range before returning to Marrakech.",
            authenticMoroccanElements: [
                "Traditional Berber architecture and village life",
                "Authentic mint tea ceremonies and hospitality customs",
                "Local knowledge of mountain flora and medicinal plants",
                "Stories of Berber history and resistance traditions",
                "Traditional crafts and agricultural practices"
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Berber", "Arabic"],
            accessibility: "Limited accessibility due to mountain terrain and hiking requirements. Not suitable for individuals with mobility challenges. Please contact us to discuss specific needs.",
            seasonalNotes: "Spring offers blooming wildflowers and comfortable temperatures. Summer requires early departure to avoid heat. Autumn provides clear skies and harvest season experiences. Winter visits showcase snow-capped peaks but require warm clothing."
        },
        {
            id: "ct-03",
            title: "Essaouira Coastal Escape",
            subtitle: "Discover Morocco's most charming coastal gem with UNESCO medina, windsurfing beaches, and the world's finest argan oil production",
            price: 35,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Essaouira Coastal Escape.jpg",
            images: [
                "/Essaouira Coastal Escape.jpg",
                "/Essaouira Coastal Escape.jpg",
                "/Essaouira Coastal Escape.jpg",
                "/Essaouira Coastal Escape.jpg"
            ],
            duration: "Full Day",
            features: ["UNESCO Medina", "Coastal Beaches", "Seafood", "Argan Oil Cooperatives", "Art Galleries", "Windsurfing"],
            location: "Atlantic Coast",
            tags: ["Excursions", "Coastal", "UNESCO", "Cultural"],
            host: {
                name: "Yasmine Filali",
                image: "/localexpert.jpg",
                bio: "Essaouira local with deep knowledge of the city's maritime history, art scene, and sustainable tourism initiatives. Specializes in authentic coastal experiences.",
                verified: true
            },
            description: "Escape to the enchanting coastal town of Essaouira, where Atlantic breezes carry the scent of salt and argan oil. This UNESCO World Heritage destination captivates visitors with its perfectly preserved medina, thriving art scene, and some of the world's best windsurfing conditions. Experience the authentic charm of Morocco's most laid-back city.",
            included: [
                "Luxury air-conditioned transport with bottled water",
                "Expert bilingual local guide from Essaouira",
                "Entrance fees to all visited sites",
                "Professional headsets for clear communication",
                "Visit to women's argan oil cooperative",
                "Cultural insight booklet with local recommendations",
                "Emergency support and first aid kit"
            ],
            exclusions: [
                "Meals and drinks except as specified",
                "Personal transportation to/from pickup location",
                "Optional activities beyond program",
                "Gratuities for your guide (recommended but not required)"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking with dedicated driver contact",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Comfortable walking shoes for cobblestone streets",
                "Modest clothing covering shoulders and knees for cultural sites",
                "Layered clothing for changing coastal temperatures",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Capacity for moderate walking (approximately 2km)"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Comfortable walking shoes with good grip",
                "Light jacket or windbreaker for coastal breezes",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Swimwear if planning beach activities",
                "Camera for capturing coastal beauty",
                "Cash for optional purchases or gratuities"
            ],
            experienceHighlights: [
                "Historic Portuguese ramparts with panoramic ocean views",
                "Fresh seafood at the bustling fishing port",
                "Thriving art galleries featuring local and international artists",
                "Women's argan oil cooperative visit with fair-trade insights",
                "UNESCO World Heritage medina exploration"
            ],
            additionalInfo: "Essaouira is known for its strong winds and cool temperatures. Bring a windbreaker. Seafood lunch can be arranged for an additional fee with advance notice. Photography is encouraged throughout the experience.",
            itinerary: [
                { time: "07:30", title: "Luxury Pickup", description: "Meet your dedicated driver at your accommodation with refreshments" },
                { time: "08:00", title: "Scenic Coastal Drive", description: "Journey along the Atlantic coast with stops for photo opportunities" },
                { time: "11:00", title: "UNESCO Medina Exploration", description: "Guided walk through the perfectly preserved historic quarter" },
                { time: "12:30", title: "Fishing Port Experience", description: "Watch local fishermen and sample fresh seafood (optional purchase)" },
                { time: "13:30", title: "Argan Oil Cooperative", description: "Visit women's cooperative learning traditional production methods" },
                { time: "14:30", title: "Art Gallery Tour", description: "Explore local and international contemporary art spaces" },
                { time: "15:30", title: "Beach & Windsurfing Views", description: "Visit popular beach with optional windsurfing demonstrations" },
                {
                    time: "17:00", title: "Return Journey", description: "Comfortable transport back to your accommodation"
                }
            ],
            minGroupSize: 2,
            maxGroupSize: 10,
            targetAudience: "Perfect for art lovers, food enthusiasts, cultural explorers, and anyone seeking a relaxed coastal atmosphere with authentic Moroccan charm.",
            uniqueSellingPoints: [
                "Local guide with deep connections to Essaouira's art and culture scene",
                "UNESCO medina exploration with insider knowledge and stories",
                "Women's argan oil cooperative visit supporting fair-trade practices",
                "Luxury transportation with experienced coastal route drivers",
                "Comprehensive cultural materials and local artist recommendations"
            ],
            premiumAddons: [
                { name: "Private Coastal Experience", price: 95, description: "Exclusive tour with personal local guide and vehicle" },
                { name: "Gourmet Seafood Lunch", price: 25, description: "Fresh catch prepared by renowned local restaurant" },
                { name: "Windsurfing Lesson", price: 45, description: "Professional instruction at world-class windsurfing beach" }
            ],
            importantNotes: [
                "Coastal weather can be cool and windy year-round",
                "Medina streets include steps and uneven surfaces",
                "Fishing port has strong ocean smells and bird activity",
                "Art galleries may be closed on Mondays or during festivals"
            ],
            whatToExpect: "Your coastal adventure begins with a comfortable pickup by your dedicated driver in a premium air-conditioned vehicle. The scenic journey along the Atlantic coast offers stunning ocean views and photo opportunities. Upon arrival in Essaouira, you'll explore the perfectly preserved UNESCO World Heritage medina with your expert local guide, learning about the city's unique blend of Portuguese, French, and Moroccan architectural influences. The experience includes a visit to the bustling fishing port where you can observe local fishermen and sample the day's catch. You'll then visit a women's argan oil cooperative to learn about traditional production methods and fair-trade practices. The afternoon features a curated tour of Essaouira's thriving art galleries, showcasing both local and international contemporary works. The day concludes with time at one of the world's premier windsurfing beaches before returning to Marrakech.",
            authenticMoroccanElements: [
                "UNESCO World Heritage medina with authentic architecture",
                "Traditional fishing techniques and daily port life",
                "Women's cooperatives producing argan oil using ancient methods",
                "Contemporary Moroccan art scene blending traditional and modern",
                "Coastal cuisine featuring fresh Atlantic seafood"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Partially accessible with main attractions at ground level. Some medina areas have steps and uneven surfaces. Please contact us to discuss specific needs.",
            seasonalNotes: "Spring and autumn offer ideal temperatures for walking and outdoor activities. Summer brings stronger winds perfect for watersports but can be busier. Winter provides comfortable conditions with fewer crowds and dramatic coastal scenery."
        },
        {
            id: "ct-04",
            title: "Ouzoud Waterfalls: Nature Hike & Boat Ride",
            subtitle: "Experience North Africa's most spectacular waterfall cascade with hiking trails, traditional boat rides, and encounters with wild Barbary macaques",
            price: 30,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
            images: [
                "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
                "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
                "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg",
                "/Ouzoud Waterfalls Nature Hike & Boat Ride.jpg"
            ],
            duration: "Full Day",
            features: ["Highest Falls in North Africa", "Wild Monkeys", "Boat Ride", "Hiking Trails", "Nature Photography"],
            location: "Middle Atlas",
            tags: ["Adventures", "Excursions", "Nature", "Photography"],
            host: {
                name: "Rashid Amellah",
                image: "/localexpert.jpg",
                bio: "Certified mountain guide and wildlife photographer with 20+ years exploring the Atlas Mountains. Specialist in waterfall ecosystems and Barbary macaque behavior.",
                verified: true
            },
            description: "Journey to the breathtaking Ouzoud Waterfalls, North Africa's highest cascading waterfall at 110 meters. This spectacular natural wonder plunges through three tiers into emerald pools below, surrounded by lush olive groves and inhabited by playful wild Barbary macaques. Experience the majesty with guided hikes, traditional boat rides, and unforgettable photo opportunities.",
            included: [
                "Luxury 4x4 transportation with bottled water",
                "Expert certified mountain guide and nature interpreter",
                "Professional headsets for clear communication",
                "Traditional boat ride at the base of falls",
                "Entrance fees to all visited areas",
                "First aid kit and emergency support",
                "Nature identification booklet with wildlife guide",
                "Professional photography tips and viewpoints"
            ],
            exclusions: [
                "Meals and drinks except as specified",
                "Personal transportation to/from pickup location",
                "Hiking equipment (walking sticks available for rent)",
                "Gratuities for your guide (recommended but not required)"
            ],
            meetingPoint: "Your hotel or riad in Marrakech, exact pickup location and timing provided upon booking with dedicated driver contact",
            endingPoint: "Same as pickup location",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Sturdy hiking boots with ankle support",
                "Weather-appropriate clothing in layers",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Capacity for moderate hiking (approximately 4km)",
                "No fear of heights (some viewpoints are elevated)"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            whatToBring: [
                "Sturdy hiking boots with ankle support",
                "Layered clothing for changing mountain temperatures",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Water bottle (refill stations available)",
                "Small backpack for personal items",
                "Camera for capturing stunning waterfall vistas",
                "Change of clothes for boat ride (optional)"
            ],
            experienceHighlights: [
                "Spectacular 110m waterfalls - highest in North Africa",
                "Traditional boat ride experience at the base of cascades",
                "Wild Barbary macaque sightings in their natural habitat",
                "Guided hiking trails through olive groves and forest",
                "Professional photography tips from expert nature guide"
            ],
            additionalInfo: "The hike involves moderate walking with some steep and uneven sections. Bring water and wear comfortable shoes. Professional walking sticks available for rent. Photography is encouraged with guidance from our expert nature guide.",
            itinerary: [
                { time: "07:00", title: "Luxury Pickup", description: "Meet your dedicated driver at your accommodation with refreshments" },
                { time: "08:00", title: "Scenic Mountain Drive", description: "Journey through the Middle Atlas with stops for photo opportunities" },
                { time: "11:00", title: "Waterfall Viewpoint", description: "Panoramic overlook with interpretive guide on waterfall formation" },
                { time: "11:30", title: "Hiking Descent", description: "Guided trail through olive groves to waterfall base" },
                { time: "12:30", title: "Barbary Macaque Encounter", description: "Observation of wild monkeys in their natural habitat" },
                { time: "13:00", title: "Traditional Boat Ride", description: "Scenic boat trip at the base of the cascading falls" },
                { time: "14:00", title: "Picnic Lunch Spot", description: "Scenic riverside location with mountain views" },
                { time: "15:00", title: "Hiking Ascent", description: "Return trail with different perspectives of the falls" },
                { time: "16:00", title: "Photography Workshop", description: "Professional tips for capturing waterfall beauty" },
                {
                    time: "17:00", title: "Return Journey", description: "Comfortable transport back to your accommodation"
                }
            ],
            minGroupSize: 2,
            maxGroupSize: 10,
            targetAudience: "Ideal for nature enthusiasts, hikers, wildlife watchers, photographers, and anyone seeking spectacular natural beauty in Morocco.",
            uniqueSellingPoints: [
                "Certified mountain guide with wildlife expertise and photography skills",
                "Traditional boat ride experience unique to this location",
                "Wild Barbary macaque encounters in protected habitat",
                "Luxury 4x4 transportation designed for mountain terrain",
                "Professional photography instruction with prime viewpoints"
            ],
            premiumAddons: [
                { name: "Private Guide Experience", price: 90, description: "Exclusive tour with personal certified guide and vehicle" },
                { name: "Gourmet Picnic Lunch", price: 20, description: "Locally-sourced picnic with waterfall views" },
                { name: "Extended Photography Session", price: 40, description: "Additional hour with professional photography instruction" }
            ],
            importantNotes: [
                "Hiking involves steep terrain with some exposed sections",
                "Barbary macaques are wild animals - observe from safe distance",
                "Waterfall mist can make surfaces slippery - wear appropriate footwear",
                "Mountain weather can change rapidly - layered clothing essential"
            ],
            whatToExpect: "Your waterfall adventure begins with a comfortable pickup by your dedicated driver in a premium 4x4 vehicle. The scenic journey through the Middle Atlas Mountains offers stunning vistas and photo opportunities. Upon arrival, your expert guide will provide insights into the geological formation of these magnificent falls and the ecosystem they support. The descent trail winds through ancient olive groves, offering different perspectives of the cascading water. You'll have opportunities to observe wild Barbary macaques in their natural habitat, a rare privilege in North Africa. The highlight is a traditional boat ride at the base of the falls, where you can feel the power and mist of the cascading water. A scenic picnic lunch spot provides time to absorb the natural beauty. The return hike offers different viewpoints, and your guide will share professional photography tips for capturing the perfect shot. The day concludes with transportation back to Marrakech.",
            authenticMoroccanElements: [
                "Traditional boat designs used by local fishermen for centuries",
                "Ancient olive groves cultivated using Berber agricultural techniques",
                "Barbary macaque conservation efforts by local communities",
                "Local knowledge of waterfall ecosystems and seasonal changes",
                "Traditional Berber trails maintained through generations"
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Limited accessibility due to hiking requirements and natural terrain. Not suitable for individuals with mobility challenges or fear of heights. Please contact us to discuss specific needs.",
            seasonalNotes: "Spring offers maximum water flow and blooming wildflowers. Summer provides comfortable temperatures but reduced water flow. Autumn showcases colorful foliage and comfortable hiking conditions. Winter visits offer dramatic scenery with fewer crowds but require warm clothing."
        },
        {
            id: "ct-05",
            title: "Quad Biking Adrenaline Rush",
            subtitle: "Conquer the rugged landscapes of Palmeraie and Agafay Desert with high-performance quads, expert guidance, and authentic Berber hospitality",
            price: 45,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Quad Biking Adrenaline Rush.jpg",
            images: [
                "/Quad Biking Adrenaline Rush.jpg",
                "/Quad Biking Adrenaline Rush.jpg",
                "/Quad Biking Adrenaline Rush.jpg",
                "/Quad Biking Adrenaline Rush.jpg"
            ],
            duration: "3 hours",
            features: ["High-Performance Quads", "Professional Safety Gear", "Scenic Desert Landscapes", "Berber Tea Break", "Expert Guide"],
            location: "Palmeraie or Agafay",
            tags: ["Adventures", "Excursions", "Adrenaline", "Desert"],
            host: {
                name: "Karim Zaari",
                image: "/localexpert.jpg",
                bio: "Professional quad biking instructor and desert guide with 15+ years experience. Former motorcycle racer turned adventure tour specialist with extensive knowledge of Moroccan terrain.",
                verified: true
            },
            description: "Unleash your inner adventurer on a thrilling quad biking expedition through the diverse landscapes surrounding Marrakech. Race across the rocky plains of Agafay Desert and weave through the lush Palmeraie palm groves, experiencing the raw beauty and excitement of Morocco's varied terrain with expert guidance and top-of-the-line equipment.",
            included: [
                "High-performance 250cc quad bikes with premium maintenance",
                "Professional safety gear (helmet, goggles, gloves, chest protector)",
                "Expert certified quad biking instructor and desert guide",
                "Comprehensive safety briefing and basic riding instruction",
                "Refreshments throughout the experience",
                "First aid kit and emergency support vehicle",
                "Professional photography service capturing action shots",
                "Traditional mint tea break in authentic Berber setting"
            ],
            exclusions: [
                "Personal transportation to/from meeting location",
                "Meals and additional beverages beyond refreshments provided",
                "Personal accident insurance (included in base price)",
                "Gratuities for your instructor (recommended but not required)"
            ],
            meetingPoint: "Quad biking center in Palmeraie or Agafay, exact location and directions provided upon booking with dedicated staff contact",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Valid passport or ID for insurance purposes",
                "Minimum age 18 with valid driver's license",
                "No serious medical conditions affecting balance or reaction time",
                "Closed-toe shoes with ankle support (provided if needed)",
                "Comfortable clothing suitable for outdoor physical activity"
            ],
            ageRestrictions: "Suitable for ages 18 and up. Participants must have valid driver's license and weigh under 120kg/265lbs for safety reasons.",
            whatToBring: [
                "Closed-toe shoes with ankle support (sturdy sneakers acceptable)",
                "Sunglasses with retention strap for safety",
                "Long pants or jeans for protection",
                "Light jacket for cooler mornings or evenings",
                "Bandana or scarf to protect from dust",
                "Sunscreen and lip balm for UV protection",
                "Camera or smartphone for capturing adventure memories"
            ],
            experienceHighlights: [
                "Exciting off-road quad biking through diverse desert landscapes",
                "Scenic views of Palmeraie palm groves and Agafay rocky plains",
                "Professional instruction for beginners and experienced riders",
                "Authentic Berber mint tea break in traditional setting",
                "Action photography capturing your adrenaline moments"
            ],
            additionalInfo: "All safety gear is provided and mandatory. No prior experience required but basic driving skills are helpful. Tours operate in all weather except heavy rain or extreme winds. Maximum group size ensures personalized attention.",
            itinerary: [
                { time: "09:00/14:00", title: "Meet & Safety Briefing", description: "Welcome, equipment fitting, and comprehensive safety orientation" },
                { time: "09:30/14:30", title: "Basic Skills Training", description: "Control familiarization and supervised practice in controlled area" },
                { time: "10:00/15:00", title: "Desert Adventure", description: "Thrilling ride through Palmeraie palm groves and Agafay rocky terrain" },
                { time: "11:30/16:30", title: "Berber Tea Experience", description: "Traditional mint tea break in authentic desert camp setting" },
                { time: "12:00/17:00", title: "Advanced Riding", description: "Challenging terrain and skill-building exercises with instructor guidance" },
                { time: "12:30/17:30", title: "Return & Review", description: "Equipment return and action photo sharing with group" }
            ],
            minGroupSize: 2,
            maxGroupSize: 6,
            targetAudience: "Perfect for adventure seekers, thrill lovers, active travelers, and anyone wanting to experience Morocco's desert landscapes from a unique perspective.",
            uniqueSellingPoints: [
                "High-performance 250cc quads with professional maintenance",
                "Expert instructors with racing and desert guiding experience",
                "Diverse terrain including palm groves and rocky desert plains",
                "Authentic Berber hospitality with traditional tea ceremony",
                "Professional action photography capturing your adventure moments"
            ],
            premiumAddons: [
                { name: "Extended Adventure", price: 30, description: "Additional hour exploring hidden desert locations" },
                { name: "Private Group Experience", price: 120, description: "Exclusive tour for your group with personalized instruction" },
                { name: "Professional Photo Package", price: 25, description: "Enhanced photo package with edited action shots" }
            ],
            importantNotes: [
                "All participants must sign liability waiver and provide ID",
                "Weather-dependent activity with alternative arrangements if needed",
                "Strict weight limit of 120kg/265lbs for participant safety",
                "Closed-toe shoes mandatory - rentals available if needed"
            ],
            whatToExpect: "Your adrenaline-packed adventure begins with a warm welcome at our quad biking center, where you'll be fitted with professional safety gear including helmet, goggles, gloves, and chest protector. Your expert instructor will conduct a comprehensive safety briefing and basic skills training in a controlled area, ensuring even beginners feel confident. The thrilling ride takes you through two distinct landscapes - the lush Palmeraie palm groves where you'll weave between towering date palms, and the rugged Agafay Desert where you'll conquer rocky terrain and sandy expanses. Midway through, you'll experience authentic Berber hospitality with a traditional mint tea ceremony in a desert camp setting. The adventure concludes with challenging terrain exercises to test your newfound skills, followed by group photo sharing and equipment return.",
            authenticMoroccanElements: [
                "Traditional Berber tea ceremony with authentic preparation",
                "Desert camp setting reflecting nomadic hospitality traditions",
                "Local guides sharing indigenous knowledge of desert terrain",
                "Quads traversing landscapes significant to Berber culture",
                "Opportunities to see traditional desert agriculture in Palmeraie"
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Not suitable for individuals with balance issues, back problems, or mobility challenges. Strict weight limit of 120kg/265lbs applies. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer comfortable temperatures for extended riding. Spring provides excellent visibility with clear skies. Summer requires early morning scheduling to avoid extreme heat. Autumn delivers ideal conditions with moderate temperatures and interesting lighting for photography."
        },
        {
            id: "ct-06",
            title: "Hot Air Balloon: Sunrise Over Atlas",
            subtitle: "Experience the magic of floating above Morocco's breathtaking landscapes at sunrise with a luxury balloon ride and gourmet Berber breakfast",
            price: 160,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/Hot Air Balloon Sunrise Over Atlas.jpg",
            images: [
                "/Hot Air Balloon Sunrise Over Atlas.jpg",
                "/Hot Air Balloon Sunrise Over Atlas.jpg",
                "/Hot Air Balloon Sunrise Over Atlas.jpg",
                "/Hot Air Balloon Sunrise Over Atlas.jpg"
            ],
            duration: "4 hours",
            features: ["Bucket List Experience", "Silent Flight", "Panoramic Views", "Gourmet Berber Breakfast", "Flight Certificate", "Professional Photos"],
            location: "Marrakech Sky",
            tags: ["Adventures", "Luxury", "Romantic", "Bucket List"],
            host: {
                name: "Pierre Dubois",
                image: "/localexpert.jpg",
                bio: "Certified hot air balloon pilot with 20+ years experience flying over Morocco's diverse landscapes. International ballooning champion and luxury tour specialist.",
                verified: true
            },
            description: "Witness the breathtaking beauty of Morocco from a completely unique perspective with a luxurious hot air balloon flight over the Atlas Mountains and surrounding landscapes. Drift silently above ancient olive groves, red-earth desert plains, and traditional Berber villages as the sun paints the sky in brilliant hues, followed by an exquisite Berber breakfast in a royal tent setting.",
            included: [
                "Luxury hotel pickup and drop-off in premium 4x4 vehicles",
                "60-minute hot air balloon flight with certified pilot",
                "Gourmet Berber breakfast in authentic royal tent setting",
                "Flight certificate and commemorative photo",
                "Professional photography service during flight",
                "Champagne toast at landing site",
                "Complimentary refreshments throughout",
                "Emergency safety equipment and insurance"
            ],
            exclusions: [
                "Personal expenses at breakfast venue",
                "Additional photography beyond complimentary service",
                "Optional souvenir purchases",
                "Gratuities for crew (recommended but not required)"
            ],
            whatToBring: [
                "Layered clothing for temperature variations",
                "Camera or smartphone for capturing aerial views",
                "Sunglasses for bright morning conditions",
                "Flat, comfortable shoes for boarding balloon",
                "Binoculars for enhanced viewing (optional)"
            ],
            itinerary: [
                { time: "05:00", title: "Luxury Hotel Pickup", description: "Comfortable transport to launch site with refreshments" },
                { time: "05:45", title: "Balloon Preparation", description: "Assist with inflation and pre-flight briefing" },
                { time: "06:30", title: "Sunrise Liftoff", description: "Magical ascent as the sun rises over the Atlas Mountains" },
                { time: "06:45-07:45", title: "Scenic Flight Experience", description: "Silent drift over olive groves, desert landscapes, and villages" },
                { time: "08:00", title: "Gourmet Berber Breakfast", description: "Traditional meal in royal tent with panoramic views" },
                { time: "09:30", title: "Return Journey", description: "Luxury transport back to your accommodation" }
            ],
            meetingPoint: "Pick up from your hotel or riad in Marrakech with exact timing provided upon booking",
            endingPoint: "Drop off at your hotel or riad",
            cancellationPolicy: "Free cancellation up to 72 hours before the experience. Within 72 hours, 50% refund applies.",
            requirements: [
                "Not suitable for pregnant women beyond 6 months",
                "No serious heart conditions or vertigo",
                "Ability to stand for 60 minutes and climb into balloon basket",
                "Comfortable with heights and enclosed spaces during inflation"
            ],
            ageRestrictions: "Suitable for ages 6 and up. Children under 12 must be accompanied by an adult. Ages 6-12 require special child-sized harnesses.",
            experienceHighlights: [
                "Magical sunrise flight over Atlas Mountains and desert",
                "Silent drifting with panoramic 360-degree views",
                "Gourmet Berber breakfast in authentic royal tent",
                "Professional photography capturing aerial memories",
                "Champagne toast celebrating successful landing"
            ],
            additionalInfo: "Flight subject to weather conditions with 24-hour confirmation. Alternative arrangements provided if canceled due to weather. Maximum group size ensures personalized attention.",
            minGroupSize: 2,
            maxGroupSize: 12,
            targetAudience: "Ideal for couples seeking romance, families wanting bucket list experiences, photographers chasing unique perspectives, and luxury travelers desiring unforgettable memories.",
            uniqueSellingPoints: [
                "Internationally certified pilots with extensive Moroccan experience",
                "Luxury balloon baskets with panoramic viewing platforms",
                "Gourmet breakfast in authentic royal tent setting",
                "Professional photography service capturing flight moments",
                "Small group sizes for intimate shared experience"
            ],
            premiumAddons: [
                { name: "Private Balloon Experience", price: 400, description: "Exclusive charter for your group with personalized service" },
                { name: "Extended Flight", price: 80, description: "Additional 30 minutes of flight time for enhanced views" },
                { name: "Professional Photo Package", price: 50, description: "Enhanced photo package with edited aerial shots" }
            ],
            importantNotes: [
                "Weather-dependent activity with 24-hour advance confirmation",
                "Early morning start required for optimal flying conditions",
                "Temperature drops significantly before sunrise - dress warmly",
                "Standing required for entire flight duration (60 minutes)"
            ],
            whatToExpect: "Your extraordinary adventure begins with a seamless pickup by your dedicated driver in a premium 4x4 vehicle. The journey to the launch site offers time to admire the pre-dawn landscape and prepare for the magical experience ahead. Upon arrival, you'll assist the professional crew in inflating the colorful balloon envelope, an exciting spectacle in itself. As the sun begins to rise, you'll climb aboard the spacious luxury basket for a gentle liftoff. The silent flight offers breathtaking panoramic views of the Atlas Mountains, ancient olive groves, and traditional Berber villages as they awaken below. Your expert pilot navigates the gentle air currents, pointing out landmarks and sharing insights about the landscape. The flight concludes with a graceful landing celebration, complete with a traditional champagne toast. The experience continues with a sumptuous Berber breakfast served in an authentic royal tent, offering time to share stories and review professional photos captured during your aerial journey. The day concludes with comfortable transport back to your accommodation.",
            authenticMoroccanElements: [
                "Traditional Berber breakfast featuring local ingredients",
                "Royal tent setting reflecting Moroccan hospitality traditions",
                "Champagne toast with local sparkling wine when available",
                "Crew sharing indigenous knowledge of flight routes",
                "Breakfast setting with views of culturally significant landscapes"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Not suitable for individuals with mobility challenges requiring seated positions or those with serious heart conditions. Standing required for full flight duration. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer clearest skies and most stable flying conditions. Spring provides excellent visibility with blooming landscapes below. Summer flights start earlier to avoid thermal activity. Autumn delivers comfortable temperatures with dramatic cloud formations for photography."
        },
        {
            id: "ct-07",
            title: "3-Day Desert Expedition: Merzouga Dunes",
            subtitle: "The ultimate Moroccan odyssey through the High Atlas, UNESCO sites, and the majestic Sahara Desert with luxury camping beneath star-filled skies",
            price: 180,
            rating: 4.8,
            reviews: 0,
            category: "City Trips & Excursions",
            image: "/3-Day Desert Expedition Merzouga.jpg",
            images: [
                "/3-Day Desert Expedition Merzouga.jpg",
                "/3-Day Desert Expedition Merzouga.jpg",
                "/3-Day Desert Expedition Merzouga.jpg",
                "/3-Day Desert Expedition Merzouga.jpg"
            ],
            duration: "3 Days",
            features: ["Epic Road Journey", "UNESCO World Heritage Sites", "Luxury Desert Camping", "Camel Trekking", "Starry Night Skies", "Berber Culture"],
            location: "Sahara Desert",
            tags: ["Adventures", "Excursions", "Luxury", "Cultural"],
            host: {
                name: "Youssef El Mansouri",
                image: "/localexpert.jpg",
                bio: "Third-generation desert guide with deep knowledge of Saharan routes and Berber traditions. Specializes in luxury expeditions combining adventure with authentic cultural immersion.",
                verified: true
            },
            description: "Embark on the journey of a lifetime through Morocco's most spectacular landscapes. This epic 3-day expedition takes you across the majestic High Atlas Mountains, through ancient kasbahs and UNESCO World Heritage sites, culminating in an unforgettable night in the vast Sahara Desert beneath a canopy of stars.",
            included: [
                "Premium minibus transport with bottled water and refreshments",
                "2 nights accommodation (1 luxury kasbah, 1 desert camp)",
                "Full board meals with traditional and international options",
                "Professional English-speaking guide throughout journey",
                "Camel trek with experienced handlers",
                "Luxury desert camp with comfortable beds and ensuite facilities",
                "Professional photography service throughout trip",
                "Emergency medical kit and satellite communication device",
                "Cultural insight booklet with regional history"
            ],
            exclusions: [
                "Alcoholic beverages",
                "Personal expenses and souvenirs",
                "Travel insurance (strongly recommended)",
                "Optional activities beyond program",
                "Gratuities for guide and drivers (recommended but not required)"
            ],
            whatToBring: [
                "Quality backpack with daypack attachment",
                "Layered clothing for temperature variations",
                "Sturdy hiking boots with ankle support",
                "Power bank and charging cables",
                "Headlamp or flashlight with spare batteries",
                "Sun protection (hat, sunglasses, sunscreen)",
                "Personal medications and first aid supplies",
                "Scarf or bandana for dust protection",
                "Reusable water bottle and hydration system",
                "Camera for capturing spectacular landscapes"
            ],
            itinerary: [
                { time: "Day 1", title: "Marrakech to Dades Gorges", description: "Cross High Atlas, visit Ait Ben Haddou UNESCO site, overnight in luxury kasbah" },
                { time: "Day 2", title: "Dades to Merzouga", description: "Traverse Todra Gorge, visit nomad families, camel trek to luxury desert camp" },
                { time: "Day 3", title: "Merzouga to Marrakech", description: "Sunrise dune climb, visit nomad market, scenic drive back to Marrakech" }
            ],
            meetingPoint: "Pick up from your hotel or riad in Marrakech with exact timing provided upon booking",
            endingPoint: "Drop off at your hotel or riad in Marrakech",
            cancellationPolicy: "Free cancellation up to 7 days before the experience. Within 7 days, 50% refund applies.",
            requirements: [
                "Good general physical condition for moderate hiking",
                "Comfort with multi-day travel and varied accommodations",
                "Openness to cultural differences and remote locations",
                "Flexibility for schedule adjustments due to weather or road conditions"
            ],
            ageRestrictions: "Suitable for ages 10 and up. Children under 16 must be accompanied by an adult. Minors require signed parental consent form.",
            experienceHighlights: [
                "Epic journey through Morocco's most spectacular landscapes",
                "UNESCO World Heritage site visit at Ait Ben Haddou",
                "Luxury accommodations in kasbah and desert camp",
                "Camel trek into Erg Chebbi dunes at sunset",
                "Stargazing beneath pristine Sahara skies"
            ],
            additionalInfo: "Long drive involved with comfort stops. Luxury accommodations feature traditional architecture with modern amenities. Dietary restrictions accommodated with advance notice.",
            minGroupSize: 2,
            maxGroupSize: 6,
            targetAudience: "Perfect for adventure travelers, cultural explorers, photographers, and anyone seeking an authentic, luxurious Moroccan odyssey through diverse landscapes.",
            uniqueSellingPoints: [
                "Small group sizes for personalized attention and flexibility",
                "Luxury accommodations in authentic kasbah and desert camp",
                "Expert guide with deep cultural knowledge and storytelling ability",
                "Professional photography service capturing journey highlights",
                "UNESCO site visits with insider access and interpretation"
            ],
            premiumAddons: [
                { name: "Private Expedition", price: 600, description: "Exclusive charter for your group with personalized itinerary" },
                { name: "4WD Upgrade", price: 75, description: "Enhanced vehicle for smoother desert traversal" },
                { name: "Astrology Experience", price: 45, description: "Professional stargazing session with telescope and astronomer" }
            ],
            importantNotes: [
                "Multi-day journey with long driving distances between destinations",
                "Accommodations blend traditional architecture with modern comfort",
                "Weather-dependent activity with contingency plans for disruptions",
                "Remote locations with limited connectivity - embrace digital detox"
            ],
            whatToExpect: "Your epic Moroccan adventure begins with a comfortable pickup by your dedicated driver in a premium minibus. Day one takes you across the spectacular High Atlas Mountains, with a stop at the UNESCO World Heritage site of Ait Ben Haddou, a perfectly preserved ksar that has starred in numerous films. You'll overnight in a luxury kasbah, experiencing traditional Moroccan hospitality with modern comforts. Day two continues through the dramatic Todra Gorge, where towering canyon walls create a stunning natural corridor. You'll visit nomadic families and learn about their traditional lifestyle before embarking on a memorable camel trek into the Erg Chebbi dunes as the sun sets. Your night will be spent in a luxury desert camp with comfortable beds, ensuite facilities, and dinner under the stars. Day three begins with a magical sunrise climb up the highest dunes for breathtaking panoramic views, followed by a visit to a local nomad market before beginning the scenic journey back to Marrakech.",
            authenticMoroccanElements: [
                "UNESCO World Heritage site visit with cultural interpretation",
                "Traditional kasbah accommodations with local architectural style",
                "Authentic Berber hospitality and cultural exchanges",
                "Nomadic family visits sharing traditional lifestyle",
                "Luxury desert camp reflecting Saharan nomad traditions"
            ],
            difficulty: "Moderate",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Limited accessibility due to remote locations, varied terrain, and multi-day travel requirements. Not suitable for individuals with mobility challenges or serious medical conditions. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer clear skies and comfortable daytime temperatures but cool nights. Spring provides blooming landscapes and moderate temperatures. Summer requires early departures to avoid extreme heat. Autumn delivers comfortable conditions with dramatic lighting for photography."
        }
    ],
    workshops: [
        {
            id: "ot-01",
            title: "Master the Tagine: Cooking Class",
            subtitle: "Learn the ancient art of Moroccan cuisine from a master chef with market sourcing, hands-on cooking, and indulgent feast of your creations",
            price: 45,
            rating: 4.8,
            reviews: 0,
            category: "Workshops",
            image: "/Master the Tagine Cooking Class.jpg",
            images: [
                "/Master the Tagine Cooking Class.jpg",
                "/Master the Tagine Cooking Class.jpg",
                "/Master the Tagine Cooking Class.jpg",
                "/Master the Tagine Cooking Class.jpg"
            ],
            duration: "4 hours",
            features: ["Authentic Market Sourcing", "Hands-on Instruction", "Traditional Techniques", "Lunch of Your Creations", "Recipe Cards"],
            location: "Medina Riad",
            tags: ["Food & Drink", "Culture", "Educational", "Hands-on"],
            host: {
                name: "Chef Fatema Bennani",
                image: "/localexpert.jpg",
                bio: "Award-winning Moroccan chef with 25+ years mastering traditional tagine recipes. Former sous-chef at renowned Marrakech restaurants now dedicated to sharing culinary secrets with travelers.",
                verified: true
            },
            description: "Immerse yourself in the heart of Moroccan culinary tradition with an authentic cooking experience led by a master chef. Begin with a guided tour of the vibrant local souk to source the freshest ingredients, then learn the time-honored techniques of tagine preparation and spice blending that have been passed down through generations.",
            included: [
                "Guided market tour with ingredient sourcing",
                "Professional chef instruction with hands-on guidance",
                "Premium ingredients and traditional cookware",
                "Apron and kitchen tools provided",
                "Lavish lunch feast featuring your prepared dishes",
                "Comprehensive recipe cards for all prepared dishes",
                "Traditional mint tea ceremony and cultural insights",
                "Professional photography of your culinary creations"
            ],
            exclusions: [
                "Transportation to/from meeting point",
                "Additional ingredients or specialty items",
                "Alcoholic beverages (available for purchase)",
                "Gratuities for your chef (recommended but not required)"
            ],
            whatToBring: [
                "Enthusiasm for culinary discovery",
                "Closed-toe shoes for kitchen safety",
                "Receptiveness to trying new flavors and textures",
                "Camera or smartphone for capturing culinary moments",
                "Small bag for recipe cards and personal items"
            ],
            itinerary: [
                { time: "10:00", title: "Souk Market Expedition", description: "Guided tour sourcing fresh ingredients and learning about spices" },
                { time: "11:00", title: "Kitchen Preparation", description: "Equipment setup, hygiene briefing, and spice blending demonstration" },
                { time: "11:30", title: "Hands-on Cooking", description: "Preparing traditional tagine and couscous with chef guidance" },
                { time: "12:45", title: "Table Setting", description: "Presentation of dishes and traditional serving customs" },
                { time: "13:00", title: "Lavish Feast", description: "Enjoying your culinary creations with mint tea ceremony" }
            ],
            meetingPoint: "Traditional riad in the heart of Medina, exact address provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Comfortable standing for extended periods",
                "Willingness to handle raw food ingredients",
                "Openness to trying diverse flavor profiles",
                "Basic comfort with kitchen tools and equipment"
            ],
            ageRestrictions: "Suitable for ages 12 and up. Children under 16 must be accompanied by an adult.",
            experienceHighlights: [
                "Authentic market sourcing with expert guidance",
                "Hands-on instruction from award-winning Moroccan chef",
                "Mastering traditional tagine and spice blending techniques",
                "Lavish feast featuring exclusively your prepared dishes",
                "Comprehensive recipe cards to recreate dishes at home"
            ],
            additionalInfo: "Vegetarian, vegan, and gluten-free options available with advance notice. Please inform us of any dietary restrictions or severe allergies when booking.",
            minGroupSize: 2,
            maxGroupSize: 8,
            targetAudience: "Ideal for culinary enthusiasts, food bloggers, cultural explorers, and anyone wanting to master authentic Moroccan cooking techniques.",
            uniqueSellingPoints: [
                "Award-winning chef with decades of traditional culinary expertise",
                "Authentic market sourcing experience with spice education",
                "Small class sizes ensuring personalized chef attention",
                "Comprehensive recipe cards for recreating dishes at home",
                "Traditional riad setting with cultural ambiance"
            ],
            premiumAddons: [
                { name: "Private Chef Session", price: 120, description: "One-on-one instruction with master chef for personalized menu" },
                { name: "Wine Pairing", price: 25, description: "Curated Moroccan wines paired with your culinary creations" },
                { name: "Extended Workshop", price: 35, description: "Additional hour for preparing dessert specialties" }
            ],
            importantNotes: [
                "Market tour involves walking on uneven cobblestone surfaces",
                "Kitchen environment requires comfort with heat and aromatics",
                "Dietary restrictions accommodated with 48-hour advance notice",
                "Allergen protocols strictly followed for guest safety"
            ],
            whatToExpect: "Your culinary journey begins with a warm welcome at our traditional riad, where your expert chef will introduce you to the fundamentals of Moroccan cuisine. The experience kicks off with a guided tour through the vibrant local souk, where you'll learn to select the finest ingredients and understand the significance of each spice in traditional blends. Back at the riad, you'll receive a comprehensive safety briefing and equipment orientation before diving into hands-on preparation. Under your chef's expert guidance, you'll master the art of tagine cooking, learning the importance of layering flavors and the patience required for slow-cooking perfection. The couscous preparation will teach you traditional steaming techniques and proper grain handling. As your dishes simmer and fill the kitchen with aromatic spices, you'll enjoy a traditional mint tea ceremony while learning about Moroccan dining customs. The experience culminates in a lavish feast where you'll savor the delicious results of your labor alongside fellow culinary adventurers.",
            authenticMoroccanElements: [
                "Traditional riad setting with authentic architectural details",
                "Market sourcing techniques passed through generations",
                "Ancient spice blending methods and flavor profiles",
                "Traditional tagine and couscous preparation techniques",
                "Cultural dining customs and hospitality traditions"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Partially accessible kitchen environment with step stools available. Not suitable for individuals with severe food allergies or mobility challenges requiring seated positions. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer access to seasonal ingredients and comfortable kitchen temperatures. Spring provides fresh herbs and produce for enhanced flavors. Summer classes start earlier to avoid kitchen heat. Autumn showcases harvest ingredients and traditional preservation techniques."
        },
        {
            id: "ot-02",
            title: "Perfume Making Workshop",
            subtitle: "Unlock the ancient secrets of Moroccan perfumery with a master craftsman to create your exclusive signature fragrance using precious essential oils",
            price: 50,
            rating: 4.8,
            reviews: 0,
            category: "Workshops",
            image: "/Perfume Making Workshop.jpg",
            images: [
                "/Perfume Making Workshop.jpg",
                "/Perfume Making Workshop.jpg",
                "/Perfume Making Workshop.jpg",
                "/Perfume Making Workshop.jpg"
            ],
            duration: "2 hours",
            features: ["Ancient Craftsmanship", "Signature Creation", "Premium Essential Oils", "Take Home Product", "Cultural Immersion"],
            location: "Medina Atelier",
            tags: ["Culture", "Creative", "Luxury", "Educational"],
            host: {
                name: "Master Perfumer Hassan El Fassi",
                image: "/localexpert.jpg",
                bio: "Fourth-generation perfumer trained in traditional Moroccan methods. Expert in oud distillation and jasmine absolute extraction. Former consultant for luxury fragrance houses.",
                verified: true
            },
            description: "Step into the enchanting world of Moroccan perfumery, where ancient traditions meet modern artistry. Under the guidance of a master craftsman, discover the intricate process of creating bespoke fragrances using the finest essential oils, including rare jasmine absolutes, precious oud, and delicate orange blossom extracts.",
            included: [
                "Premium 30ml amber glass perfume bottle with atomizer",
                "Extensive selection of high-quality essential oils",
                "Professional perfumer instruction with cultural insights",
                "Comprehensive fragrance creation workbook",
                "Luxury packaging for your finished perfume",
                "Certificate of completion and creation details",
                "Traditional mint tea ceremony during blending process",
                "Professional photography of your perfume creation"
            ],
            exclusions: [
                "Transportation to/from meeting point",
                "Additional essential oils beyond workshop selection",
                "Extended private consultation time",
                "Gratuities for your perfumer (recommended but not required)"
            ],
            whatToBring: [
                "Open mind and creative spirit",
                "Sensitivity to aromatic experiences",
                "Camera or smartphone for capturing memories",
                "List of favorite scents for inspiration (optional)"
            ],
            itinerary: [
                { time: "Flexible", title: "Welcome & Olfactory Journey", description: "Introduction to Moroccan perfumery history and sensory exploration" },
                { time: "Flexible", title: "Essential Oil Discovery", description: "Sampling premium oils and understanding their characteristics" },
                { time: "Flexible", title: "Fragrance Structure Learning", description: "Understanding top, middle, and base notes in perfumery" },
                { time: "Flexible", title: "Signature Creation", description: "Blending your unique fragrance with expert guidance" },
                { time: "Flexible", title: "Maturation & Bottling", description: "Allowing fragrance to settle and transferring to premium bottle" },
                { time: "Flexible", title: "Final Reveal & Documentation", description: "Testing finished perfume and recording creation details" }
            ],
            meetingPoint: "Traditional perfumery atelier in the heart of Medina, exact address provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "No known allergies to floral or woody scents",
                "Comfort with aromatic intensity and concentrated oils",
                "Interest in creative and cultural experiences",
                "Ability to discern subtle fragrance variations"
            ],
            ageRestrictions: "Suitable for ages 14 and up. Participants under 16 must be accompanied by an adult.",
            experienceHighlights: [
                "Ancient Moroccan perfumery techniques passed through generations",
                "Access to premium essential oils including rare jasmine and oud",
                "Create exclusive signature fragrance with professional guidance",
                "Luxury 30ml bottle to take home your creation",
                "Cultural insights into Moroccan aromatic traditions"
            ],
            additionalInfo: "Materials provided including premium essential oils and luxury bottle. Allergen protocols strictly followed for guest safety. Photography encouraged throughout the creative process.",
            minGroupSize: 1,
            maxGroupSize: 4,
            targetAudience: "Perfect for fragrance enthusiasts, creative individuals, cultural explorers, and anyone wanting to craft a truly unique, personal scent.",
            uniqueSellingPoints: [
                "Fourth-generation master perfumer with traditional expertise",
                "Access to rare essential oils unavailable to public",
                "Intimate class sizes ensuring personalized attention",
                "Luxury packaging for taking home your creation",
                "Comprehensive workbook for recreating blends at home"
            ],
            premiumAddons: [
                { name: "Private Perfumer Session", price: 150, description: "One-on-one instruction for multiple signature fragrances" },
                { name: "Luxury Bottle Upgrade", price: 30, description: "Premium crystal bottle with custom engraving" },
                { name: "Extended Workshop", price: 40, description: "Additional hour for creating multiple variations" }
            ],
            importantNotes: [
                "Workshop involves intense aromatic experiences - not suitable for sensitive individuals",
                "Essential oils are highly concentrated - avoid skin contact without dilution",
                "Allergen protocols strictly followed - please inform us of sensitivities",
                "Fragrance maturation requires 48 hours for optimal scent development"
            ],
            whatToExpect: "Your olfactory journey begins with a warm welcome at our traditional perfumery atelier, where the air is rich with the intoxicating aromas of precious essential oils. Your master perfumer will guide you through the fascinating history of Moroccan perfumery, sharing stories of ancient trade routes and the significance of scent in local culture. You'll begin with a sensory exploration of premium essential oils, learning to distinguish between top, middle, and base notes that form the foundation of exceptional fragrances. Through hands-on experimentation, you'll discover how different concentrations and combinations create unique aromatic experiences. With expert guidance, you'll blend your signature scent, balancing floral, woody, and spicy elements to reflect your personal style. The process includes allowing your creation to mature briefly before bottling it in a premium 30ml amber glass container. You'll receive a comprehensive workbook detailing your formula, enabling you to recreate or modify your fragrance at home. The experience concludes with a traditional mint tea ceremony, celebrating your new-found perfumery skills.",
            authenticMoroccanElements: [
                "Traditional perfumery techniques passed through four generations",
                "Essential oils sourced from local cooperatives and traditional distilleries",
                "Amber glass bottles reflecting Moroccan craftsmanship traditions",
                "Cultural significance of scent in Moroccan hospitality and rituals",
                "Traditional mint tea ceremony integrating olfactory and gustatory arts"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Fully accessible workshop environment with seated options. Not suitable for individuals with severe fragrance sensitivities or respiratory conditions. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer access to seasonal absolutes and comfortable workshop temperatures. Spring provides fresh floral essences and blooming jasmine for enhanced extractions. Summer workshops feature cooling citrus blends and lighter aromatic profiles. Autumn showcases rich ambers and warm spice combinations for complex fragrances."
        },
        {
            id: "ot-03",
            title: "Pottery & Zellige Workshop",
            subtitle: "Master the ancient Moroccan crafts of pottery and zellige mosaic with master artisans in a traditional workshop setting",
            price: 35,
            rating: 4.8,
            reviews: 0,
            category: "Workshops",
            image: "/Pottery & Zellige Workshop.jpg",
            images: [
                "/Pottery & Zellige Workshop.jpg",
                "/Pottery & Zellige Workshop.jpg",
                "/Pottery & Zellige Workshop.jpg",
                "/Pottery & Zellige Workshop.jpg"
            ],
            duration: "3 hours",
            features: ["Traditional Craftsmanship", "Hands-on Learning", "Cultural Immersion", "Take Home Creation", "Expert Instruction"],
            location: "Artisan District",
            tags: ["Culture", "Creative", "Educational", "Hands-on"],
            host: {
                name: "Master Artisans Omar & Amina",
                image: "/localexpert.jpg",
                bio: "Husband-wife team of master craftsmen with 30+ years specializing in traditional Moroccan pottery and zellige mosaic. Featured artists in international exhibitions and cultural preservation programs.",
                verified: true
            },
            description: "Immerse yourself in the time-honored Moroccan crafts of pottery and zellige mosaic, where ancient techniques meet artistic expression. Learn from master artisans who have dedicated their lives to preserving these traditional skills, creating beautiful pieces that reflect centuries of cultural heritage.",
            included: [
                "Premium clay and ceramic materials",
                "Professional-grade tools and equipment",
                "Expert instruction from master artisans",
                "Aprons and protective gear provided",
                "Glazing and firing of your finished piece",
                "Comprehensive technique workbook with cultural history",
                "Traditional mint tea ceremony during crafting",
                "Professional photography of your creations"
            ],
            exclusions: [
                "Transportation to/from meeting point",
                "Additional materials beyond workshop provision",
                "Extended private instruction time",
                "Gratuities for your artisans (recommended but not required)"
            ],
            whatToBring: [
                "Clothing that can get dirty or old clothes",
                "Closed-toe shoes for workshop safety",
                "Creativity and willingness to learn",
                "Camera or smartphone for capturing memories",
                "Small bag for personal items and workbook"
            ],
            itinerary: [
                { time: "09:00", title: "Welcome & Cultural Orientation", description: "Introduction to Moroccan pottery and zellige history and significance" },
                { time: "09:30", title: "Pottery Wheel Demonstration", description: "Traditional techniques for shaping clay on the wheel" },
                { time: "10:00", title: "Hands-on Pottery Practice", description: "Creating your unique pottery piece with artisan guidance" },
                { time: "11:00", title: "Zellige Mosaic Introduction", description: "Learning geometric patterns and traditional cutting techniques" },
                { time: "11:30", title: "Zellige Hands-on Creation", description: "Assembling your mosaic artwork with precision and care" },
                { time: "12:30", title: "Finishing & Glazing Process", description: "Preparing pieces for firing and adding final touches" }
            ],
            meetingPoint: "Traditional artisan workshop in the historic crafts district, exact address provided upon booking",
            endingPoint: "Same as meeting point",
            cancellationPolicy: "Free cancellation up to 48 hours before the experience. Within 48 hours, 50% refund applies.",
            requirements: [
                "Comfort with getting hands dirty and handling clay",
                "Willingness to learn traditional crafting techniques",
                "Basic manual dexterity for tool handling",
                "Interest in cultural and artistic experiences"
            ],
            ageRestrictions: "Suitable for ages 8 and up. Children under 12 must be accompanied by an adult.",
            experienceHighlights: [
                "Learn authentic pottery techniques on traditional wheels",
                "Master zellige mosaic patterns with expert guidance",
                "Create unique pieces to take home and treasure",
                "Cultural insights from master artisan craftsmen",
                "Traditional workshop setting in historic artisan district"
            ],
            additionalInfo: "Wear clothes that can get dirty - clay and glazes may stain. All materials and tools provided. Finished pieces will be fired and ready for pickup within 7 days.",
            minGroupSize: 2,
            maxGroupSize: 6,
            targetAudience: "Ideal for craft enthusiasts, cultural explorers, families seeking creative activities, and anyone wanting to learn authentic Moroccan artisan techniques.",
            uniqueSellingPoints: [
                "Master artisans with 30+ years of traditional craft expertise",
                "Authentic workshop in historic artisan district setting",
                "Comprehensive instruction in both pottery and zellige techniques",
                "Finished pieces fired and ready for pickup within one week",
                "Cultural workbook with historical context and technique details"
            ],
            premiumAddons: [
                { name: "Private Masterclass", price: 100, description: "One-on-one instruction for advanced techniques in both crafts" },
                { name: "Extended Workshop", price: 25, description: "Additional hour for creating multiple pieces" },
                { name: "Luxury Packaging", price: 15, description: "Premium gift box for presenting your finished creation" }
            ],
            importantNotes: [
                "Workshop involves messy materials - dress accordingly",
                "Clay and glazes may stain clothing and skin temporarily",
                "Finished pieces require firing process - pickup arrangement needed",
                "Tools are sharp - careful handling required under supervision"
            ],
            whatToExpect: "Your creative journey begins with a warm welcome at our traditional artisan workshop, nestled in the heart of Marrakech's historic crafts district. Your master artisans, Omar and Amina, will introduce you to the rich history of Moroccan pottery and zellige mosaic, sharing stories of their family's crafting traditions spanning generations. You'll begin with a demonstration of pottery techniques on traditional wheels, learning the delicate balance of water, clay, and hand pressure to create beautiful forms. Under patient guidance, you'll shape your own pottery piece, whether a bowl, vase, or decorative item. The session continues with an introduction to zellige mosaic, Morocco's distinctive geometric tilework that adorns palaces and mosques. You'll learn to cut colorful tiles with precision and assemble them into traditional patterns, developing an appreciation for the mathematical precision and artistic skill required. Throughout the process, you'll enjoy a traditional mint tea ceremony, fostering the sense of community central to Moroccan craftsmanship. Your pieces will be glazed and prepared for firing, with arrangements made for pickup within a week. You'll leave with newfound skills, cultural insights, and the satisfaction of creating authentic Moroccan art.",
            authenticMoroccanElements: [
                "Traditional workshop setting in historic artisan district",
                "Genuine pottery wheels and tools used by local craftsmen",
                "Authentic zellige patterns reflecting Islamic geometric art",
                "Traditional mint tea ceremony during creative process",
                "Cultural stories and techniques passed through generations"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Partially accessible workshop with adjustable-height workstations. Not suitable for individuals with severe clay allergies or mobility challenges requiring seated positions. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer comfortable workshop temperatures and ideal humidity for clay work. Spring provides fresh inspiration with blooming colors for glazing choices. Summer workshops feature cooling breezes and extended daylight for detailed work. Autumn showcases rich earth tones and traditional harvest motifs for creative inspiration."
        }
    ],
    entertainment: [
        {
            id: "ot-04",
            title: "Chez Ali Fantasia Dinner Show",
            subtitle: "Experience the thundering hooves and vibrant colors of traditional Moroccan fantasia with an authentic Berber dinner under the stars",
            price: 45,
            rating: 4.8,
            reviews: 0,
            category: "Entertainment",
            image: "/Chez Ali Fantasia Dinner Show.jpg",
            images: [
                "/Chez Ali Fantasia Dinner Show.jpg",
                "/Chez Ali Fantasia Dinner Show.jpg",
                "/Chez Ali Fantasia Dinner Show.jpg",
                "/Chez Ali Fantasia Dinner Show.jpg"
            ],
            duration: "4 hours",
            features: ["Authentic Fantasia Performance", "Traditional Berber Dinner", "Live Folk Music", "Cultural Immersion", "Transportation"],
            location: "Palmerarie",
            tags: ["Food & Drink", "Culture", "Entertainment", "Traditional"],
            host: {
                name: "Ali Ben Mansour",
                image: "/localexpert.jpg",
                bio: "Third-generation performer and cultural preservationist dedicated to showcasing authentic Moroccan traditions. Direct descendant of Berber warriors who participated in original fantasia cavalry charges.",
                verified: true
            },
            description: "Step into a magical world where ancient Berber traditions come alive under the starlit desert sky. Witness the breathtaking spectacle of fantasia, where skilled horsemen recreate the thunderous cavalry charges of their ancestors, followed by an authentic Berber feast that celebrates Morocco's rich culinary heritage.",
            included: [
                "Luxury hotel pickup and drop-off in premium vehicles",
                "Authentic Berber dinner featuring traditional lamb tagine and couscous",
                "Unlimited traditional mint tea and non-alcoholic beverages",
                "Front-row seating for spectacular fantasia performance",
                "Live folk music ensemble with traditional instruments",
                "Professional photography service throughout evening",
                "Cultural performance program with historical context",
                "Commemorative certificate of attendance"
            ],
            exclusions: [
                "Alcoholic beverages (available for purchase)",
                "Additional food or beverage orders beyond dinner",
                "Personal expenses and souvenir purchases",
                "Gratuities for performers (recommended but not required)"
            ],
            whatToBring: [
                "Camera or smartphone for capturing spectacular performances",
                "Light jacket or shawl for cool evening temperatures",
                "Evening-appropriate attire for dinner setting",
                "Cash for optional beverage purchases"
            ],
            itinerary: [
                { time: "19:30", title: "Luxury Hotel Pickup", description: "Comfortable transport to performance venue with refreshments" },
                { time: "20:00", title: "Welcome Reception", description: "Traditional mint tea ceremony and cultural orientation" },
                { time: "20:30", title: "Authentic Berber Dinner", description: "Three-course traditional meal with live musical accompaniment" },
                { time: "22:00", title: "Spectacular Fantasia Show", description: "Thundering horsemen performance with traditional weapons display" },
                { time: "23:00", title: "Cultural Performances", description: "Folk dances, music, and storytelling by local artists" },
                { time: "23:30", title: "Return Journey", description: "Comfortable transport back to your accommodation" }
            ],
            meetingPoint: "Pick up from your hotel or riad in Marrakech with exact timing provided upon booking",
            endingPoint: "Drop off at your hotel or riad",
            cancellationPolicy: "Free cancellation up to 72 hours before the experience. Within 72 hours, 50% refund applies.",
            requirements: [
                "Comfort with loud sounds and sudden movements during performance",
                "Evening-appropriate attire for dinner setting",
                "Interest in cultural and traditional experiences",
                "Flexibility for schedule adjustments due to weather or logistics"
            ],
            ageRestrictions: "Suitable for all ages. Children under 12 must be accompanied by an adult.",
            experienceHighlights: [
                "Authentic fantasia performance with thundering Berber horsemen",
                "Traditional Berber dinner under the starlit desert sky",
                "Live folk music with traditional instruments and storytelling",
                "Cultural immersion with historical context and explanations",
                "Professional photography capturing memorable moments"
            ],
            additionalInfo: "Loud music and sudden sounds during fantasia performance. Outdoor venue with ambient lighting. Weather contingency plans in effect.",
            minGroupSize: 2,
            maxGroupSize: 40,
            targetAudience: "Perfect for families, couples, cultural enthusiasts, and anyone wanting to experience authentic Moroccan traditions in a spectacular setting.",
            uniqueSellingPoints: [
                "Third-generation performers with authentic Berber heritage",
                "Front-row seating ensuring optimal viewing of all performances",
                "Authentic Berber dinner featuring traditional recipes and techniques",
                "Professional photography service capturing spectacular moments",
                "Cultural program with historical context and storytelling"
            ],
            premiumAddons: [
                { name: "VIP Seating", price: 25, description: "Premium table closest to performance arena with dedicated service" },
                { name: "Alcoholic Beverage Package", price: 20, description: "Selection of Moroccan wines and beers with dinner" },
                { name: "Private Transportation", price: 35, description: "Exclusive round-trip transport in luxury vehicle" }
            ],
            importantNotes: [
                "Outdoor venue with natural ambient lighting and temperature variations",
                "Fantasia performance involves loud sounds and sudden movements - caution advised",
                "Weather contingency plans in effect for outdoor performances",
                "Dinner service includes traditional seating on carpets and cushions"
            ],
            whatToExpect: "Your enchanting evening begins with a seamless pickup by your dedicated driver in a premium vehicle, ensuring comfortable arrival at the spectacular outdoor venue. Upon arrival, you'll be welcomed with a traditional mint tea ceremony while settling into your assigned seating area, adorned with authentic Berber textiles and lanterns. The authentic Berber dinner features a sumptuous three-course meal, beginning with traditional harira soup and msemen pancakes, followed by tender lamb tagine slow-cooked with aromatic spices, and concluding with sweet chebakia pastries and fresh fruit. Throughout the meal, talented musicians entertain with traditional instruments like the oud and bendir, while storytellers share tales of Berber history and legend. The highlight of the evening is the spectacular fantasia performance, where skilled horsemen charge across the sand arena in traditional attire, firing muskets in a thunderous display that recreates the cavalry charges of their ancestors. The evening continues with vibrant folk dances, including the energetic Ahwach and graceful Ahidous, performed by local troupes in colorful traditional costumes. Professional photographers capture these magical moments throughout the evening, ensuring you leave with lasting memories of this authentic Moroccan experience.",
            authenticMoroccanElements: [
                "Traditional fantasia performance by direct descendants of Berber warriors",
                "Authentic Berber dinner featuring recipes passed through generations",
                "Live folk music with traditional instruments and cultural storytelling",
                "Outdoor venue reflecting traditional Berber gathering spaces",
                "Cultural program explaining historical significance of all performances"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish"],
            accessibility: "Partially accessible outdoor venue with carpet and cushion seating. Not suitable for individuals with severe noise sensitivities or mobility challenges requiring seated positions. Please contact us to discuss specific needs.",
            seasonalNotes: "Winter months offer clear skies and comfortable evening temperatures for outdoor performances. Spring provides pleasant weather with blooming desert flora visible. Summer performances start earlier to avoid extreme heat. Autumn delivers comfortable conditions with dramatic desert sunset views."
        }
    ],
    transfers: [
        {
            id: "ot-05",
            title: "Private Airport Transfer",
            subtitle: "Seamless luxury transfer service between Marrakech Menara Airport and your accommodation with professional chauffeur and premium vehicle",
            price: 25,
            rating: 4.8,
            reviews: 0,
            category: "Transfers",
            image: "/Private Airport Transfer.jpg",
            images: [
                "/Private Airport Transfer.jpg",
                "/Private Airport Transfer.jpg",
                "/Private Airport Transfer.jpg",
                "/Private Airport Transfer.jpg"
            ],
            duration: "30 min",
            features: ["24/7 Premium Service", "Meet & Greet", "Luxury AC Vehicle", "Professional Chauffeur", "Flight Monitoring"],
            location: "RAK Airport",
            tags: ["Transport", "Luxury", "Convenience"],
            host: {
                name: "Premium Airport Services",
                image: "/localexpert.jpg",
                bio: "Professional transportation company with 15+ years providing premium airport transfer services in Marrakech. Fleet of luxury vehicles with certified multilingual chauffeurs.",
                verified: true
            },
            description: "Experience stress-free, luxurious travel between Marrakech Menara Airport and your accommodation with our premium private transfer service. Our professional chauffeurs ensure punctual, comfortable transportation in luxury vehicles equipped with modern amenities.",
            included: [
                "Premium private car or van based on group size",
                "Professional multilingual chauffeur with local expertise",
                "Meet and greet service with name sign in arrival hall",
                "Flight monitoring for delays and schedule changes",
                "Bottled water and refreshment service",
                "Air conditioning and climate-controlled comfort",
                "Professional luggage assistance and secure storage",
                "Unlimited wait time for flight delays",
                "Child seats available upon request (free of charge)",
                "Professional customer support 24/7"
            ],
            exclusions: [
                "Gratuities for chauffeur (recommended but not required)",
                "Additional stops beyond agreed pickup/drop-off points",
                "Extended waiting time beyond reasonable delays",
                "Personal expenses and toll fees"
            ],
            whatToBring: [
                "Flight number and estimated arrival time",
                "Contact information for easy communication",
                "Travel documents and identification",
                "Luggage details if requiring special handling"
            ],
            itinerary: [
                { time: "Flexible", title: "Booking Confirmation", description: "Service details and chauffeur contact information provided" },
                { time: "Flexible", title: "Chauffeur Assignment", description: "Professional driver allocated with vehicle details" },
                { time: "Flexible", title: "Airport Pickup", description: "Meet and greet in arrival hall with name sign" },
                { time: "Flexible", title: "Comfortable Journey", description: "Climate-controlled transport to your destination" },
                { time: "Flexible", title: "Destination Arrival", description: "Safe delivery to your accommodation with luggage assistance" }
            ],
            meetingPoint: "Marrakech Menara Airport arrival hall exit with clearly visible chauffeur holding name sign",
            endingPoint: "Your hotel, riad, or specified Marrakech accommodation",
            cancellationPolicy: "Free cancellation up to 24 hours before scheduled pickup. Within 24 hours, full refund if flight is delayed or canceled.",
            requirements: [
                "Valid flight details for airport transfer coordination",
                "Clear accommodation address for accurate navigation",
                "Mobile phone for communication with chauffeur",
                "Reasonable expectation of punctuality and professionalism"
            ],
            ageRestrictions: "Suitable for all ages. Child seats available upon request for infants and young children.",
            experienceHighlights: [
                "Stress-free premium airport transfer with professional service",
                "Meet and greet service with name sign for easy identification",
                "Luxury vehicle with climate control and modern amenities",
                "Flight monitoring ensuring punctual pickup regardless of delays",
                "Multilingual chauffeurs with local knowledge and expertise"
            ],
            additionalInfo: "Provide flight details including airline and flight number for optimal service coordination. 24-hour customer support available for any changes or special requests.",
            minGroupSize: 1,
            maxGroupSize: 8,
            targetAudience: "Ideal for all travelers seeking reliable, comfortable transportation to or from Marrakech Menara Airport, including families, business travelers, and tourists.",
            uniqueSellingPoints: [
                "Professional chauffeurs with extensive local knowledge",
                "Premium fleet with luxury vehicles and modern amenities",
                "Flight monitoring ensuring punctual service despite delays",
                "24/7 customer support for peace of mind",
                "Flexible service accommodating special requests and needs"
            ],
            premiumAddons: [
                { name: "Luxury Vehicle Upgrade", price: 15, description: "Upgrade to premium Mercedes or BMW vehicle" },
                { name: "Meet and Greet Assistance", price: 10, description: "Personal assistance with luggage and navigation" },
                { name: "Multiple Stop Package", price: 20, description: "Additional stops during transfer for shopping or errands" }
            ],
            importantNotes: [
                "Chauffeur will monitor flight status for delays and schedule changes",
                "Service available 24/7 including holidays and late-night arrivals",
                "Child seats available upon request - specify when booking",
                "Vehicle type based on group size and luggage requirements"
            ],
            whatToExpect: "Your seamless travel experience begins the moment you book with us, receiving immediate confirmation and chauffeur details. Our professional customer service team will contact you 24 hours before your arrival to confirm flight details and answer any questions. Upon landing at Marrakech Menara Airport, your uniformed chauffeur will be waiting in the arrival hall with a clearly visible name sign, ensuring easy identification. After a warm greeting and luggage assistance, you'll be escorted to a premium air-conditioned vehicle suited to your group size. The comfortable journey to your accommodation includes bottled water and refreshments, with your chauffeur navigating the most efficient route while sharing local insights. Throughout the transfer, our team monitors flight status to accommodate any delays, and 24/7 customer support is available for any changes or special requests. Upon arrival at your destination, your chauffeur will assist with luggage and ensure a smooth check-in process, completing your stress-free airport transfer experience.",
            authenticMoroccanElements: [
                "Professional service reflecting Moroccan hospitality traditions",
                "Local chauffeurs with extensive knowledge of Marrakech neighborhoods",
                "Premium service standards meeting international traveler expectations",
                "Attention to detail reflecting Moroccan craftsmanship values",
                "Personalized service embodying Moroccan culture of generosity"
            ],
            difficulty: "Easy",
            languages: ["English", "French", "Arabic", "Spanish", "German", "Italian"],
            accessibility: "Fully accessible service with vehicle options for mobility equipment. Child seats available for infants and young children. Please specify requirements when booking.",
            seasonalNotes: "Service available year-round with vehicle adjustments for seasonal weather conditions. Winter months include vehicle warm-up for passenger comfort. Summer vehicles feature enhanced air conditioning for temperature control."
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