'use server'

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { bookingService } from "@/services/booking.service"
import { CreateBlogPostDTO, UpdateBlogPostDTO } from "@/services/blog.service"
import { notificationService } from "@/services/notification.service"
import { z } from "zod"
import { supportService } from "@/services/support.service"
import { blogService } from "@/services/blog.service"
import { emailService } from "@/services/email.service"
import crypto from 'crypto'

import { adminService } from "@/services/admin.service"

// --- Auth Helper ---
export async function requireAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized: Admin access required")
    }
    return session.user
}

// --- Common Response Type ---
export type ActionResponse<T = unknown> = {
    success: boolean
    data?: T
    error?: string
}

const SETTINGS_ID = "SETTINGS_GLOBAL_CONFIG_V1"

export interface SettingsData {
    businessName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    cancellationPolicy?: string;
    socialFacebook?: string;
    socialInstagram?: string;
}

export async function getSettings(): Promise<SettingsData> {
    const settings = await adminService.getSettings();
    return settings as SettingsData; // Type casting or mapping as needed
}

export async function updateSettings(data: unknown): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await adminService.updateSettings(data)
        revalidatePath('/admin/settings')
        return { success: true }
    } catch (e) {
        console.error("Failed to update settings:", e)
        return { success: false, error: "Failed to update settings" }
    }
}

// --- Booking Actions ---

export async function confirmBooking(bookingId: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await bookingService.confirmBooking(bookingId)
        revalidatePath('/admin/bookings')
        revalidatePath('/client/bookings')
        revalidatePath(`/client/bookings/${bookingId}`)
        return { success: true }
    } catch (error) {
        console.error("Confirm booking error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to confirm booking" }
    }
}

export async function cancelBooking(bookingId: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await bookingService.cancelBooking(bookingId, undefined, true) // isAdmin=true
        revalidatePath('/admin/bookings')
        revalidatePath('/client/bookings')
        revalidatePath(`/client/bookings/${bookingId}`)
        return { success: true }
    } catch (error) {
        console.error("Cancel booking error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to cancel booking" }
    }
}

export async function completeBooking(bookingId: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await bookingService.completeBooking(bookingId)
        revalidatePath('/admin/bookings')
        revalidatePath('/client/bookings')
        revalidatePath(`/client/bookings/${bookingId}`)
        return { success: true }
    } catch (error) {
        console.error("Complete booking error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to complete booking" }
    }
}

import { updateBookingSchema, serviceSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

// updateBookingSchema removed from here


export async function updateBooking(bookingId: string, data: z.infer<typeof updateBookingSchema>): Promise<ActionResponse> {
    try {
        await requireAdmin()

        // Update booking in database
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                ...(data.date ? { date: new Date(data.date as unknown as string) } : {}),
                ...(data.guests ? { guests: data.guests } : {}),
                ...(data.pickupLocation !== undefined ? { pickupLocation: data.pickupLocation } : {}),
                ...(data.phone !== undefined ? { phone: data.phone } : {}),
                ...(data.specialRequests !== undefined ? { specialRequests: data.specialRequests } : {}),
                ...(data.notes !== undefined ? { notes: data.notes } : {}),
            }
        })

        revalidatePath('/admin/bookings')
        revalidatePath('/client/bookings')
        revalidatePath(`/client/bookings/${bookingId}`)
        return { success: true }
    } catch (error) {
        console.error("Update booking error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to update booking" }
    }
}

export async function updateBookingNotes(bookingId: string, notes: string): Promise<ActionResponse> {
    try {
        await requireAdmin()

        await prisma.booking.update({
            where: { id: bookingId },
            data: { notes }
        })

        revalidatePath('/admin/bookings')
        revalidatePath(`/admin/bookings/${bookingId}`)
        return { success: true }
    } catch (error) {
        console.error("Update booking notes error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to update booking notes" }
    }
}

export async function deleteBooking(bookingId: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await bookingService.deleteBooking(bookingId)
        revalidatePath('/admin/bookings')
        revalidatePath('/client/bookings')
        return { success: true }
    } catch (error) {
        console.error("Delete booking error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete booking" }
    }
}


// --- Experience/Service Actions Removed ---

// --- Notification Actions ---

export async function createNotification(userId: string, title: string, message: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await notificationService.createNotification({ userId, title, message })
        revalidatePath('/admin/notifications')
        return { success: true }
    } catch (error) {
        console.error("Create notification error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to create notification" }
    }
}

export async function markNotificationAsRead(notificationId: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await notificationService.markAsRead(notificationId)
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        console.error("Mark as read error:", e)
        return { success: false, error: "Failed to mark as read" }
    }
}

export async function clearAllNotifications(): Promise<ActionResponse> {
    try {
        const admin = await requireAdmin()
        try {
            await notificationService.markAllAsRead(admin.id)
            revalidatePath('/admin')
            return { success: true }
        } catch (e) {
            console.error("Mark all as read error:", e)
            return { success: false, error: "Failed to mark all as read" }
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to clear all notifications" }
    }
}

// --- Cloudinary ---

function signCloudinaryParams(params: Record<string, string | number | undefined>, apiSecret: string) {
    const entries = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && `${v}`.length > 0)
        .map(([k, v]) => [k, `${v}`] as const)
        .sort(([a], [b]) => a.localeCompare(b))

    const toSign = entries.map(([k, v]) => `${k}=${v}`).join('&')
    return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex')
}

export async function generateCloudinarySignature(folder: string = 'blog') {
    try {
        await requireAdmin();

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
            throw new Error('Cloudinary environment variables missing');
        }

        const timestamp = Math.floor(Date.now() / 1000)

        const signature = signCloudinaryParams(
            {
                folder,
                timestamp,
                upload_preset: uploadPreset,
            },
            apiSecret
        )

        return {
            success: true,
            data: {
                cloudName,
                apiKey,
                uploadPreset,
                timestamp,
                folder,
                signature,
            }
        };

    } catch (error) {
        console.error('Failed to generate Cloudinary signature:', error);
        return { success: false, error: 'Failed to generate upload signature' };
    }
}

// --- Support / Complaints Actions ---

export async function updateSupportStatus(id: string, status: string) {
    try {
        await requireAdmin()
        await supportService.updateRequestStatus(id, status)
        revalidatePath('/admin/complaints')
        return { success: true }
    } catch (e) {
        console.error("Update support status error:", e)
        return { success: false, error: "Failed to update support status" }
    }
}

export async function deleteSupportRequest(id: string) {
    try {
        await requireAdmin()
        await supportService.deleteRequest(id)
        revalidatePath('/admin/complaints')
        return { success: true }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Email Actions
 */
export async function checkEmailStatus() {
    try {
        if (!await requireAdmin()) return { success: false, error: "Unauthorized" }
        const status = await emailService.checkConfiguration()
        return { success: true, data: status }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to check email status" }
    }
}

export async function sendTestEmailAction(email: string) {
    try {
        if (!await requireAdmin()) return { success: false, error: "Unauthorized" }
        await emailService.sendTestEmail(email)
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to send test email" }
    }
}

// --- Blog Actions ---

export async function createBlogPost(data: CreateBlogPostDTO): Promise<ActionResponse> {
    try {
        const admin = await requireAdmin()
        await blogService.createPost({ ...data, authorId: admin.id })
        revalidatePath('/admin/blog')
        revalidatePath('/blog')
        return { success: true }
    } catch (error) {
        console.error("Create blog post error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to create blog post" }
    }
}

export async function updateBlogPost(id: string, data: UpdateBlogPostDTO): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await blogService.updatePost(id, data)
        revalidatePath('/admin/blog')
        revalidatePath('/blog')
        revalidatePath(`/blog/${data.slug}`)
        return { success: true }
    } catch (error) {
        console.error("Update blog post error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to update blog post" }
    }
}

export async function deleteBlogPost(id: string): Promise<ActionResponse> {
    try {
        await requireAdmin()
        await blogService.deletePost(id)
        revalidatePath('/admin/blog')
        revalidatePath('/blog')
        return { success: true }
    } catch (error) {
        console.error("Delete blog post error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete blog post" }
    }
}
