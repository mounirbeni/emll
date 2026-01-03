import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { determineTripState } from '@/lib/trip-logic';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userId = session.user.id;

        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { email: session.user.email || undefined }
                ]
            },
            orderBy: { date: 'asc' }
        });

        const state = determineTripState(bookings);

        // Calculate Stats
        const totalBookings = bookings.length;

        // Loyalty Points: 100 points per completed booking, 50 per pending? Let's say 10 points * total price/10 (Euro spent logic) or simple count. 
        // Simple logic: 200 points per booking.
        const loyaltyPoints = bookings.length * 200;

        // Next Trip Logic
        const now = new Date();
        const futureBookings = bookings.filter(b => new Date(b.date) > now && b.status !== 'CANCELLED');
        const nextTrip = futureBookings.length > 0 ? futureBookings[0] : null;

        let nextTripJson = null;
        if (nextTrip) {
            const diffTime = Math.abs(new Date(nextTrip.date).getTime() - now.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nextTripJson = {
                days: diffDays,
                title: nextTrip.activityTitle
            };
        }

        return NextResponse.json({
            state,
            tripState: state, // redundancy for frontend safety
            bookings,
            stats: {
                totalBookings,
                loyaltyPoints,
                nextTrip: nextTripJson
            },
            user: {
                name: session.user.name || 'Traveler'
            }
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
