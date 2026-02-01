/**
 * Booking Repository
 * Handles all database operations for bookings
 */

import { prisma } from '@/lib/prisma';
import { Booking, BookingStatus, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';
import { decimalToNumber } from '@/lib/decimal';

export class BookingRepository implements BaseRepository<
    Booking,
    Prisma.BookingUncheckedCreateInput,
    Prisma.BookingUpdateInput,
    Prisma.BookingWhereInput
> {
    /**
     * Create a new booking
     */
    async create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking> {
        return await prisma.booking.create({ data });
    }

    /**
     * Find booking by ID
     */
    async findById(id: string): Promise<Booking | null> {
        return await prisma.booking.findUnique({
            where: { id },
            include: {
                // @ts-ignore: user relation exists
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                payments: true,
                experience: {
                    select: { title: true }
                }
            }
        });
    }

    /**
     * Find many bookings with options
     */
    async findMany(options?: FindManyOptions<Prisma.BookingWhereInput>): Promise<Booking[]> {
        const query: Record<string, unknown> = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        };

        // Add either include or select, but not both
        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.booking.findMany(query as Prisma.BookingFindManyArgs);
    }

    /**
     * Find bookings by user ID
     */
    async findByUserId(userId: string): Promise<(Booking & { experience: { title: string } })[]> {
        const bookings = await prisma.booking.findMany({
            // @ts-ignore: userId exists in schema but potential type mismatch
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                experience: {
                    select: { title: true }
                }
            }
        });
        return bookings as unknown as (Booking & { experience: { title: string } })[];
    }

    /**
     * Find bookings by email
     */
    async findByEmail(userEmail: string): Promise<Booking[]> {
        return await prisma.booking.findMany({
            where: { userEmail },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find bookings by user ID or email
     */
    async findByUserIdOrEmail(userId: string, userEmail?: string): Promise<Booking[]> {
        return await prisma.booking.findMany({
            where: {
                OR: [
                    // @ts-ignore: userId exists
                    { userId },
                    ...(userEmail ? [{ userEmail }] : [])
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find bookings by experience ID
     */
    async findByExperienceId(experienceId: string): Promise<Booking[]> {
        return await prisma.booking.findMany({
            where: { experienceId },
            orderBy: { date: 'asc' }
        });
    }

    /**
     * Find bookings by status
     */
    async findByStatus(status: BookingStatus): Promise<Booking[]> {
        return await prisma.booking.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find upcoming bookings
     */
    async findUpcoming(userId?: string): Promise<Booking[]> {
        const now = new Date();
        return await prisma.booking.findMany({
            where: {
                date: { gt: now },
                status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
                ...(userId && { userId })
            },
            orderBy: { date: 'asc' }
        });
    }

    /**
     * Find past bookings
     */
    async findPast(userId?: string): Promise<Booking[]> {
        const now = new Date();
        return await prisma.booking.findMany({
            where: {
                date: { lt: now },
                ...(userId && { userId })
            },
            orderBy: { date: 'desc' }
        });
    }

    /**
     * Update booking
     */
    async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
        return await prisma.booking.update({
            where: { id },
            data
        });
    }

    /**
     * Update booking status
     */
    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        return await prisma.booking.update({
            where: { id },
            data: { status }
        });
    }

    /**
     * Delete booking
     */
    async delete(id: string): Promise<void> {
        await prisma.booking.delete({
            where: { id }
        });
    }

    /**
     * Count bookings
     */
    async count(where?: Prisma.BookingWhereInput): Promise<number> {
        return await prisma.booking.count({ where });
    }

    /**
     * Count bookings by status
     */
    async countByStatus(status: BookingStatus, userId?: string): Promise<number> {
        return await prisma.booking.count({
            where: {
                status,
                ...(userId && { userId })
            }
        });
    }

    /**
     * Get total revenue
     */
    async getTotalRevenue(where?: Prisma.BookingWhereInput): Promise<number> {
        const result = await prisma.booking.aggregate({
            where,
            _sum: {
                totalPrice: true
            }
        });
        return decimalToNumber(result._sum.totalPrice);
    }

    /**
     * Get bookings created today
     */
    async findCreatedToday(): Promise<Booking[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await prisma.booking.findMany({
            where: {
                createdAt: { gte: today }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find recent bookings
     */
    async findRecent(limit: number) {
        return await prisma.booking.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    /**
     * Check if booking exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.booking.count({
            where: { id }
        });
        return count > 0;
    }
}

// Export singleton instance
export const bookingRepository = new BookingRepository();
