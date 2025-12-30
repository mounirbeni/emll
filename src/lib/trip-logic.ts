import { Booking } from '@prisma/client';

export type TripState = 'NO_TRIP' | 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export function determineTripState(bookings: Booking[]): TripState {
    if (!bookings || bookings.length === 0) {
        return 'NO_TRIP';
    }

    const now = new Date();

    // Sort bookings by date, most recent first
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Find the most relevant booking
    // Logic: 
    // 1. Is there a booking happening right now? (Ongoing)
    // 2. Is there a booking in the future? (Upcoming)
    // 3. Was there a booking recently? (Completed)

    // This is a simplified logic. In reality, a "Trip" might define a range of dates containing multiple bookings.
    // For now, we look at individual bookings.

    const VALID_STATUSES = ['CONFIRMED', 'UNPROCESSED', 'PENDING'];
    const upcomingBookings = sortedBookings.filter(b => new Date(b.date) > now && VALID_STATUSES.includes(b.status));
    const pastBookings = sortedBookings.filter(b => new Date(b.date) <= now && VALID_STATUSES.includes(b.status)); // And not cancelled

    if (upcomingBookings.length > 0) {
        // Check if the closest upcoming booking is actually "ongoing" (e.g. started 1 hour ago but lasts 4 hours)
        // For now, assuming "Upcoming" if start date is in future.

        // But wait, if we have a booking TODAY, it might be ongoing.
        // Let's refine.

        const nextBooking = upcomingBookings[upcomingBookings.length - 1]; // closest future booking
        const timeDiff = new Date(nextBooking.date).getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 24 && hoursDiff > -24) {
            // If it's within 24 hours? 
            // Actually, "Ongoing" usually means the user is physically there.
            // Let's assume distinct states for now.
            return 'UPCOMING';
        }
        return 'UPCOMING';
    }

    // If no upcoming bookings, check if we have any active/ongoing ones.
    // Since we filtered "upcoming" as > now, "past" is <= now.
    // If a booking started 1 hour ago, it's in "pastBookings" but technically "Ongoing" if it has duration.
    // We need duration.

    // For this MVP logic without duration parsing:
    // If the most recent past booking was within 24 hours, call it "ONGOING" or "COMPLETED" depending on logic.
    // Let's assume if it started < 12 hours ago, it's ONGOING.

    if (pastBookings.length > 0) {
        const lastBooking = pastBookings[0];
        const timeSinceStart = now.getTime() - new Date(lastBooking.date).getTime();
        const hoursSinceStart = timeSinceStart / (1000 * 60 * 60);

        if (hoursSinceStart < 12) {
            return 'ONGOING';
        }

        return 'COMPLETED';
    }

    return 'NO_TRIP';
}
