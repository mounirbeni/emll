import { z } from 'zod';
import { PaymentCurrency, PaymentMethod } from '@prisma/client';

// Helper for JSON/Array fields

const bookingIdSchema = z.string().regex(/^BK-[1-9A-HJKMNPQRSTUVWXYZ]{6}$/i, 'Invalid Booking ID');

const userRoleSchema = z.enum(['ADMIN', 'CUSTOMER']);

// Service Schemas removed

// Booking Schemas
export const createBookingSchema = z.object({
    activityId: z.string().min(1, 'Invalid Activity ID'),
    activityTitle: z.string().min(1, 'Activity Title is required'),
    date: z.string().datetime().transform((str) => new Date(str)), // Coerce string to Date
    guests: z.coerce.number().int().min(1).max(50),
    totalPrice: z.coerce.number().positive(),
    pickupLocation: z.string().optional(),
    phone: z.string().optional(),
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    flightNumber: z.string().optional(),
    language: z.string().optional(),
    dietary: z.string().optional(),
    specialRequests: z.string().optional(),
    packageName: z.string().optional(),
});

export const updateBookingSchema = z.object({
    date: z.string().datetime().transform((str) => new Date(str)).optional(),
    numberOfPeople: z.coerce.number().int().min(1).max(50).optional(),
    userPhone: z.string().optional(),
    specialRequests: z.string().optional(),
    notes: z.string().optional(), // Admin internal notes
});

// User/Auth Schemas
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: userRoleSchema.optional().default('CUSTOMER'),
});

// Payment Schemas
export const createPaymentSchema = z.object({
    bookingId: bookingIdSchema,
    amount: z.coerce.number().positive('Amount must be positive'),
    currency: z.nativeEnum(PaymentCurrency).optional().default(PaymentCurrency.EUR),
    method: z.nativeEnum(PaymentMethod).optional(),
});

export const processPaymentSchema = z.object({
    paymentId: z.string().uuid('Invalid Payment ID'),
    transactionId: z.string().optional(),
});

// Review Schemas removed


// User Profile Schemas
export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const updateUserRoleSchema = z.object({
    role: userRoleSchema,
});

// Notification Schemas
export const createNotificationSchema = z.object({
    userId: z.string().uuid('Invalid User ID'),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'BOOKING', 'REVIEW']).optional(),
    link: z.string().optional(),
});

// Pagination Schema
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Support Request Schema
export const createSupportRequestSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().min(3, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

