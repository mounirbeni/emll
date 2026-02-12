/**
 * Verify Generated Instructions
 * 
 * This script samples and displays generated instructions to verify uniqueness and accuracy
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyInstructions() {
    try {
        console.log('🔍 Sampling generated instructions for verification...\n');

        // Sample experiences from different categories
        const samples = [
            { category: 'Wellness', title: 'Rooftop Sunrise Yoga' },
            { category: 'Desert Experiences', title: 'Agafay Sunset Camel Ride + Dinner Show' },
            { category: 'Food & Drink', title: 'Moroccan Cooking Class & Market Tour' },
            { category: 'City Tours', title: 'Evening Jemaa El Fna Tour' },
            { category: 'Sports & Adventure', title: 'Mountain Biking in Atlas' },
            { category: 'Transfers', title: 'Airport Transfer - Arrival' },
            { category: 'Workshops & Culture', title: 'Pottery & Zellige Artisan Workshop' }
        ];

        for (const sample of samples) {
            const exp = await prisma.experience.findFirst({
                where: {
                    title: { contains: sample.title }
                },
                select: {
                    title: true,
                    category: true,
                    importantInfo: true
                }
            });

            if (exp) {
                console.log(`\n${'='.repeat(80)}`);
                console.log(`📌 ${exp.title}`);
                console.log(`📂 Category: ${exp.category}`);
                console.log(`${'='.repeat(80)}\n`);

                const info = exp.importantInfo;

                console.log('✅ REQUIREMENTS:');
                if (info.requirements) {
                    info.requirements.forEach((req, i) => console.log(`   ${i + 1}. ${req}`));
                }

                console.log('\n🎒 WHAT TO BRING:');
                if (info.whatToBring) {
                    info.whatToBring.forEach((item, i) => console.log(`   ${i + 1}. ${item}`));
                }

                console.log('\n👕 CLOTHING RECOMMENDATIONS:');
                console.log(`   ${info.clothingRecommendations}`);

                console.log('\n🏥 HEALTH CONSIDERATIONS:');
                if (info.healthConsiderations) {
                    info.healthConsiderations.forEach((health, i) => console.log(`   ${i + 1}. ${health}`));
                }

                if (info.safetyGuidelines && info.safetyGuidelines.length > 0) {
                    console.log('\n⚠️  SAFETY GUIDELINES:');
                    info.safetyGuidelines.forEach((safety, i) => console.log(`   ${i + 1}. ${safety}`));
                }

                if (info.beforeArrivalInstructions && info.beforeArrivalInstructions.length > 0) {
                    console.log('\n📋 BEFORE ARRIVAL:');
                    info.beforeArrivalInstructions.forEach((instruction, i) => console.log(`   ${i + 1}. ${instruction}`));
                }

                console.log('\n🌍 SEASONAL NOTES:');
                console.log(`   ${info.seasonalNotes}`);

                console.log('\n♿ ACCESSIBILITY:');
                if (info.accessibility) {
                    info.accessibility.forEach((access, i) => console.log(`   ${i + 1}. ${access}`));
                }

                console.log('\n👶 AGE RESTRICTIONS:');
                console.log(`   Minimum: ${info.ageRestrictions?.min || 'None'}`);
                console.log(`   Maximum: ${info.ageRestrictions?.max || 'None'}`);
            }
        }

        console.log(`\n\n${'='.repeat(80)}`);
        console.log('✅ VERIFICATION COMPLETE');
        console.log(`${'='.repeat(80)}\n`);

        // Check for any experiences without instructions
        const total = await prisma.experience.count();
        const withInstructions = await prisma.experience.count({
            where: {
                NOT: {
                    importantInfo: { equals: {} }
                }
            }
        });

        console.log(`📊 Coverage Statistics:`);
        console.log(`   Total experiences: ${total}`);
        console.log(`   With instructions: ${withInstructions}`);
        console.log(`   Coverage: ${((withInstructions / total) * 100).toFixed(1)}%\n`);

    } catch (error) {
        console.error('❌ Error verifying instructions:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    verifyInstructions()
        .then(() => {
            console.log('🎉 Verification complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { verifyInstructions };
