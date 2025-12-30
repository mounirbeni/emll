import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set in environment variables!')
        console.error('Please add DATABASE_URL to your .env.local file')
        throw new Error('DATABASE_URL environment variable is required')
    }

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
