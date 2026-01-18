/**
 * Admin Service
 * Contains all business logic for admin operations and dashboard
 */

import { bookingRepository } from '@/repositories/booking.repository';
import { userRepository } from '@/repositories/user.repository';
import { serviceRepository } from '@/repositories/service.repository';
import { paymentRepository } from '@/repositories/payment.repository';
import { reviewRepository } from '@/repositories/review.repository';
import { supportRepository } from '@/repositories/support.repository';
import { decimalToNumber } from '@/lib/decimal';
import { Prisma } from '@prisma/client';

export interface DashboardStats {
    overview: {
        totalBookings: number;
        totalRevenue: number;
        totalUsers: number;
        totalServices: number;
    };
    bookings: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        growth: number; // percentage
    };
    users: {
        total: number;
        active: number;
        new: number; // last 30 days
    };
    recent: {
        bookings: any[];
        reviews: any[];
        supportRequests: any[];
    };
}

export interface AnalyticsData {
    revenue: {
        today: number;
        week: number;
        month: number;
        total: number;
        change: number;
    };
    bookings: {
        today: number;
        week: number;
        month: number;
        total: number;
        change: number;
    };
    users: {
        total: number;
        newThisWeek: number;
        change: number;
    };
    topServices: Array<{
        id: string;
        title: string;
        bookings: number;
        revenue: number;
        rating: number;
        reviewCount: number;
    }>;
    recentTrends: Array<{
        date: string;
        bookings: number;
        revenue: number;
    }>;
}

export class AdminService {
    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get overview stats
        const [totalBookings, totalRevenue, totalUsers, totalServices] = await Promise.all([
            bookingRepository.count(),
            paymentRepository.getSuccessfulPaymentsTotal(),
            userRepository.count(),
            serviceRepository.count()
        ]);

        // Get booking stats by status
        const [pending, confirmed, completed, cancelled] = await Promise.all([
            bookingRepository.countByStatus('PENDING'),
            bookingRepository.countByStatus('CONFIRMED'),
            bookingRepository.countByStatus('COMPLETED'),
            bookingRepository.countByStatus('CANCELLED')
        ]);

        // Get revenue stats
        const thisMonthRevenue = await bookingRepository.getTotalRevenue({
            createdAt: { gte: thisMonthStart },
            status: 'COMPLETED'
        });

        const lastMonthRevenue = await bookingRepository.getTotalRevenue({
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            status: 'COMPLETED'
        });

        const revenueGrowth = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        // Get user stats
        const activeUsersCount = (await userRepository.findActiveUsers(30)).length;
        const newUsers = await userRepository.count({
            createdAt: { gte: thirtyDaysAgo }
        });

        // Get recent data
        const recentBookings = await bookingRepository.findRecent(5);
        const recentReviews = await reviewRepository.findRecent(5);
        const recentSupport = await supportRepository.findRecent(5);

        return {
            overview: {
                totalBookings,
                totalRevenue,
                totalUsers,
                totalServices,
            },
            bookings: {
                pending,
                confirmed,
                completed,
                cancelled,
            },
            revenue: {
                total: totalRevenue,
                thisMonth: thisMonthRevenue,
                lastMonth: lastMonthRevenue,
                growth: revenueGrowth,
            },
            users: {
                total: totalUsers,
                active: activeUsersCount,
                new: newUsers,
            },
            recent: {
                bookings: recentBookings,
                reviews: recentReviews,
                supportRequests: recentSupport,
            },
        };
    }

    async getDailyStats(): Promise<{ bookingsToday: number; revenueToday: number }> {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Get today's bookings count
        const bookingsToday = await bookingRepository.count({
            createdAt: { gte: startOfToday, lte: endOfToday }
        });

        // Get today's revenue from completed bookings
        const revenueToday = await bookingRepository.getTotalRevenue({
            createdAt: { gte: startOfToday, lte: endOfToday },
            status: 'COMPLETED'
        });

        return {
            bookingsToday,
            revenueToday
        };
    }

    /**
     * Get Analytics Data (aggregated)
     */
    async getAnalytics(range: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
        const now = new Date();
        let days = 30;
        if (range === '7d') days = 7;
        if (range === '90d') days = 90;

        const startDate = new Date();
        startDate.setDate(now.getDate() - days);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        // Users
        const totalUsers = await userRepository.count();
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - 7);
        const newUsersWeek = await userRepository.count({ createdAt: { gte: startOfWeek } });

        // Bookings - Total for period
        const periodBookings = await bookingRepository.count({ createdAt: { gte: startDate } });

        // Revenue - Total for period. Using COMPLETED bookings
        const periodRevenue = await bookingRepository.getTotalRevenue({
            createdAt: { gte: startDate },
            status: 'COMPLETED' // Assume revenue only from completed/confirmed? Or Payments? usually confirmed.
        });

        // Top Services (simplified: get all services, count their bookings in period)
        const services = await serviceRepository.findMany({});
        // We'd need to join bookings. This is expensive without raw query or aggregation.
        // For efficiency, we rely on cached rating/reviewCount, but for revenue we need calculation.
        // Let's settle for "Top Rated" or simple loop if N is small.
        // For scalable solution, use Prisma aggregation.
        // Prisma groupBy is good here.
        /*
        const topServicesGrouped = await prisma.booking.groupBy({
             by: ['serviceId'],
             where: { status: 'COMPLETED', createdAt: { gte: startDate } },
             _count: { id: true },
             _sum: { totalPrice: true },
             orderBy: { _sum: { totalPrice: 'desc' } },
             take: 5
        });
        */
        // Since we are in service layer using repositories, we should use repository method.
        // I'll add `getTopServicesAnalytics` to ServiceRepository later or logic here.
        // For now, return placeholders or use basic service details.

        const topServices = services.slice(0, 5).map(s => ({
            id: s.id,
            title: s.title,
            bookings: 0, // Need aggregation
            revenue: 0, // Need aggregation
            rating: decimalToNumber(s.rating),
            reviewCount: s.reviews
        }));

        // Trends: generate daily array
        const trends: { date: string; bookings: number; revenue: number }[] = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            // Mock random or 0. Real implementation needs aggregation.
            trends.push({ date: dateStr, bookings: 0, revenue: 0 });
        }

        // Populate trends from actual data if possible. 
        // We can fetch all bookings in range and reduce.
        const bookingsInRange = await bookingRepository.findMany({
            where: { createdAt: { gte: startDate } }
        });

        bookingsInRange.forEach(b => {
            const dateStr = b.createdAt.toISOString().split('T')[0];
            const trend = trends.find(t => t.date === dateStr);
            if (trend) {
                trend.bookings += 1;
                if (b.status === 'COMPLETED' || b.status === 'CONFIRMED') {
                    trend.revenue += decimalToNumber(b.totalPrice);
                }
            }
            // Also update top services
            const serv = topServices.find(s => s.id === b.activityId);
            if (serv) {
                serv.bookings += 1;
                if (b.status === 'COMPLETED' || b.status === 'CONFIRMED') {
                    serv.revenue += decimalToNumber(b.totalPrice);
                }
            }
        });

        // Sort top services
        topServices.sort((a, b) => b.revenue - a.revenue);

        // Previous period for change calculation
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(startDate.getDate() - days);
        const prevPeriodBookings = await bookingRepository.count({ createdAt: { gte: prevStartDate, lt: startDate } });
        // Period change
        const bookingsChange = prevPeriodBookings ? ((periodBookings - prevPeriodBookings) / prevPeriodBookings) * 100 : 0;


        return {
            revenue: {
                today: 0, // calculate from trends
                week: 0,
                month: 0,
                total: periodRevenue,
                change: 0 // placeholder
            },
            bookings: {
                today: 0,
                week: 0,
                month: 0,
                total: periodBookings,
                change: bookingsChange
            },
            users: {
                total: totalUsers,
                newThisWeek: newUsersWeek,
                change: 0
            },
            topServices,
            recentTrends: trends
        };

    }
}

export const adminService = new AdminService();
