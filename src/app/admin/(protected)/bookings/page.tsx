import { bookingService } from "@/services/booking.service";
import BookingsClient from "./bookings-client";
import { ClipboardList } from "lucide-react";
import { ExportBookingsButton } from "./export-button";

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
    const bookings = await bookingService.getAllBookings();

    const formattedBookings = bookings.map(b => ({
        ...b,
        service: { title: b.activityTitle }
    }));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
                        <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Bookings</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Manage customer reservations</p>
                    </div>
                </div>
                <ExportBookingsButton />
            </div>

            <BookingsClient initialBookings={formattedBookings} />
        </div>
    );
}
