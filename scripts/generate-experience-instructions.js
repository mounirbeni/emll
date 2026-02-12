/**
 * Experience Instructions Generator
 * 
 * This script generates unique, context-aware instructions and requirements
 * for each experience in the database based on its category, type, and characteristics.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Category-specific instruction generators
const instructionGenerators = {
    // TOURS & SIGHTSEEING
    'City Tours': {
        requirements: (exp) => [
            'Moderate walking ability required',
            'Comfortable with navigating crowded areas',
            exp.duration.includes('full') || exp.duration.includes('8') ? 'Good stamina for extended walking' : 'Basic fitness level sufficient'
        ],
        whatToBring: (exp) => [
            'Comfortable walking shoes with good support',
            'Sun protection (hat, sunglasses, sunscreen)',
            'Refillable water bottle',
            'Camera or smartphone for photos',
            exp.duration.includes('full') ? 'Light snacks' : 'Small daypack',
            'Cash for optional purchases in souks'
        ],
        clothingRecommendations: (exp) =>
            'Modest, comfortable clothing suitable for walking. Lightweight, breathable fabrics recommended. Cover shoulders and knees when visiting religious sites.',
        seasonalNotes: (exp) =>
            'Summer (Jun-Aug): Very hot, start early morning. Spring/Fall (Mar-May, Sep-Nov): Ideal weather. Winter (Dec-Feb): Mild, bring light jacket for evenings.',
        healthConsiderations: (exp) => [
            'Stay hydrated throughout the tour',
            'Wear sunscreen even on cloudy days',
            'Inform guide of any mobility limitations'
        ]
    },

    'Desert Trips': {
        requirements: (exp) => [
            'Ability to sit comfortably for extended periods',
            'Comfortable with outdoor activities',
            exp.title.toLowerCase().includes('camel') ? 'Able to mount and dismount a camel with assistance' : 'No special physical requirements'
        ],
        whatToBring: (exp) => [
            'Closed-toe shoes (sandals not recommended)',
            'Sunglasses and sun hat',
            'High SPF sunscreen',
            'Light scarf or bandana for dust protection',
            'Warm layer for evening (desert temperatures drop significantly)',
            'Camera with protective case',
            'Personal medications'
        ],
        clothingRecommendations: (exp) =>
            'Lightweight, long-sleeved clothing to protect from sun. Avoid dark colors. Bring a warm jacket or sweater for evening as temperatures can drop 20°C after sunset.',
        seasonalNotes: (exp) =>
            'Best visited Oct-Apr when temperatures are moderate. Summer months (Jun-Aug) can exceed 40°C during day. Evening temperatures pleasant year-round.',
        healthConsiderations: (exp) => [
            'Drink water frequently to prevent dehydration',
            'Not recommended for pregnant travelers',
            'Inform guide of back or neck issues before camel riding'
        ],
        safetyGuidelines: (exp) => [
            'Follow guide instructions at all times',
            'Stay with the group in desert areas',
            'Protect electronics from sand',
            'Keep hydrated even if not feeling thirsty'
        ]
    },

    'Adventures': {
        requirements: (exp) => {
            const isHiking = exp.title.toLowerCase().includes('mountain') || exp.title.toLowerCase().includes('trek') || exp.title.toLowerCase().includes('hike');
            return isHiking ? [
                'Good physical fitness required',
                'Experience with hiking recommended',
                'Comfortable with altitude changes',
                'No fear of heights for mountain trails'
            ] : [
                'Moderate fitness level required',
                'Adventurous spirit and willingness to try new activities',
                'Comfortable with outdoor environments'
            ];
        },
        whatToBring: (exp) => {
            const isHiking = exp.title.toLowerCase().includes('mountain') || exp.title.toLowerCase().includes('trek');
            return isHiking ? [
                'Sturdy hiking boots with ankle support',
                'Backpack (20-30L capacity)',
                'Multiple water bottles (2L minimum)',
                'Energy snacks and trail mix',
                'First aid kit',
                'Sunscreen and lip balm with SPF',
                'Trekking poles (optional but recommended)',
                'Rain jacket or windbreaker',
                'Extra layers for altitude'
            ] : [
                'Athletic shoes or hiking boots',
                'Daypack for personal items',
                'Water bottle',
                'Sunscreen and hat',
                'Light jacket',
                'Camera'
            ];
        },
        clothingRecommendations: (exp) =>
            'Layered athletic clothing. Moisture-wicking base layer, insulating mid-layer, waterproof outer layer. Avoid cotton. Bring extra socks.',
        ageRestrictions: (exp) => ({
            min: exp.title.toLowerCase().includes('mountain') ? 14 : 12,
            max: 65
        }),
        healthConsiderations: (exp) => [
            'Not suitable for pregnant travelers',
            'Not recommended for people with heart conditions',
            'Not recommended for people with respiratory issues',
            'Inform guide of any medical conditions',
            'Carry personal medications'
        ],
        safetyGuidelines: (exp) => [
            'Always stay with your guide',
            'Follow all safety instructions carefully',
            'Inform guide immediately if feeling unwell',
            'Pace yourself and take breaks as needed',
            'Check weather forecast before departure'
        ]
    },

    'Food & Culture': {
        requirements: (exp) => {
            const isCooking = exp.title.toLowerCase().includes('cooking') || exp.title.toLowerCase().includes('class');
            return isCooking ? [
                'Interest in Moroccan cuisine',
                'Willingness to participate hands-on',
                'Comfortable standing for 2-3 hours'
            ] : [
                'Open to trying new flavors and dishes',
                'Ability to walk between food stops',
                'Comfortable eating street food'
            ];
        },
        whatToBring: (exp) => {
            const isCooking = exp.title.toLowerCase().includes('cooking');
            return isCooking ? [
                'Apron (usually provided, but bring if preferred)',
                'Hair tie if you have long hair',
                'Camera for recipe photos',
                'Notebook for recipe notes (optional)',
                'Comfortable closed-toe shoes'
            ] : [
                'Comfortable walking shoes',
                'Light appetite (you\'ll be tasting multiple dishes)',
                'Camera for food photos',
                'Cash for optional purchases',
                'Hand sanitizer'
            ];
        },
        clothingRecommendations: (exp) =>
            exp.title.toLowerCase().includes('cooking')
                ? 'Comfortable, casual clothing. Avoid loose sleeves. Closed-toe shoes required in kitchen.'
                : 'Casual, comfortable clothing suitable for walking. Modest dress appreciated.',
        healthConsiderations: (exp) => [
            'Inform guide of any food allergies or dietary restrictions in advance',
            'Vegetarian and vegan options available upon request',
            'All food prepared in hygienic conditions',
            'Bottled water provided throughout'
        ],
        beforeArrivalInstructions: (exp) => [
            'Avoid heavy meals 2-3 hours before the experience',
            'Inform us of allergies at least 24 hours in advance',
            exp.title.toLowerCase().includes('cooking') ? 'Arrive with clean hands and tied-back hair' : 'Come with an open mind and appetite',
            'Let us know if you have specific dietary requirements'
        ]
    },

    'Wellness': {
        requirements: (exp) => {
            const isYoga = exp.title.toLowerCase().includes('yoga');
            const isSpa = exp.title.toLowerCase().includes('spa') || exp.title.toLowerCase().includes('hammam');

            if (isYoga) return [
                'No prior yoga experience necessary',
                'Ability to sit and move on floor',
                'Comfortable with gentle physical activity'
            ];
            if (isSpa) return [
                'Comfortable with traditional bathing practices',
                'No skin conditions or open wounds',
                'Comfortable being attended by same-gender staff'
            ];
            return ['Open to wellness practices', 'Relaxed mindset'];
        },
        whatToBring: (exp) => {
            const isYoga = exp.title.toLowerCase().includes('yoga');
            const isSpa = exp.title.toLowerCase().includes('spa') || exp.title.toLowerCase().includes('hammam');

            if (isYoga) return [
                'Yoga mat (or use provided)',
                'Comfortable, stretchy clothing',
                'Water bottle',
                'Towel',
                'Hair tie for long hair'
            ];
            if (isSpa) return [
                'Swimsuit or comfortable underwear',
                'Flip-flops or sandals',
                'Personal toiletries if preferred',
                'Change of clothes',
                'Small bag for personal items'
            ];
            return ['Comfortable clothing', 'Open mind', 'Water bottle'];
        },
        clothingRecommendations: (exp) => {
            const isYoga = exp.title.toLowerCase().includes('yoga');
            const isSpa = exp.title.toLowerCase().includes('spa') || exp.title.toLowerCase().includes('hammam');

            if (isYoga) return 'Comfortable, stretchy athletic wear. Layers recommended. Barefoot practice. Avoid jewelry.';
            if (isSpa) return 'Bring swimsuit or comfortable underwear for treatments. Robes and towels provided. Loose, comfortable clothing for after.';
            return 'Comfortable, loose-fitting clothing. Natural fabrics preferred.';
        },
        healthConsiderations: (exp) => {
            const isSpa = exp.title.toLowerCase().includes('spa') || exp.title.toLowerCase().includes('hammam');
            return isSpa ? [
                'Not recommended during pregnancy (consult doctor)',
                'Inform staff of any skin sensitivities',
                'Avoid if you have fever or illness',
                'Not suitable for people with heart conditions',
                'Inform staff of recent surgeries or injuries'
            ] : [
                'Inform instructor of any injuries or limitations',
                'Practice at your own pace',
                'Stay hydrated before and after',
                'Avoid heavy meals 2 hours before'
            ];
        },
        beforeArrivalInstructions: (exp) => {
            const isYoga = exp.title.toLowerCase().includes('yoga');
            return isYoga ? [
                'Arrive 10 minutes early to settle in',
                'Avoid eating heavy meals 2 hours before',
                'Use restroom before class',
                'Remove jewelry and watches',
                'Turn off mobile phone'
            ] : [
                'Arrive 15 minutes early for check-in',
                'Shower before arrival if possible',
                'Avoid alcohol 24 hours before',
                'Inform staff of any health conditions',
                'Bring valuables to minimum'
            ];
        }
    },

    'Transport': {
        requirements: (exp) => [
            'Valid booking confirmation',
            'Punctuality required',
            exp.title.toLowerCase().includes('airport') ? 'Flight details must be provided in advance' : 'Pickup location must be confirmed 24h before'
        ],
        whatToBring: (exp) => [
            'Booking confirmation (digital or printed)',
            'Valid ID or passport',
            'Phone with charged battery',
            exp.title.toLowerCase().includes('airport') ? 'Flight tickets and boarding pass' : 'Hotel address or pickup location details',
            'Cash for optional tips'
        ],
        beforeArrivalInstructions: (exp) => [
            'Confirm pickup time and location 24 hours in advance',
            'Provide accurate flight details if airport transfer',
            'Be ready at pickup point 5 minutes early',
            'Save driver contact number',
            'Inform us of any delays immediately'
        ],
        importantNotes: (exp) => [
            'Driver will wait maximum 15 minutes after scheduled time',
            'Extra luggage may incur additional fees',
            'Child seats available upon request (must book in advance)',
            'Smoking not permitted in vehicles',
            'Maximum luggage: 2 large bags + 1 carry-on per person'
        ],
        safetyGuidelines: (exp) => [
            'Verify driver identity before entering vehicle',
            'Wear seatbelts at all times',
            'Keep valuables secure',
            'Share trip details with someone you trust'
        ]
    },

    'Shopping': {
        requirements: (exp) => [
            'Comfortable with bargaining and negotiation',
            'Ability to walk for extended periods',
            'Patience for browsing and shopping',
            'Basic understanding that haggling is cultural norm'
        ],
        whatToBring: (exp) => [
            'Comfortable walking shoes',
            'Cash in local currency (MAD) and euros',
            'Large bag or backpack for purchases',
            'Calculator or phone for price conversions',
            'List of items you\'re interested in',
            'Measurements if buying clothing',
            'Photos of items you\'re looking for'
        ],
        clothingRecommendations: (exp) =>
            'Comfortable, modest clothing suitable for walking. Avoid expensive jewelry. Wear comfortable shoes as souks have uneven surfaces.',
        beforeArrivalInstructions: (exp) => [
            'Research typical prices beforehand',
            'Set a budget for purchases',
            'Bring mix of cash denominations',
            'Know your measurements for clothing/rugs',
            'Have hotel address for delivery arrangements'
        ],
        importantNotes: (exp) => [
            'Bargaining expected - start at 40-50% of asking price',
            'Guide will assist with negotiations',
            'Shipping can be arranged for large items',
            'Keep receipts for customs',
            'Credit cards rarely accepted in souks',
            'Authentic certificates provided for valuable items'
        ],
        safetyGuidelines: (exp) => [
            'Keep valuables secure and out of sight',
            'Stay with your guide in crowded areas',
            'Be aware of pickpockets in busy souks',
            'Don\'t display large amounts of cash',
            'Verify authenticity before purchasing expensive items'
        ]
    },

    'Culture': {
        requirements: (exp) => {
            const isWorkshop = exp.title.toLowerCase().includes('workshop') || exp.title.toLowerCase().includes('class');
            return isWorkshop ? [
                'Interest in traditional crafts',
                'Patience for detailed work',
                'Willingness to learn new skills',
                'Comfortable sitting for extended periods'
            ] : [
                'Respectful attitude toward local customs',
                'Interest in Moroccan culture and history',
                'Open mind to new experiences'
            ];
        },
        whatToBring: (exp) => {
            const isWorkshop = exp.title.toLowerCase().includes('workshop');
            return isWorkshop ? [
                'Camera for process documentation',
                'Notebook for notes (optional)',
                'Comfortable clothing that can get dirty',
                'Enthusiasm and creativity'
            ] : [
                'Camera (photography may be restricted in some areas)',
                'Notebook for interesting facts',
                'Respectful attire',
                'Curiosity and questions'
            ];
        },
        clothingRecommendations: (exp) =>
            'Modest, respectful clothing required. Cover shoulders and knees. Remove shoes when entering homes or religious sites. Scarves provided for women visiting mosques.',
        healthConsiderations: (exp) => [
            'Inform guide of any allergies if food tasting included',
            'Comfortable seating provided for elderly participants',
            'Breaks included for longer experiences'
        ],
        beforeArrivalInstructions: (exp) => [
            'Research basic Moroccan customs beforehand',
            'Prepare questions for your guide',
            'Arrive with respectful mindset',
            'Turn off phone during cultural demonstrations',
            'Ask permission before taking photos of people'
        ],
        importantNotes: (exp) => [
            'Photography restrictions apply in certain areas',
            'Respectful behavior required at all times',
            'Remove shoes when entering traditional homes',
            'Accept hospitality graciously (mint tea, etc.)',
            'Tips for artisans appreciated but not required'
        ]
    }
};

// Default generator for categories not specifically defined
const defaultGenerator = {
    requirements: (exp) => [
        'Basic fitness level required',
        'Comfortable with the activity type',
        'Willingness to follow guide instructions'
    ],
    whatToBring: (exp) => [
        'Comfortable clothing and shoes',
        'Sun protection',
        'Water bottle',
        'Camera',
        'Personal items'
    ],
    clothingRecommendations: (exp) =>
        'Comfortable, weather-appropriate clothing. Modest dress recommended.',
    seasonalNotes: (exp) =>
        'Available year-round. Best weather Mar-May and Sep-Nov.',
    healthConsiderations: (exp) => [
        'Inform guide of any health conditions',
        'Carry personal medications',
        'Stay hydrated'
    ]
};

// Generate age restrictions based on activity type
function generateAgeRestrictions(experience) {
    const title = experience.title.toLowerCase();
    const category = experience.category.toLowerCase();

    // Adventure activities
    if (category.includes('adventure') || title.includes('mountain') || title.includes('trek')) {
        return { min: 14, max: 65 };
    }

    // Desert trips with camels
    if (title.includes('camel') || title.includes('desert')) {
        return { min: 10, max: 70 };
    }

    // Cooking classes
    if (title.includes('cooking') || title.includes('class')) {
        return { min: 12, max: null };
    }

    // Wellness/Spa
    if (category.includes('wellness') || title.includes('spa') || title.includes('hammam')) {
        return { min: 16, max: null };
    }

    // City tours
    if (category.includes('city') || category.includes('tour')) {
        return { min: 8, max: null };
    }

    // Default
    return { min: 12, max: null };
}

// Generate accessibility information
function generateAccessibility(experience) {
    const title = experience.title.toLowerCase();
    const category = experience.category.toLowerCase();

    if (category.includes('adventure') || title.includes('mountain') || title.includes('trek') || title.includes('camel')) {
        return [
            'Not wheelchair accessible',
            'Not suitable for people with mobility issues',
            'Requires good physical fitness',
            'Service animals allowed with prior notice'
        ];
    }

    if (category.includes('city') && !title.includes('walking')) {
        return [
            'Partially wheelchair accessible (some areas have steps)',
            'Strollers allowed but may be difficult in narrow streets',
            'Service animals welcome',
            'Accessible restrooms available at meeting point'
        ];
    }

    if (category.includes('transport')) {
        return [
            'Wheelchair accessible vehicles available upon request',
            'Please inform us of accessibility needs when booking',
            'Service animals welcome',
            'Assistance provided for boarding/alighting'
        ];
    }

    if (category.includes('wellness') || category.includes('food')) {
        return [
            'Ground floor access available',
            'Wheelchair accessible with assistance',
            'Service animals allowed',
            'Accessible facilities available'
        ];
    }

    return [
        'Limited wheelchair accessibility',
        'Please contact us for specific accessibility needs',
        'Service animals allowed with prior notice',
        'We will do our best to accommodate all guests'
    ];
}

// Main generation function
async function generateInstructions() {
    try {
        console.log('🔍 Fetching all experiences from database...\n');

        const experiences = await prisma.experience.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                duration: true,
                shortDescription: true,
                fullDescription: true,
                included: true,
                notIncluded: true,
                location: true
            }
        });

        console.log(`📊 Found ${experiences.length} experiences\n`);
        console.log('🎨 Generating unique instructions for each experience...\n');

        const updates = [];

        for (const exp of experiences) {
            const generator = instructionGenerators[exp.category] || defaultGenerator;

            // Generate all instruction fields
            const importantInfo = {
                requirements: typeof generator.requirements === 'function'
                    ? generator.requirements(exp)
                    : generator.requirements,

                whatToBring: typeof generator.whatToBring === 'function'
                    ? generator.whatToBring(exp)
                    : generator.whatToBring,

                ageRestrictions: generator.ageRestrictions
                    ? (typeof generator.ageRestrictions === 'function' ? generator.ageRestrictions(exp) : generator.ageRestrictions)
                    : generateAgeRestrictions(exp),

                accessibility: generator.accessibility
                    ? (typeof generator.accessibility === 'function' ? generator.accessibility(exp) : generator.accessibility)
                    : generateAccessibility(exp),

                clothingRecommendations: typeof generator.clothingRecommendations === 'function'
                    ? generator.clothingRecommendations(exp)
                    : generator.clothingRecommendations,

                seasonalNotes: generator.seasonalNotes
                    ? (typeof generator.seasonalNotes === 'function' ? generator.seasonalNotes(exp) : generator.seasonalNotes)
                    : 'Available year-round. Best weather conditions March-May and September-November.',

                healthConsiderations: typeof generator.healthConsiderations === 'function'
                    ? generator.healthConsiderations(exp)
                    : generator.healthConsiderations,

                safetyGuidelines: generator.safetyGuidelines
                    ? (typeof generator.safetyGuidelines === 'function' ? generator.safetyGuidelines(exp) : generator.safetyGuidelines)
                    : ['Follow guide instructions', 'Stay with the group', 'Inform guide of any concerns'],

                beforeArrivalInstructions: generator.beforeArrivalInstructions
                    ? (typeof generator.beforeArrivalInstructions === 'function' ? generator.beforeArrivalInstructions(exp) : generator.beforeArrivalInstructions)
                    : ['Confirm booking 24 hours before', 'Arrive 10 minutes early', 'Bring confirmation email'],

                importantNotes: generator.importantNotes
                    ? (typeof generator.importantNotes === 'function' ? generator.importantNotes(exp) : generator.importantNotes)
                    : ['Cancellation policy applies', 'Weather dependent', 'Subject to availability']
            };

            updates.push({
                id: exp.id,
                title: exp.title,
                category: exp.category,
                importantInfo
            });

            console.log(`✅ Generated instructions for: ${exp.title}`);
        }

        console.log(`\n📝 Updating ${updates.length} experiences in database...\n`);

        // Update database
        for (const update of updates) {
            await prisma.experience.update({
                where: { id: update.id },
                data: {
                    importantInfo: update.importantInfo
                }
            });
            console.log(`💾 Updated: ${update.title}`);
        }

        console.log(`\n✨ Successfully generated and saved unique instructions for ${updates.length} experiences!`);
        console.log('\n📋 Summary by category:');

        const categoryCounts = updates.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + 1;
            return acc;
        }, {});

        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} experiences`);
        });

    } catch (error) {
        console.error('❌ Error generating instructions:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the generator
if (require.main === module) {
    generateInstructions()
        .then(() => {
            console.log('\n🎉 All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { generateInstructions };
