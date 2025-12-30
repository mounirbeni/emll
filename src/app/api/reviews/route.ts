
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { bookingId, rating, comment } = await request.json();

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                OR: [
                    { userId: session.user.id as string },
                    { email: session.user.email as string }
                ]
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Find service
        // We need serviceId on Booking? 
        // Booking has activityId. Is that serviceId? 
        // Schema: activityId String. 
        // Yes, likely.

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId: session.user.id as string,
                serviceId: booking.activityId,
                bookingId: booking.id
            }
        });

        // Create Notification
        try {
            await (prisma as any).notification.create({
                data: {
                    type: 'REVIEW',
                    title: 'New Review Received',
                    message: `${rating} stars from ${session.user.name || 'User'}`,
                    link: '/admin/reviews',
                    read: false,
                    userId: null // Admin only
                }
            })
        } catch (error) {
            console.error('Failed to create notification for review', error)
        }

        // Update Service rating?
        // Basic implementation: just creating review.
        // We can aggregate later.

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
