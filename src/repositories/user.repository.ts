/**
 * User Repository
 * Handles all database operations for users
 */

import { prisma } from '@/lib/prisma';
import { Prisma, User, UserRole } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

type UserWithBookings = Prisma.UserGetPayload<{
    include: {
        bookings: true;
    };
}>;

export class UserRepository implements BaseRepository<
    User,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserWhereInput
> {
    /**
     * Create a new user
     */
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({ data });
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * Find many users with options
     */
    async findMany(options?: FindManyOptions<Prisma.UserWhereInput>): Promise<User[]> {
        const query: any = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
        };

        // Add select if provided
        if (options?.select) {
            query.select = options.select;
        }

        return await prisma.user.findMany(query);
    }

    /**
     * Find users by role
     */
    async findByRole(role: UserRole): Promise<User[]> {
        return await prisma.user.findMany({
            where: { role },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Update user
     */
    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data
        });
    }

    /**
     * Update user password
     */
    async updatePassword(id: string, hashedPassword: string): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }

    /**
     * Count users
     */
    async count(where?: Prisma.UserWhereInput): Promise<number> {
        return await prisma.user.count({ where });
    }

    /**
     * Check if user exists by email
     */
    async existsByEmail(email: string): Promise<boolean> {
        const count = await prisma.user.count({
            where: { email }
        });
        return count > 0;
    }

    /**
     * Check if user exists by ID
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.user.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Get user with bookings
     */
    async findByIdWithBookings(id: string): Promise<UserWithBookings | null> {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                bookings: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    /**
     * Get active users (users with bookings in last 30 days)
     */
    async findActiveUsers(days: number = 30): Promise<User[]> {
        const since = new Date();
        since.setDate(since.getDate() - days);

        return await prisma.user.findMany({
            where: {
                bookings: {
                    some: {
                        createdAt: { gte: since }
                    }
                }
            }
        });
    }
}

// Export singleton instance
export const userRepository = new UserRepository();
