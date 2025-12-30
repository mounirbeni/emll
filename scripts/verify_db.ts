
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying User.canMessage exists and is queryable...');
    try {
        // Try to query the field that was missing
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                canMessage: true,
                conversationStatus: true
            }
        });

        console.log('SUCCESS: Query executed without schema error.');
        if (user) {
            console.log(`Found user: ID=${user.id}, canMessage=${user.canMessage}, status=${user.conversationStatus}`);
        } else {
            console.log('No users found in DB, but query structure is valid.');
        }
    } catch (e) {
        console.error('FAILURE: Error querying User.canMessage:', e);
        process.exit(1);
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
