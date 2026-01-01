import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                loyaltyPoints: true,
                canMessage: true,
                _count: {
                    select: { bookings: true, reviews: true }
                }
            }
        });

        if (!user) {
            return errorResponse(new Error('Customer not found'));
        }

        // Get detailed booking statistics
        const [totalSpent, bookingStats, recentBookings, firstBooking, avgBookingValue] = await Promise.all([
            prisma.booking.aggregate({
                where: {
                    userId: id,
                    status: { not: 'CANCELLED' }
                },
                _sum: { totalPrice: true }
            }),
            prisma.booking.groupBy({
                by: ['status'],
                where: { userId: id },
                _count: { id: true }
            }),
            prisma.booking.findMany({
                where: { userId: id },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    id: true,
                    activityTitle: true,
                    date: true,
                    status: true,
                    totalPrice: true,
                    guests: true,
                    createdAt: true,
                    paymentStatus: true
                }
            }),
            prisma.booking.findFirst({
                where: { userId: id },
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.booking.aggregate({
                where: {
                    userId: id,
                    status: { not: 'CANCELLED' }
                },
                _avg: { totalPrice: true },
                _count: { id: true }
            })
        ]);

        const statusBreakdown = bookingStats.reduce((acc, stat) => {
            acc[stat.status] = stat._count.id;
            return acc;
        }, {} as Record<string, number>);

        return successResponse({
            ...user,
            totalSpent: totalSpent._sum.totalPrice || 0,
            avgBookingValue: avgBookingValue._avg.totalPrice || 0,
            statusBreakdown: {
                PENDING: statusBreakdown['PENDING'] || 0,
                CONFIRMED: statusBreakdown['CONFIRMED'] || 0,
                COMPLETED: statusBreakdown['COMPLETED'] || 0,
                CANCELLED: statusBreakdown['CANCELLED'] || 0
            },
            recentBookings,
            firstBookingDate: firstBooking?.createdAt || null,
            totalReviews: user._count.reviews
        });
    } catch (error) {
        return errorResponse(error);
    }
}
