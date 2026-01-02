const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
    try {
        // Create test client
        const clientPassword = await bcrypt.hash('password123', 10);
        const client = await prisma.user.upsert({
            where: { email: 'client@test.com' },
            update: { password: clientPassword },
            create: {
                email: 'client@test.com',
                password: clientPassword,
                name: 'Test Client',
                role: 'CUSTOMER'
            }
        });
        console.log('✅ Created/Updated client:', client.email);

        // Create admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@marrakech.com' },
            update: { password: adminPassword },
            create: {
                email: 'admin@marrakech.com',
                password: adminPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });
        console.log('✅ Created/Updated admin:', admin.email);

        console.log('\n📋 Credentials:');
        console.log('Client: client@test.com / password123');
        console.log('Admin: admin@marrakech.com / admin123');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUsers();
