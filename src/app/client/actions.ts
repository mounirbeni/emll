'use server';

/**
 * Customer Dashboard Server Actions
 * Centralized mutations for customer dashboard with proper authentication and validation
 */

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { notificationService } from '@/services/notification.service';
import { bookingService } from '@/services/booking.service';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

type ActionResponse<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

// ============================================================================
// Validation Schemas
// ============================================================================

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    phone: z.string().optional().nullable(),
});

// ============================================================================
// Helper Functions
// ============================================================================

async function getAuthenticatedUser() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }
    return session.user;
}

// ============================================================================
// Profile Actions
// ============================================================================

/**
 * Update user profile
 */
export async function updateProfile(
    formData: FormData
): Promise<ActionResponse<{ name: string; phone: string | null }>> {
    try {
        const user = await getAuthenticatedUser();

        // Extract and validate data
        const rawData = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string | null,
        };

        const validatedData = updateProfileSchema.parse(rawData);

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: validatedData.name,
                phone: validatedData.phone || null,
            },
            select: {
                name: true,
                phone: true,
            },
        });

        // Revalidate profile page
        revalidatePath('/client/profile');
        revalidatePath('/client');

        return {
            success: true,
            data: {
                name: updatedUser.name || '',
                phone: updatedUser.phone,
            },
        };
    } catch (error) {
        console.error('Update profile error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0].message,
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update profile',
        };
    }
}

// ============================================================================
// Notification Actions
// ============================================================================

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(
    notificationId: string
): Promise<ActionResponse> {
    try {
        const user = await getAuthenticatedUser();

        await notificationService.markAsRead(notificationId, user.id);

        // Revalidate notifications page
        revalidatePath('/client/notifications');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Mark notification read error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to mark notification as read',
        };
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<ActionResponse<{ count: number }>> {
    try {
        const user = await getAuthenticatedUser();

        const count = await notificationService.markAllAsRead(user.id);

        // Revalidate notifications page
        revalidatePath('/client/notifications');

        return { success: true, data: { count } };
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to mark notifications as read',
        };
    }
}

// ============================================================================
// Booking Actions
// ============================================================================

/**
 * Cancel a booking
 */
export async function cancelBooking(
    bookingId: string
): Promise<ActionResponse> {
    try {
        const user = await getAuthenticatedUser();

        // Cancel booking through service (includes validation)
        await bookingService.cancelBooking(bookingId, user.id, false);

        // Revalidate all booking-related pages
        revalidatePath('/client/bookings');
        revalidatePath(`/client/bookings/${bookingId}`);
        revalidatePath('/client');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Cancel booking error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to cancel booking',
        };
    }
}

/**
 * Refresh dashboard data (force revalidation)
 */
export async function refreshDashboard(): Promise<ActionResponse> {
    try {
        await getAuthenticatedUser(); // Verify authentication

        revalidatePath('/client');
        revalidatePath('/client/bookings');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Refresh dashboard error:', error);
        return {
            success: false,
            error: 'Failed to refresh dashboard',
        };
    }
}
