import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET(request: Request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            role: 'CUSTOMER'
        };

        if (search && search.trim()) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Build orderBy - Note: We can't sort by aggregated fields directly in Prisma
        // So we'll sort by createdAt and then sort by the aggregated fields after fetching
        const orderBy: any = {};
        if (sortBy === 'bookings' || sortBy === 'totalSpent') {
            // Sort by createdAt first, then we'll sort by the aggregated field after fetching
            orderBy.createdAt = sortOrder;
        } else {
            // Default to createdAt if sortBy is invalid
            const validSortFields = ['createdAt', 'email', 'role', 'name'];
            if (validSortFields.includes(sortBy)) {
                orderBy[sortBy] = sortOrder;
            } else {
                orderBy.createdAt = sortOrder;
            }
        }

        // Get total count for pagination
        const total = await prisma.user.count({ where });

        // Fetch users with booking stats
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy,
            skip,
            take: limit
        });

        // Get all bookings for these users in one query (more efficient)
        const userIds = users.map(u => u.id);
        const allBookings = await prisma.booking.findMany({
            where: {
                userId: { in: userIds }
            },
            select: {
                userId: true,
                status: true,
                totalPrice: true,
                createdAt: true
            }
        });

        // Group bookings by user
        const bookingsByUser = allBookings.reduce((acc, booking) => {
            if (!booking.userId) return acc;
            if (!acc[booking.userId]) {
                acc[booking.userId] = {
                    bookings: [],
                    totalSpent: 0,
                    statusCounts: { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 },
                    lastBookingDate: null
                };
            }
            acc[booking.userId].bookings.push(booking);
            if (booking.status !== 'CANCELLED') {
                acc[booking.userId].totalSpent += booking.totalPrice || 0;
            }
            acc[booking.userId].statusCounts[booking.status as keyof typeof acc[string]['statusCounts']] += 1;
            if (!acc[booking.userId].lastBookingDate || booking.createdAt > acc[booking.userId].lastBookingDate!) {
                acc[booking.userId].lastBookingDate = booking.createdAt;
            }
            return acc;
        }, {} as Record<string, {
            bookings: typeof allBookings;
            totalSpent: number;
            statusCounts: { PENDING: number; CONFIRMED: number; COMPLETED: number; CANCELLED: number };
            lastBookingDate: Date | null;
        }>);

        // Map users with their stats
        const usersWithStats = users.map((user) => {
            const userStats = bookingsByUser[user.id] || {
                totalSpent: 0,
                statusCounts: { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 },
                lastBookingDate: null
            };

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                source: 'REGISTERED',
                bookingsCount: user._count.bookings,
                totalSpent: userStats.totalSpent,
                statusBreakdown: userStats.statusCounts,
                lastBookingDate: userStats.lastBookingDate
            };
        });

        // Sort by aggregated fields if needed (after fetching stats)
        if (sortBy === 'totalSpent') {
            usersWithStats.sort((a, b) => {
                const diff = a.totalSpent - b.totalSpent;
                return sortOrder === 'desc' ? -diff : diff;
            });
        } else if (sortBy === 'bookings') {
            usersWithStats.sort((a, b) => {
                const diff = a.bookingsCount - b.bookingsCount;
                return sortOrder === 'desc' ? -diff : diff;
            });
        }

        return successResponse({
            customers: usersWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in customers API:', error);
        return errorResponse(error);
    }
}
