import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.experience.count();
    console.log(`Total experiences: ${count}`);

    if (count > 0) {
        const first = await prisma.experience.findFirst();
        console.log('First experience sample:', JSON.stringify(first, null, 2));

        const enabledCount = await prisma.experience.count({ where: { enabled: true } });
        console.log(`Enabled experiences: ${enabledCount}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
