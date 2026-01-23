"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
    servicePrice: number
    serviceId: string
    onBookingSuccess: () => void
    user?: { name?: string | null; email?: string | null }
}

export function BookingModal({
    isOpen,
    onClose,
    serviceTitle,
    servicePrice,
    serviceId,
    onBookingSuccess,
    user
}: BookingModalProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [guests, setGuests] = useState(1)
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const totalPrice = Number(servicePrice) * guests

    const handleBooking = async () => {
        // Validate required fields
        if (!date) {
            setError("Please select a date")
            return
        }

        if (!name || name.trim().length < 2) {
            setError("Please enter your full name (at least 2 characters)")
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError("Please enter a valid email address")
            return
        }

        // Set time to a reasonable default (e.g., 10:00 AM) if not set
        const bookingDate = new Date(date)
        if (bookingDate.getHours() === 0 && bookingDate.getMinutes() === 0) {
            bookingDate.setHours(10, 0, 0, 0) // Default to 10 AM
        }

        // Validate date is in the future
        const now = new Date()
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
        if (bookingDate <= oneHourFromNow) {
            setError("Booking must be at least 1 hour in advance")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId: serviceId,
                    activityTitle: serviceTitle,
                    date: bookingDate.toISOString(),
                    guests,
                    totalPrice,
                    phone: phone || undefined,
                    name: name.trim(),
                    email: email.trim()
                }),
            })

            if (res.status === 401) {
                const callbackUrl = typeof window !== 'undefined'
                    ? `${window.location.pathname}${window.location.search}`
                    : '/services';
                toast.error('Please log in to book this service.')
                router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
                return
            }

            const data = await res.json()

            if (!res.ok) {
                // Handle structured error response
                let errorMessage = data.error?.message || (typeof data.error === 'string' ? data.error : 'Failed to create booking')

                // If validation error, append details
                if (data.error?.code === 'VALIDATION_ERROR' && Array.isArray(data.error.details)) {
                    const details = data.error.details.map((issue: { path?: string[]; message: string }) => {
                        const path = issue.path?.join('.') || 'field';
                        return `${path}: ${issue.message}`;
                    }).join(', ');
                    errorMessage = `Validation error: ${details}`;
                } else if (data.error?.code === 'NOT_FOUND') {
                    errorMessage = `Service not found. Please refresh the page and try again.`;
                } else if (data.error?.code === 'BAD_REQUEST') {
                    errorMessage = data.error.message || 'Invalid booking request. Please check your details.';
                }

                throw new Error(errorMessage)
            }

            // Show success message
            toast.success("Thank you! We have received your booking request. We will review it and get back to you as soon as possible.")
            onBookingSuccess()
            onClose()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Experience</DialogTitle>
                    <DialogDescription>
                        {serviceTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Date Picker */}
                    <div className="grid gap-2">
                        <Label>Date</Label>
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
                                    initialFocus
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const selectedDate = new Date(date);
                                        selectedDate.setHours(0, 0, 0, 0);
                                        return selectedDate < today;
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Guests */}
                    <div className="grid gap-2">
                        <Label>Guests</Label>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                min={1}
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    {/* Contact Info (Simple) */}
                    <div className="grid gap-2">
                        <Label>Full Name *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name for reservation"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="infoexploremarrakesh@gmail.com"
                            required
                            disabled={!!user?.email}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Phone (Optional)</Label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+212 601 439 975"
                        />
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/50 p-4 rounded-lg mt-2">
                        <div className="flex justify-between font-medium">
                            <span>Total Price</span>
                            <span className="text-primary text-lg">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}

                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleBooking} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Confirm Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
