import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        await prisma.$connect()
        console.log('Connected successfully.')

        console.log('Checking Booking table...')
        const count = await prisma.booking.count()
        console.log(`Found ${count} bookings.`)

        console.log('Database check passed.')
    } catch (error) {
        console.error('Database check failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
