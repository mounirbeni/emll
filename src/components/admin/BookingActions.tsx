"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, FileText } from "lucide-react";
import { BookingStatus } from "@prisma/client";
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
import { confirmBooking, updateBooking } from "@/app/actions/admin-actions";

export function BookingActions({ bookingId, status }: { bookingId: string, status: BookingStatus }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: BookingStatus) => {
        setLoading(true);
        try {
            await updateBooking(bookingId, { status: newStatus });
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
                <Button variant="ghost" className="h-10 w-10 p-0" disabled={loading}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {status !== BookingStatus.CONFIRMED && (
                    <DropdownMenuItem
                        className="text-green-600 cursor-pointer"
                        onClick={() => updateStatus(BookingStatus.CONFIRMED)}
                    >
                        <Check className="mr-2 h-4 w-4" /> Confirm Booking
                    </DropdownMenuItem>
                )}
                {status !== BookingStatus.CANCELLED && (
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => updateStatus(BookingStatus.CANCELLED)}
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
