
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
                <Button 
                    onClick={async () => {
                        try {
                            const response = await fetch('/api/admin/bookings/export');
                            if (!response.ok) throw new Error('Export failed');
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                        } catch (error) {
                            console.error('Export error:', error);
                            alert('Failed to export bookings. Please try again.');
                        }
                    }}
                    className="w-full sm:w-auto rounded-xl gap-2"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <BookingsClient initialBookings={formattedBookings} />
        </div>
    );
}
