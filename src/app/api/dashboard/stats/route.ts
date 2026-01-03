import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Fetch User Data (Loyalty Points & Wishlist count)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                loyaltyPoints: true,
                wishlist: true,
                name: true
            }
        });

        // 2. Fetch Booking Stats
        const bookings = await prisma.booking.findMany({
            where: { userId: userId },
            orderBy: { date: 'asc' }, // Get upcoming first
            select: {
                id: true,
                date: true,
                status: true,
                activityTitle: true,
                activityId: true // To fetch image if needed
            }
        });

        const totalBookings = bookings.length;

        // Find next upcoming confirmed booking
        const now = new Date();
        const upcomingTrip = bookings.find(b =>
            (b.status === 'CONFIRMED' || b.status === 'PENDING') &&
            new Date(b.date) > now
        );

        // 3. Fetch Unread Messages
        const unreadMessagesInfo = await prisma.message.count({
            where: {
                conversation: { userId: userId },
                sender: { not: userId }, // Messages sent by others (admin/support)
                read: false
            }
        });

        // 4. Get Image for upcoming trip if exists
        let upcomingTripImage = null;
        if (upcomingTrip) {
            const service = await prisma.service.findUnique({
                where: { id: upcomingTrip.activityId },
                select: { images: true }
            });
            if (service?.images) {
                try {
                    const images = (service.images as unknown as string[]) || [];
                    upcomingTripImage = Array.isArray(images) ? images[0] : null;
                } catch (e) { }
            }
        }

        // 5. Fetch Recommended Services (Top Rated)
        const recommendedServices = await prisma.service.findMany({
            take: 3,
            orderBy: { rating: 'desc' },
            select: {
                id: true,
                title: true,
                price: true,
                rating: true,
                images: true,
                duration: true
            }
        });

        // Process images for services
        const formattedServices = recommendedServices.map(service => {
            let image = null;
            if (service.images) {
                try {
                    const parsed = (service.images as unknown as string[]) || [];
                    image = Array.isArray(parsed) ? parsed[0] : null;
                } catch (e) { }
            }
            return {
                ...service,
                imageUrl: image
            };
        });

        return NextResponse.json({
            user: {
                name: user?.name,
                loyaltyPoints: user?.loyaltyPoints || 0,
                wishlistCount: user?.wishlist?.length || 0,
            },
            stats: {
                totalBookings,
                unreadMessages: unreadMessagesInfo
            },
            upcomingTrip: upcomingTrip ? {
                ...upcomingTrip,
                imageUrl: upcomingTripImage
            } : null,
            recommendations: formattedServices
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
