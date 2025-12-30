const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true
            }
        });

        console.log('=== DATABASE USERS ===');
        console.log('Total users:', users.length);
        console.log('');

        users.forEach(user => {
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash: ${user.password.substring(0, 30)}...`);
            console.log('---');
        });

        if (users.length === 0) {
            console.log('⚠️ WARNING: No users in database!');
            console.log('This explains why login is failing.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
