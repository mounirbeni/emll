"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, FileText } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { confirmBooking, updateBookingStatus } from "@/app/actions/booking-actions";

export function BookingActions({ bookingId, status }: { bookingId: string, status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            await updateBookingStatus(bookingId, newStatus);
            toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update booking status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {status !== 'CONFIRMED' && (
                    <DropdownMenuItem
                        className="text-green-600 cursor-pointer"
                        onClick={() => updateStatus('CONFIRMED')}
                    >
                        <Check className="mr-2 h-4 w-4" /> Confirm Booking
                    </DropdownMenuItem>
                )}
                {status !== 'CANCELLED' && (
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => updateStatus('CANCELLED')}
                    >
                        <X className="mr-2 h-4 w-4" /> Cancel Booking
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Invoice generation coming soon")}>
                    <FileText className="mr-2 h-4 w-4" /> Generate Invoice
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
