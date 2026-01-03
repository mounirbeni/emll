import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { decimalToNumber } from '@/lib/decimal';

export async function GET(request: Request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '30d';

        const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
        const startDate = startOfDay(subDays(new Date(), days));
        const previousStartDate = startOfDay(subDays(startDate, days));
        const previousEndDate = endOfDay(subDays(startDate, 1));

        // Revenue calculations
        const revenueThisPeriod = await prisma.booking.aggregate({
            where: {
                date: { gte: startDate },
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        const revenuePreviousPeriod = await prisma.booking.aggregate({
            where: {
                date: { gte: previousStartDate, lte: previousEndDate },
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        const revenueToday = await prisma.booking.aggregate({
            where: {
                date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        const revenueWeek = await prisma.booking.aggregate({
            where: {
                date: { gte: startOfDay(subDays(new Date(), 7)) },
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        const revenueMonth = await prisma.booking.aggregate({
            where: {
                date: { gte: startOfDay(subDays(new Date(), 30)) },
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        const totalRevenue = await prisma.booking.aggregate({
            where: {
                status: { not: 'CANCELLED' }
            },
            _sum: { totalPrice: true }
        });

        // Bookings calculations
        const bookingsThisPeriod = await prisma.booking.count({
            where: {
                date: { gte: startDate },
                status: { not: 'CANCELLED' }
            }
        });

        const bookingsPreviousPeriod = await prisma.booking.count({
            where: {
                date: { gte: previousStartDate, lte: previousEndDate },
                status: { not: 'CANCELLED' }
            }
        });

        const bookingsToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
                status: { not: 'CANCELLED' }
            }
        });

        const bookingsWeek = await prisma.booking.count({
            where: {
                date: { gte: startOfDay(subDays(new Date(), 7)) },
                status: { not: 'CANCELLED' }
            }
        });

        const bookingsMonth = await prisma.booking.count({
            where: {
                date: { gte: startOfDay(subDays(new Date(), 30)) },
                status: { not: 'CANCELLED' }
            }
        });

        const totalBookings = await prisma.booking.count({
            where: {
                status: { not: 'CANCELLED' }
            }
        });

        // Users
        const totalUsers = await prisma.user.count();
        const newUsersThisWeek = await prisma.user.count({
            where: {
                createdAt: { gte: startOfDay(subDays(new Date(), 7)) }
            }
        });

        // Top services
        const topServicesData = await prisma.booking.groupBy({
            by: ['activityId', 'activityTitle'],
            where: {
                date: { gte: startDate },
                status: { not: 'CANCELLED' }
            },
            _count: { id: true },
            _sum: { totalPrice: true },
            orderBy: { _sum: { totalPrice: 'desc' } },
            take: 5
        });

        const topServices = await Promise.all(
            topServicesData
                .filter(item => item.activityId) // Filter out null activityIds
                .map(async (item) => {
                    let serviceTitle = item.activityTitle;
                    if (item.activityId) {
                        try {
                            const service = await prisma.service.findUnique({
                                where: { id: item.activityId },
                                select: { title: true }
                            });
                            if (service?.title) {
                                serviceTitle = service.title;
                            }
                        } catch (error) {
                            // If service not found, use activityTitle from booking
                            console.warn(`Service ${item.activityId} not found, using activityTitle`);
                        }
                    }
                    return {
                        id: item.activityId || 'unknown',
                        title: serviceTitle || 'Unknown Service',
                        bookings: item._count.id,
                        revenue: item._sum.totalPrice || 0
                    };
                })
        );

        // Calculate percentage changes
        const revenueThis = decimalToNumber(revenueThisPeriod._sum.totalPrice);
        const revenuePrev = decimalToNumber(revenuePreviousPeriod._sum.totalPrice);
        const revenueTodayValue = decimalToNumber(revenueToday._sum.totalPrice);
        const revenueWeekValue = decimalToNumber(revenueWeek._sum.totalPrice);
        const revenueMonthValue = decimalToNumber(revenueMonth._sum.totalPrice);
        const revenueTotalValue = decimalToNumber(totalRevenue._sum.totalPrice);

        const revenueChange = revenuePrev
            ? ((revenueThis - revenuePrev) / (revenuePrev || 1)) * 100
            : 0;

        const bookingsChange = bookingsPreviousPeriod
            ? ((bookingsThisPeriod - bookingsPreviousPeriod) / bookingsPreviousPeriod) * 100
            : 0;

        const analytics = {
            revenue: {
                today: revenueTodayValue,
                week: revenueWeekValue,
                month: revenueMonthValue,
                total: revenueTotalValue,
                change: revenueChange
            },
            bookings: {
                today: bookingsToday,
                week: bookingsWeek,
                month: bookingsMonth,
                total: totalBookings,
                change: bookingsChange
            },
            users: {
                total: totalUsers,
                newThisWeek: newUsersThisWeek,
                change: 0 // Can be calculated if needed
            },
            topServices,
            recentTrends: [] // Can be enhanced with daily breakdown
        };

        return successResponse(analytics);
    } catch (error) {
        return errorResponse(error);
    }
}

