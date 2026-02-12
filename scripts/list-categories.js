/**
 * List all unique categories in the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listCategories() {
    try {
        const experiences = await prisma.experience.findMany({
            select: {
                category: true
            },
            distinct: ['category']
        });

        console.log('\n📂 Unique Categories in Database:\n');
        experiences.forEach((exp, i) => {
            console.log(`   ${i + 1}. ${exp.category}`);
        });

        console.log(`\n📊 Total: ${experiences.length} unique categories\n`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listCategories();
