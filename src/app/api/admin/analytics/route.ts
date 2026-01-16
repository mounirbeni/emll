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

        // Bookings over time (daily breakdown)
        const recentTrends: Array<{ date: string; bookings: number; revenue: number }> = []
        for (let i = days - 1; i >= 0; i--) {
            const date = startOfDay(subDays(new Date(), i))
            const nextDate = startOfDay(subDays(new Date(), i - 1))
            
            const dayBookings = await prisma.booking.count({
                where: {
                    date: { gte: date, lt: nextDate },
                    status: { not: 'CANCELLED' }
                }
            })
            
            const dayRevenue = await prisma.booking.aggregate({
                where: {
                    date: { gte: date, lt: nextDate },
                    status: { not: 'CANCELLED' }
                },
                _sum: { totalPrice: true }
            })
            
            recentTrends.push({
                date: date.toISOString(),
                bookings: dayBookings,
                revenue: decimalToNumber(dayRevenue._sum.totalPrice)
            })
        }

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

        // Fix N+1: Fetch all services in one query
        const activityIds = topServicesData
            .filter(item => item.activityId)
            .map(item => item.activityId!);
        
        const services = activityIds.length > 0
            ? await prisma.service.findMany({
                where: { id: { in: activityIds } },
                select: { id: true, title: true }
            })
            : [];

        const serviceMap = new Map(services.map(s => [s.id, s.title]));

        const topServices = topServicesData
            .filter(item => item.activityId)
            .map((item) => {
                const serviceTitle = serviceMap.get(item.activityId!) || item.activityTitle || 'Unknown Service';
                return {
                    id: item.activityId || 'unknown',
                    title: serviceTitle,
                    bookings: item._count.id,
                    revenue: item._sum.totalPrice || 0
                };
            });

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
            recentTrends
        };

        return successResponse(analytics);
    } catch (error) {
        return errorResponse(error);
    }
}

