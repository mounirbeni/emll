import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { bookingService } from '@/services/booking.service';

import { BookingsClient } from './bookings-client';

export const dynamic = 'force-dynamic';


async function getUserBookings(userId: string) {
    const bookings = await bookingService.getUserBookings(userId);
    return bookings;
}

export default async function BookingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const bookings = await getUserBookings(session.user.id);

    return <BookingsClient bookings={bookings} />;
}
