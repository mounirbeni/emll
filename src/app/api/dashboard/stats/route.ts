import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { auth } from '@/auth';
import { successResponse } from '@/lib/api-response';

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

        // 2. Fetch Booking Stats with service images (fixes N+1)
        const bookings = await prisma.booking.findMany({
            where: { userId: userId },
            orderBy: { date: 'asc' }, // Get upcoming first
            select: { // Added select object
                id: true,
                date: true,
                status: true,
                experience: {
                    select: { title: true }
                },
                experienceId: true
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

        return successResponse({
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
                activityTitle: upcomingTrip.experience.title,
                activityId: upcomingTrip.experienceId
            } : null,
            recommendations: []
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
