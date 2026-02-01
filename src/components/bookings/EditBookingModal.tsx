"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface EditBookingModalProps {
    bookingId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditBookingModal({ bookingId, isOpen, onClose, onSuccess }: EditBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Form State
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [guests, setGuests] = useState(1);
    const [pickupLocation, setPickupLocation] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [phone, setPhone] = useState("");

    // Fetch booking details when opened
    useEffect(() => {
        if (isOpen && bookingId) {
            fetchBookingDetails(bookingId);
        }
    }, [isOpen, bookingId]);

    const fetchBookingDetails = async (id: string) => {
        setFetching(true);
        try {
            const res = await fetch(`/api/bookings/${id}`);
            if (!res.ok) throw new Error("Failed to fetch booking");
            const data = await res.json();

            setDate(new Date(data.date));
            setGuests(data.guests);
            setPickupLocation(data.pickupLocation || "");
            setSpecialRequests(data.specialRequests || "");
            setPhone(data.phone || "");
        } catch (error) {
            console.error("Fetch error", error);
            toast.error("Could not load booking details");
            onClose();
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        if (!bookingId || !date) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: date.toISOString(),
                    guests,
                    pickupLocation,
                    specialRequests,
                    phone
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Update failed");
            }

            toast.success("Booking updated successfully");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Update error", error);
            toast.error(error.message || "Failed to update booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Booking</DialogTitle>
                    <DialogDescription>
                        Make changes to your booking here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {fetching ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {/* Date Picker */}
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(d) => d < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Guests */}
                        <div className="grid gap-2">
                            <Label htmlFor="guests">Guests</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="sm"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    type="button"
                                >-</Button>
                                <Input
                                    id="guests"
                                    type="number"
                                    className="text-center"
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                    readOnly
                                />
                                <Button
                                    variant="outline" size="sm"
                                    onClick={() => setGuests(guests + 1)}
                                    type="button"
                                >+</Button>
                            </div>
                        </div>

                        {/* Pickup */}
                        <div className="grid gap-2">
                            <Label htmlFor="pickup">Pickup Location</Label>
                            <Input
                                id="pickup"
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                            />
                        </div>

                        {/* Phone */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {/* Requests */}
                        <div className="grid gap-2">
                            <Label htmlFor="requests">Special Requests</Label>
                            <Textarea
                                id="requests"
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading || fetching}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
