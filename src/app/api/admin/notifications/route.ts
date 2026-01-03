import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        // Re-validating Prisma types
        // Since we don't have a dedicated Notification model in the schema yet,
        // we will generate notifications on the fly from recent events.
        // In a real app, you'd want a Notification table.
        // For this task, I'll simulate notifications based on recent bookings and complaints.

        const recentBookings = await prisma.booking.findMany({
            where: {
                status: 'PENDING'
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        })

        const recentComplaints = await prisma.supportRequest.findMany({

            where: {
                status: 'PENDING'
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        const notifications = [
            ...recentBookings.map((b) => ({
                id: `booking-${b.id}`,
                type: 'BOOKING',
                title: 'New Booking',
                message: `${b.name} booked ${b.activityTitle}`,
                read: false, // In this simulation, pending items are "unread"
                createdAt: b.createdAt,
                link: '/admin/bookings'
            })),
            ...recentComplaints.map((c: any) => ({
                id: `complaint-${c.id}`,
                type: 'COMPLAINT',
                title: 'New Support Request',
                message: `${c.subject} from ${c.name}`,
                read: false,
                createdAt: c.createdAt,
                link: '/admin/complaints'
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return NextResponse.json(notifications)
    } catch (error) {
        console.error('[NOTIFICATIONS_PATCH]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
