'use server'

import { bookingService } from '@/services/booking.service'
import { BookingStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Note: getBookings should be accessed via API or Service in Server Components
// But for Client usage via Server Action, we provide this.
export async function getBookings() {
    try {
        const bookings = await bookingService.getAllBookings(); // Defaults to admin view
        return { success: true, data: bookings }
    } catch (error) {
        console.error('Failed to fetch bookings:', error)
        return { success: false, error: 'Failed to fetch bookings' }
    }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
    try {
        await bookingService.updateBookingStatus(id, status);
        revalidatePath('/admin/bookings')
        revalidatePath('/admin/dashboard')
        revalidatePath('/client') // Attempt to revalidate client view
        revalidatePath('/api/bookings') // Revalidate API route cache if any
        return { success: true }
    } catch (error) {
        console.error('Failed to update booking status:', error)
        // Return error message if extended from Error
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update booking status' }
    }
}

export async function confirmBooking(id: string) {
    try {
        await bookingService.confirmBooking(id); // Handles emails internally
        revalidatePath('/admin/bookings');
        revalidatePath('/admin/dashboard');
        revalidatePath('/client');
        revalidatePath('/api/bookings');
        return { success: true };
    } catch (error) {
        console.error('Failed to confirm booking:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to confirm booking' };
    }
}

export async function cancelBooking(id: string) {
    try {
        // Assume Admin is performing this action since it's an Admin Action file usually?
        // But this action is used by BookingsClient which is used in Admin.
        // Yes, `cancelBooking` in bookingService has signature (id, userId?, isAdmin?)
        // If we call it here for Admin, we pass isAdmin=true
        await bookingService.cancelBooking(id, undefined, true);
        revalidatePath('/admin/bookings');
        revalidatePath('/admin/dashboard');
        revalidatePath('/client');
        revalidatePath('/api/bookings');
        return { success: true };
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel booking' };
    }
}

export async function processBooking(id: string) {
    try {
        await bookingService.completeBooking(id);
        revalidatePath('/admin/bookings')
        revalidatePath('/admin/dashboard')
        revalidatePath('/client')
        revalidatePath('/api/bookings');
        return { success: true }
    } catch (error) {
        console.error('Failed to process booking:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to process booking' }
    }
}

export async function deleteBooking(id: string) {
    try {
        await bookingService.deleteBooking(id);
        revalidatePath('/admin/bookings')
        revalidatePath('/admin/dashboard')
        revalidatePath('/client')
        revalidatePath('/api/bookings');
        return { success: true }
    } catch (error) {
        console.error('Failed to delete booking:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete booking' }
    }
}
