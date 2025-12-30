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

export interface RevenueAnalytics {
    total: number;
    byMonth: { month: string; revenue: number }[];
    byService: { serviceId: string; title: string; revenue: number }[];
    topServices: { serviceId: string; title: string; bookings: number; revenue: number }[];
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
        const activeUsers = await userRepository.findActiveUsers(30);
        const newUsers = await userRepository.count({
            createdAt: { gte: thirtyDaysAgo }
        });

        // Get recent data
        const [recentBookings, recentReviews, recentSupport] = await Promise.all([
            bookingRepository.findRecent(5),
            reviewRepository.findRecent(5),
            supportRepository.findRecent(5)
        ]);

        return {
            overview: {
                totalBookings,
                totalRevenue,
                totalUsers,
                totalServices
            },
            bookings: {
                pending,
                confirmed,
                completed,
                cancelled
            },
            revenue: {
                total: totalRevenue,
                thisMonth: thisMonthRevenue,
                lastMonth: lastMonthRevenue,
                growth: Math.round(revenueGrowth * 100) / 100
            },
            users: {
                total: totalUsers,
                active: activeUsers.length,
                new: newUsers
            },
            recent: {
                bookings: recentBookings,
                reviews: recentReviews,
                supportRequests: recentSupport
            }
        };
    }

    /**
     * Get revenue analytics
     */
    async getRevenueAnalytics(): Promise<RevenueAnalytics> {
        // Get total revenue
        const total = await paymentRepository.getSuccessfulPaymentsTotal();

        // Get all completed bookings for analysis
        const completedBookings = await bookingRepository.findMany({
            where: { status: 'COMPLETED' }
        });

        // Calculate revenue by month
        const byMonth: Record<string, number> = {};
        const byService: Record<string, { title: string; revenue: number }> = {};

        completedBookings.forEach(booking => {
            // By month
            const monthKey = booking.createdAt.toISOString().slice(0, 7); // YYYY-MM
            byMonth[monthKey] = (byMonth[monthKey] || 0) + booking.totalPrice;

            // By service
            if (!byService[booking.activityId]) {
                byService[booking.activityId] = {
                    title: booking.activityTitle,
                    revenue: 0
                };
            }
            byService[booking.activityId].revenue += booking.totalPrice;
        });

        // Convert to arrays and sort
        const byMonthArray = Object.entries(byMonth)
            .map(([month, revenue]) => ({ month, revenue }))
            .sort((a, b) => a.month.localeCompare(b.month));

        const byServiceArray = Object.entries(byService)
            .map(([serviceId, data]) => ({
                serviceId,
                title: data.title,
                revenue: data.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue);

        // Get top services by bookings and revenue
        const serviceBookingCounts: Record<string, { title: string; count: number; revenue: number }> = {};
        completedBookings.forEach(booking => {
            if (!serviceBookingCounts[booking.activityId]) {
                serviceBookingCounts[booking.activityId] = {
                    title: booking.activityTitle,
                    count: 0,
                    revenue: 0
                };
            }
            serviceBookingCounts[booking.activityId].count++;
            serviceBookingCounts[booking.activityId].revenue += booking.totalPrice;
        });

        const topServices = Object.entries(serviceBookingCounts)
            .map(([serviceId, data]) => ({
                serviceId,
                title: data.title,
                bookings: data.count,
                revenue: data.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        return {
            total,
            byMonth: byMonthArray,
            byService: byServiceArray,
            topServices
        };
    }

    /**
     * Get booking analytics
     */
    async getBookingAnalytics() {
        const totalBookings = await bookingRepository.count();
        const bookingsByStatus = {
            pending: await bookingRepository.countByStatus('PENDING'),
            confirmed: await bookingRepository.countByStatus('CONFIRMED'),
            completed: await bookingRepository.countByStatus('COMPLETED'),
            cancelled: await bookingRepository.countByStatus('CANCELLED')
        };

        const averageBookingValue = await bookingRepository.getTotalRevenue() / (totalBookings || 1);

        return {
            total: totalBookings,
            byStatus: bookingsByStatus,
            averageValue: Math.round(averageBookingValue * 100) / 100
        };
    }

    /**
     * Get user analytics
     */
    async getUserAnalytics() {
        const totalUsers = await userRepository.count();
        const clientCount = await userRepository.count({ role: 'CLIENT' });
        const adminCount = await userRepository.count({ role: 'ADMIN' });
        const activeUsers = await userRepository.findActiveUsers(30);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const newUsers = await userRepository.count({
            createdAt: { gte: thirtyDaysAgo }
        });

        return {
            total: totalUsers,
            byRole: {
                clients: clientCount,
                admins: adminCount
            },
            active: activeUsers.length,
            new: newUsers
        };
    }

    /**
     * Get support request statistics
     */
    async getSupportStats() {
        return await supportRepository.getStats();
    }

    /**
     * Get system health metrics
     */
    async getSystemHealth() {
        const [
            pendingBookings,
            pendingSupport,
            failedPayments
        ] = await Promise.all([
            bookingRepository.countByStatus('PENDING'),
            supportRepository.countByStatus('PENDING'),
            paymentRepository.count({ status: 'FAILED' })
        ]);

        return {
            pendingBookings,
            pendingSupport,
            failedPayments,
            requiresAttention: pendingSupport > 5 || failedPayments > 3
        };
    }
    /**
     * Get admin alerts (legacy support + new logic)
     */
    async getAdminAlerts() {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Unconfirmed bookings > 24h
        const unconfirmed = await bookingRepository.findMany({
            where: {
                status: 'PENDING',
                createdAt: { lt: yesterday }
            }
        });

        const alerts: any[] = [];

        unconfirmed.forEach(b => {
            alerts.push({
                id: `booking-${b.id}`,
                type: 'WARNING',
                title: `Unconfirmed Booking: ${b.name}`,
                time: '24h+',
                action: 'Review',
                rawDate: b.createdAt
            });
        });

        // Mock critical alert for demo (preserving legacy behavior)
        alerts.push({
            id: 'mock-1',
            type: 'CRITICAL',
            title: 'Payment Failed: Booking #B-998',
            time: '12m ago',
            action: 'Retry',
            rawDate: new Date(Date.now() - 12 * 60 * 1000)
        });

        return alerts.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    }

    /**
     * Get urgent stats
     */
    async getUrgentStats() {
        const [pendingBookings, pendingSupport] = await Promise.all([
            bookingRepository.countByStatus('PENDING'),
            supportRepository.countByStatus('PENDING') // Support uses PENDING string default
        ]);

        return {
            pendingBookings,
            pendingSupport,
            pendingReviews: 0 // Placeholder
        };
    }

    /**
     * Get top services
     */
    async getTopServices() {
        const analytics = await this.getRevenueAnalytics();
        return analytics.topServices.map(s => ({
            id: s.serviceId,
            title: s.title,
            bookingsCount: s.bookings,
            revenue: s.revenue,
            rating: 4.8 // Mock or fetch real rating if needed
        })).slice(0, 5);
    }
    /**
     * Get legacy/daily stats for dashboard
     */
    async getDailyStats() {
        // Calculate today's range
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Get today's bookings
        const bookingsToday = await bookingRepository.count({
            createdAt: { gte: startOfDay }
        });

        // Get today's revenue (only from confirmed/completed/paid bookings ideally, but for simplicity use total)
        // Better: use paymentRepository for revenue, but booking.totalPrice is used in legacy
        const revenueToday = await bookingRepository.getTotalRevenue({
            createdAt: { gte: startOfDay },
            status: { not: 'CANCELLED' } // Approximate
        });

        // Get active users (logged in recently or created recently)
        const activeUsersCount = (await userRepository.findActiveUsers(7)).length;

        // Calculate conversion rate (Total Bookings / Total Users) * 100
        const totalUsers = await userRepository.count();
        const totalBookings = await bookingRepository.count();
        const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

        return {
            revenueToday,
            bookingsToday,
            activeUsers: activeUsersCount,
            conversionRate: Math.round(conversionRate * 10) / 10
        };
    }
}

// Export singleton instance
export const adminService = new AdminService();
