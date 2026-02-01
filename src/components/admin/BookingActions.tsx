
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BookingActionsProps {
    bookingId: string;
}

export default function BookingActions({ bookingId }: BookingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Booking status updated to ${status}`);
            router.refresh();
        } catch {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBooking = async () => {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete booking');

            toast.success('Booking deleted successfully');
            router.push('/admin/bookings');
        } catch {
            toast.error('Failed to delete booking');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isLoading}>
                        Change Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateStatus('PENDING')}>
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('CONFIRMED')}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('CANCELLED')}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('COMPLETED')}>
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" /> Completed
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="destructive" size="icon" onClick={deleteBooking} disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
