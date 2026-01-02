
import prisma from "@/lib/prisma";
import BookingsClient from "./bookings-client";
import { Button } from "@/components/ui/button";
import { Download, ClipboardList } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getBookings() {
    return await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
        }
    });
}

export default async function AdminBookingsPage() {
    const bookings = await getBookings();

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
                <Button className="w-full sm:w-auto rounded-xl gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            <BookingsClient initialBookings={formattedBookings} />
        </div>
    );
}
