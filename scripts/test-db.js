const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    console.log('Testing connection...');
    const prisma = new PrismaClient();
    try {
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);
    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
