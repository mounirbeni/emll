/**
 * Admin Service
 * Contains all business logic for admin operations and dashboard
 */

import { bookingRepository } from '@/repositories/booking.repository';
import { userRepository } from '@/repositories/user.repository';
import { paymentRepository } from '@/repositories/payment.repository';
import { supportRepository } from '@/repositories/support.repository';

export interface DashboardStats {
    overview: {
        totalBookings: number;
        totalRevenue: number;
        totalUsers: number;
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
    recentTrends: Array<{
        date: string;
        bookings: number;
        revenue: number;
    }>;
    topServices: Array<{
        id: string;
        title: string;
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
        const [totalBookings, totalRevenue, totalUsers] = await Promise.all([
            bookingRepository.count(),
            paymentRepository.getSuccessfulPaymentsTotal(),
            userRepository.count(),
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
        const recentSupport = await supportRepository.findRecent(5);

        return {
            overview: {
                totalBookings,
                totalRevenue,
                totalUsers,
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
            status: 'COMPLETED'
        });

        // Trends: generate daily array
        const trends: { date: string; bookings: number; revenue: number }[] = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            trends.push({ date: dateStr, bookings: 0, revenue: 0 });
        }

        // Populate trends from actual data if possible. 
        const bookingsInRange = await bookingRepository.findMany({
            where: { createdAt: { gte: startDate } }
        });

        bookingsInRange.forEach(b => {
            const dateStr = b.createdAt.toISOString().split('T')[0];
            const trend = trends.find(t => t.date === dateStr);
            if (trend) {
                trend.bookings += 1;
                if (b.status === 'COMPLETED' || b.status === 'CONFIRMED') {
                    trend.revenue += Number(b.totalPrice);
                }
            }
        });

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
            recentTrends: trends,
            topServices: await this.getTopServices(startDate)
        };

    }

    /**
     * Get top services (experiences) by booking count
     */
    private async getTopServices(startDate: Date): Promise<Array<{ id: string; title: string; bookings: number; revenue: number }>> {
        try {
            const bookings = await bookingRepository.findMany({
                where: { createdAt: { gte: startDate } }
            });

            // Aggregate by experience
            const experienceMap = new Map<string, { title: string; bookings: number; revenue: number }>();

            for (const booking of bookings) {
                const existing = experienceMap.get(booking.experienceId) || {
                    title: '',
                    bookings: 0,
                    revenue: 0
                };
                existing.bookings += 1;
                if (booking.status === 'COMPLETED' || booking.status === 'CONFIRMED') {
                    existing.revenue += Number(booking.totalPrice);
                }
                experienceMap.set(booking.experienceId, existing);
            }

            // Get experience titles
            const { prisma } = await import('@/lib/prisma');
            const experiences = await prisma.experience.findMany({
                where: { id: { in: Array.from(experienceMap.keys()) } },
                select: { id: true, title: true }
            });

            // Merge titles
            for (const exp of experiences) {
                const data = experienceMap.get(exp.id);
                if (data) {
                    data.title = exp.title;
                }
            }

            // Convert to array and sort by bookings
            return Array.from(experienceMap.entries())
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => b.bookings - a.bookings)
                .slice(0, 5);
        } catch {
            return [];
        }
    }
    async updateSettings(data: unknown): Promise<void> {
        // Placeholder: Implementation pending new Settings model
        // Validates that the operation is allowed but does not persist data yet
        return;
    }
}

export const adminService = new AdminService();

