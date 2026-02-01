import { z } from "zod";

export const updateBookingSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
    notes: z.string().optional(),
    date: z.union([z.string(), z.date()]).optional(),
    guests: z.number().int().min(1).optional(),
    pickupLocation: z.string().optional(),
    phone: z.string().optional(),
    specialRequests: z.string().optional(),
});

export const serviceSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().min(0),
    category: z.string(),
    duration: z.string(),
    location: z.string(),
    images: z.array(z.string()),
    features: z.array(z.string()),
    included: z.array(z.string()),
    excluded: z.array(z.string()),
    whatToBring: z.array(z.string()),
    highlights: z.array(z.string()),
    tags: z.array(z.string()),
    host: z.string().optional(),
    itinerary: z.any().optional() // JSON
});
