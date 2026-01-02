import { NextResponse } from 'next/server';
import { requireAuth, isAdmin } from '@/lib/authorization';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';
import { bookingService } from '@/services/booking.service';
import { createBookingSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic'

/**
 * GET: Fetch bookings
 * - Admin: Returns all bookings
 * - Client: Returns their own bookings
 */
export async function GET(request: Request) {
    try {
        const session = await requireAuth();

        let bookings;

        if (isAdmin(session)) {
            // Admin can see all bookings
            bookings = await bookingService.getAllBookings();
        } else {
            // Client sees their own bookings
            bookings = await bookingService.getUserBookings(session.user.id);
        }

        return successResponse(bookings);
    } catch (error) {
        return errorResponse(error);
    }
}

/**
 * POST: Create a new booking
 * - Authenticated users only: booking linked to their account
 */
export async function POST(request: Request) {
    try {
        const session = await requireAuth();

        const body = await request.json();

        // Validate payload
        const validationResult = createBookingSchema.safeParse(body);

        if (!validationResult.success) {
            return errorResponse(validationResult.error);
        }

        const bookingData = validationResult.data;

        const customerEmail = session.user.email || bookingData.email;
        const customerName = session.user.name || bookingData.name;

        // Default sensitive/missing fields if needed (e.g. email/name from session if missing in body but present in session)
        // However, schema requires name/email. If client didn't send them but is logged in, we might want to pre-fill?
        // Let's assume frontend sends them pre-filled or we update Schema to optional?
        // Schema makes them required. Let's keep strict API validation.
        // But logic below used `body.name || session.user.name`.
        // If I want that fallback, I should merge session info BEFORE validation or make schema optional.
        // Merging before validation is better.

        /* 
           Merging logic strategy:
           Client usually sends the form data. If guest, name/email are in form. 
           If logged in, form might be pre-filled.
           But API should be robust.
           I'll assume `body` has the data. If not, I'll fallback BEFORE validation?
           But validation expects specific types.
           Better: Validation schema remains strict. Frontend MUST send data.
           (User prompt said "Frontend... well designed").
           So I'll trust body has all data.
        */

        // Create booking through service (handles all validation)
        const booking = await bookingService.createBooking({
            ...bookingData,
            email: customerEmail,
            name: customerName,
        }, session.user.id);

        return createdResponse(booking);

    } catch (error) {
        return errorResponse(error);
    }
}
