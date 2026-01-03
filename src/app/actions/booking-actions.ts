'use server'

import prisma from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: {
                date: 'desc',
            },
        })
        return { success: true, data: bookings }
    } catch (error) {
        console.error('Failed to fetch bookings:', error)
        return { success: false, error: 'Failed to fetch bookings' }
    }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
    try {
        await prisma.booking.update({
            where: { id },
            data: { status },
        })
        revalidatePath('/admin/bookings')
        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Failed to update booking status:', error)
        throw new Error('Failed to update booking status')
    }
}

export async function confirmBooking(id: string) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!booking) {
            return { success: false, error: 'Booking not found' };
        }

        await prisma.booking.update({
            where: { id },
            data: { status: 'CONFIRMED' },
        });

        // Send confirmation email
        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingConfirmation(
                booking.email,
                booking.name,
                booking.id,
                booking.activityTitle,
                booking.date,
                booking.guests,
                typeof (booking.totalPrice as any)?.toNumber === 'function'
                    ? (booking.totalPrice as any).toNumber()
                    : Number(booking.totalPrice)
            );
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }

        revalidatePath('/admin/bookings');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to confirm booking:', error);
        return { success: false, error: 'Failed to confirm booking' };
    }
}

export async function cancelBooking(id: string) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking) {
            return { success: false, error: 'Booking not found' };
        }

        await prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        // Send cancellation email
        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingCancellation(
                booking.email,
                booking.name,
                booking.activityTitle,
                booking.paymentStatus === 'PAID'
                    ? (typeof (booking.totalPrice as any)?.toNumber === 'function'
                        ? (booking.totalPrice as any).toNumber()
                        : Number(booking.totalPrice))
                    : undefined
            );
        } catch (error) {
            console.error('Failed to send cancellation email:', error);
        }

        revalidatePath('/admin/bookings');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        return { success: false, error: 'Failed to cancel booking' };
    }
}

export async function processBooking(id: string) {
    try {
        await prisma.booking.update({
            where: { id },
            data: { status: 'COMPLETED' },
        })
        revalidatePath('/admin/bookings')
        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Failed to process booking:', error)
        return { success: false, error: 'Failed to process booking' }
    }
}

export async function deleteBooking(id: string) {
    try {
        await prisma.booking.delete({
            where: { id },
        })
        revalidatePath('/admin/bookings')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete booking:', error)
        return { success: false, error: 'Failed to delete booking' }
    }
}
