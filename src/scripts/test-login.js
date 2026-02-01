const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin(email, password) {
    try {
        console.log(`\n=== Testing login for: ${email} ===`);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ User not found in database');
            return false;
        }

        console.log('✅ User found');
        console.log('Stored password hash:', user.password.substring(0, 30) + '...');

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            console.log('✅ Password is CORRECT');
            return true;
        } else {
            console.log('❌ Password is INCORRECT');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function main() {
    console.log('=== LOGIN VERIFICATION TEST ===\n');

    // Test the credentials from the script
    await testLogin('client@test.com', 'password123');
    await testLogin('admin@test.com', 'admin123');

    await prisma.$disconnect();
}

main();
