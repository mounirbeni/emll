
import prisma from "@/lib/prisma";
import BookingsClient from "./bookings-client";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

async function getBookings() {
    return await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            // Include service title if possible, or mapping it. 
            // The BookingsClient expects { service: { title: string } } optionally.
            // Our schema might not have a direct relation named 'service' on Booking?
            // Let's check schema. Booking has `activityTitle`.
            // The BookingsClient interface extends Booking & { service?: ... }.
            // We can map `activityTitle` to `service.title` or update BookingsClient to use `activityTitle`.
            // Updating BookingsClient is better. But let's check schema/BookingsClient again.
            // Booking model has `activityTitle` String.
            // BookingsClient uses `booking.service?.title`.
            // I should update BookingsClient to use `activityTitle` preferably, or map it here.
            // Mapping is safer for now.
        }
    });
}

export default async function AdminBookingsPage() {
    const bookings = await getBookings();

    // Map to match the expected interface of BookingsClient which seems to expect a checking for service title
    // actually BookingsClient uses `booking.service?.title` for search string inclusion.
    // I will pass the bookings and also update BookingsClient slightly in next step or map here.
    // Let's look at BookingsClient again. It expects `Bookings & { service?: { title: string } }`.
    // I'll map my `activityTitle` to this structure to avoid changing BookingsClient if I can, 
    // BUT BookingsClient logic: `(booking.service?.title || '').toLowerCase().includes(query)`
    // My Booking has `activityTitle`.
    // I will simply attach a fake service object.

    const formattedBookings = bookings.map(b => ({
        ...b,
        service: { title: b.activityTitle }
    }));

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bookings Management</h1>
                <Button className="w-full sm:w-auto text-sm sm:text-base">Download Report</Button>
            </div>

            <BookingsClient initialBookings={formattedBookings} />
        </div>
    );
}
