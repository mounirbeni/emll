const { PrismaClient } = require('@prisma/client');

async function testBlog() {
    console.log('Testing blog connection...');
    const prisma = new PrismaClient();
    try {
        const count = await prisma.blogPost.count();
        console.log(`Successfully connected! Found ${count} blog posts.`);
        const posts = await prisma.blogPost.findMany();
        console.log(`Retrieved ${posts.length} posts.`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

testBlog();
