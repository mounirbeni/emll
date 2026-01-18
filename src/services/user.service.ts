/**
 * User Service
 * Contains all business logic for user operations
 */

import { BookingStatus, User, UserRole } from '@prisma/client';
import { userRepository } from '@/repositories/user.repository';
import { hashPassword, comparePassword } from '@/lib/auth';
import { NotFoundError, BadRequestError, ConflictError } from '@/lib/errors';

export interface CreateUserDTO {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role?: UserRole;
}

export interface UpdateUserDTO {
    name?: string;
    phone?: string;
    email?: string;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

export interface UserStats {
    totalBookings: number;
    completedBookings: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: Date;
}

export class UserService {
    /**
     * Create a new user (registration)
     */
    async createUser(data: CreateUserDTO): Promise<User> {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError('A user with this email already exists');
        }

        // Validate password
        if (data.password.length < 6) {
            throw new BadRequestError('Password must be at least 6 characters long');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await userRepository.create({
            email: data.email,
            password: hashedPassword,
            name: data.name || null,
            phone: data.phone || null,
            role: data.role || UserRole.CUSTOMER,
        });

        return user;
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return user;
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<User | null> {
        return await userRepository.findByEmail(email);
    }

    /**
     * Get all users (admin only)
     */
    async getAllUsers(): Promise<User[]> {
        return await userRepository.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Update user profile
     */
    async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        // Check email uniqueness if changing email
        if (data.email && data.email !== user.email) {
            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new ConflictError('A user with this email already exists');
            }
        }

        // Update user
        const updatedUser = await userRepository.update(id, data);

        return updatedUser;
    }

    /**
     * Change user password
     */
    async changePassword(id: string, data: ChangePasswordDTO): Promise<void> {
        const user = await userRepository.findById(id);

        if (!user || !user.password) {
            throw new NotFoundError('User', id);
        }

        // Verify current password
        const isValid = await comparePassword(data.currentPassword, user.password);
        if (!isValid) {
            throw new BadRequestError('Current password is incorrect');
        }

        // Validate new password
        if (data.newPassword.length < 6) {
            throw new BadRequestError('New password must be at least 6 characters long');
        }

        // Hash new password
        const hashedPassword = await hashPassword(data.newPassword);

        // Update password
        await userRepository.updatePassword(id, hashedPassword);
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        const exists = await userRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('User', id);
        }

        await userRepository.delete(id);
    }

    /**
     * Get user with bookings
     */
    async getUserWithBookings(id: string) {
        return await userRepository.findByIdWithBookings(id);
    }

    /**
     * Get user statistics
     */
    async getUserStats(id: string): Promise<UserStats> {
        const user = await userRepository.findByIdWithBookings(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        const totalBookings = user.bookings?.length || 0;
        const completedBookings = user.bookings?.filter((b) => b.status === BookingStatus.COMPLETED).length || 0;
        const totalSpent = user.bookings
            ?.filter((b) => b.status === BookingStatus.COMPLETED)
            .reduce((sum, b) => sum + Number(b.totalPrice), 0) || 0;

        return {
            totalBookings,
            completedBookings,
            totalSpent,
            loyaltyPoints: user.loyaltyPoints,
            memberSince: user.createdAt
        };
    }

    /**
     * Search users by query (admin only)
     */
    async searchUsers(query: string): Promise<User[]> {
        return await userRepository.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get users by role
     */
    async getUsersByRole(role: UserRole): Promise<User[]> {
        return await userRepository.findByRole(role);
    }

    /**
     * Add loyalty points
     */
    async addLoyaltyPoints(id: string, points: number): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return await userRepository.update(id, {
            loyaltyPoints: user.loyaltyPoints + points
        });
    }

    /**
     * Subtract loyalty points
     */
    async subtractLoyaltyPoints(id: string, points: number): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        if (user.loyaltyPoints < points) {
            throw new BadRequestError('Insufficient loyalty points');
        }

        return await userRepository.update(id, {
            loyaltyPoints: user.loyaltyPoints - points
        });
    }

    /**
     * Update user role (admin only)
     */
    async updateUserRole(id: string, role: UserRole): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return await userRepository.update(id, { role });
    }

    /**
     * Toggle user messaging ability (admin only)
     */
    async toggleMessaging(id: string): Promise<User> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return await userRepository.update(id, {
            canMessage: !user.canMessage
        });
    }

    /**
     * Get user count
     */
    async getUserCount(): Promise<number> {
        return await userRepository.count();
    }

    /**
     * Get active users
     */
    async getActiveUsers(days: number = 30): Promise<User[]> {
        return await userRepository.findActiveUsers(days);
    }
}

// Export singleton instance
export const userService = new UserService();
