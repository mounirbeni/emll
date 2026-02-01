'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Check, User, Mail, Phone, Loader2, CheckCircle, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingSidebarProps {
    experienceId: string;
    experienceTitle: string;
    price: number;
    currency: string;
    pickupAvailable: boolean;
}

type BookingState = 'form' | 'loading' | 'success' | 'error';

interface BookingResult {
    bookingId: string;
    whatsappLink: string;
}

export default function BookingSidebar({
    experienceId,
    experienceTitle,
    price,
    currency,
    pickupAvailable
}: BookingSidebarProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [guests, setGuests] = useState(2);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [bookingState, setBookingState] = useState<BookingState>('form');
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const total = price * guests;

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!name || name.length < 2) {
            errors.name = ['Name must be at least 2 characters'];
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = ['Please enter a valid email address'];
        }
        if (!phone || phone.length < 8) {
            errors.phone = ['Please enter a valid phone number'];
        }
        if (!date) {
            errors.date = ['Please select a date'];
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBook = async () => {
        if (!validateForm()) return;

        setBookingState('loading');
        setError(null);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experienceId,
                    experienceTitle,
                    date: date!.toISOString(),
                    numberOfPeople: guests,
                    totalPrice: total,
                    userName: name,
                    userEmail: email,
                    userPhone: phone,
                    notes: specialRequests || undefined
                })
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.details) {
                    setFieldErrors(result.details);
                }
                throw new Error(result.error || 'Booking failed');
            }

            setBookingResult({
                bookingId: result.id, // API returns the full booking object, assuming id is present
                whatsappLink: `https://wa.me/212601439975?text=${encodeURIComponent(`New Booking:\nName: ${name}\nExperience: ${experienceTitle}\nDate: ${date!.toLocaleDateString()}\nPeople: ${guests}\nTotal: ${total}€`)}`
                // Note: API response might not contain whatsappLink if we didn't explicitly return it in JSON.
                // My API returns the booking object. I should generate the link client-side or ensuring API returns it.
                // The requirements say "Generate a WhatsApp deep-link... Automatically open this".
                // I'll generate it here or use the one from API if I added it. 
                // Re-reading API code: it does NOT return whatsappLink. It returns the booking info.
                // So I will construct it here using the helper logic or inline.
            });

            // Auto-open WhatsApp
            const waLink = `https://wa.me/212601439975?text=${encodeURIComponent(`New Booking:\nName: ${name}\nExperience: ${experienceTitle}\nDate: ${date!.toLocaleDateString()}\nPeople: ${guests}\nTotal: ${total}€`)}`;
            window.open(waLink, '_blank');

            setBookingState('success');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setBookingState('error');
        }
    };

    const resetForm = () => {
        setBookingState('form');
        setBookingResult(null);
        setError(null);
        setFieldErrors({});
    };

    // Success State
    if (bookingState === 'success' && bookingResult) {
        return (
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-xl shadow-green-100/50">
                <div className="bg-gray-50 p-8 text-center rounded-b-xl border-t border-gray-100">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Booking Confirmed!</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Your booking request has been received. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Booking ID</p>
                        <p className="mt-1 font-mono text-lg font-bold text-gray-900">{bookingResult.bookingId}</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{experienceTitle}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-600">{guests} × €{price}</span>
                            <span className="font-bold text-gray-900">€{total}</span>
                        </div>
                        <div className="mt-2 border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>€{total}</span>
                        </div>
                    </div>

                    <a
                        href={bookingResult.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:-translate-y-0.5"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Contact Us on WhatsApp
                    </a>

                    <button
                        onClick={resetForm}
                        className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        Make Another Booking
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
            {/* Header */}
            <div className="bg-gray-50 p-6">
                <span className="text-sm font-medium text-gray-500">Starting from</span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">
                        {currency === 'EUR' ? '€' : currency} {price}
                    </span>
                    <span className="text-sm font-medium text-gray-500">per person</span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-5 p-6">
                {/* Error Banner */}
                {bookingState === 'error' && error && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                        <X className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <div>
                            <p className="font-medium">Booking failed</p>
                            <p className="mt-1">{error}</p>
                        </div>
                        <button onClick={resetForm} className="ml-auto text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Date Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Select Date *</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className={cn(
                                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition-colors hover:border-orange-500 hover:ring-1 hover:ring-orange-500",
                                    fieldErrors.date ? "border-red-300 bg-red-50" : "border-gray-200",
                                    !date && "text-gray-500"
                                )}
                            >
                                <span>{date ? format(date, "EEE, MMM d, yyyy") : "Pick a date"}</span>
                                <CalendarIcon className="h-5 w-5 text-orange-500" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d);
                                    setFieldErrors(prev => ({ ...prev, date: [] }));
                                }}
                                initialFocus
                                disabled={(d) => d < new Date()}
                                className="rounded-xl border border-gray-100 shadow-xl"
                            />
                        </PopoverContent>
                    </Popover>
                    {fieldErrors.date && <p className="text-xs text-red-500">{fieldErrors.date[0]}</p>}
                </div>

                {/* Guest Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Participants *</label>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-1">
                        <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            disabled={guests <= 1}
                        >
                            -
                        </button>
                        <span className="font-bold text-gray-900">{guests}</span>
                        <button
                            onClick={() => setGuests(Math.min(50, guests + 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 border-t border-gray-100 pt-5">
                    <h4 className="text-sm font-bold text-gray-900">Contact Information</h4>

                    {/* Name */}
                    <div className="space-y-1">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, name: [] }));
                                }}
                                className={cn(
                                    "w-full rounded-xl border py-3 pl-10 pr-4 text-sm font-medium transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                                    fieldErrors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                                )}
                            />
                        </div>
                        {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name[0]}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email Address *"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, email: [] }));
                                }}
                                className={cn(
                                    "w-full rounded-xl border py-3 pl-10 pr-4 text-sm font-medium transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                                    fieldErrors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                                )}
                            />
                        </div>
                        {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email[0]}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, phone: [] }));
                                }}
                                className={cn(
                                    "w-full rounded-xl border py-3 pl-10 pr-4 text-sm font-medium transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                                    fieldErrors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                                )}
                            />
                        </div>
                        {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone[0]}</p>}
                    </div>

                    {/* Special Requests */}
                    <div>
                        <textarea
                            placeholder="Special requests (optional)"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                    </div>
                </div>

                {/* Total Summary */}
                <div className="rounded-xl bg-orange-50 p-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{guests} x €{price}</span>
                        <span className="font-bold text-gray-900">€{total}</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-orange-100 pt-3 text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>€{total}</span>
                    </div>
                </div>

                {/* Book Button */}
                <Button
                    className="w-full rounded-xl bg-orange-500 py-6 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    size="lg"
                    onClick={handleBook}
                    disabled={bookingState === 'loading'}
                >
                    {bookingState === 'loading' ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Book Now'
                    )}
                </Button>

                {pickupAvailable && (
                    <div className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-green-700 bg-green-50">
                        <Check className="h-3.5 w-3.5" />
                        <span>Free Hotel Pickup Included</span>
                    </div>
                )}
            </div>
        </div>
    );
}
