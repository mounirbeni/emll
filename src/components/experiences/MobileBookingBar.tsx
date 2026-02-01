'use client';

import { useState } from 'react';
import { Calendar, Users, X, User, Mail, Phone, Loader2, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface MobileBookingBarProps {
    experienceId: string;
    experienceTitle: string;
    price: number;
    currency: string;
}

type BookingState = 'idle' | 'form' | 'loading' | 'success';

export default function MobileBookingBar({
    experienceId,
    experienceTitle,
    price,
    currency
}: MobileBookingBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [bookingState, setBookingState] = useState<BookingState>('idle');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [guests, setGuests] = useState(2);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [bookingResult, setBookingResult] = useState<{ bookingId: string; whatsappLink: string } | null>(null);

    const total = price * guests;

    const handleSubmit = async () => {
        // Validation
        if (!name || name.length < 2) {
            setError('Please enter your name');
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (!phone || phone.length < 8) {
            setError('Please enter a valid phone number');
            return;
        }
        if (!date) {
            setError('Please select a date');
            return;
        }

        setBookingState('loading');
        setError(null);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experienceId,
                    experienceTitle,
                    date: date.toISOString(),
                    numberOfPeople: guests,
                    totalPrice: total,
                    userName: name,
                    userEmail: email,
                    userPhone: phone
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Booking failed');
            }

            const waLink = `https://wa.me/212601439975?text=${encodeURIComponent(`New Booking:\nName: ${name}\nExperience: ${experienceTitle}\nDate: ${date.toLocaleDateString()}\nPeople: ${guests}\nTotal: ${total}€`)}`;

            setBookingResult({
                bookingId: result.id,
                whatsappLink: waLink
            });

            window.open(waLink, '_blank');
            setBookingState('success');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setBookingState('form');
        }
    };

    const resetAndClose = () => {
        setIsOpen(false);
        setBookingState('idle');
        setBookingResult(null);
        setError(null);
        setName('');
        setEmail('');
        setPhone('');
        setDate(undefined);
        setGuests(2);
    };

    // Mobile bottom bar (hidden on desktop)
    return (
        <>
            {/* Fixed Bottom Bar - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-2xl shadow-gray-900/20 lg:hidden safe-area-bottom">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl font-bold text-gray-900">
                            {currency === 'EUR' ? '€' : currency}{price}
                            <span className="text-sm font-normal text-gray-500">/person</span>
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setIsOpen(true);
                            setBookingState('form');
                        }}
                        className="rounded-xl bg-orange-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
                    >
                        Book Now
                    </Button>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={resetAndClose}
                    />

                    {/* Modal Content */}
                    <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white safe-area-bottom">
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                {bookingState === 'success' ? 'Booking Confirmed!' : 'Complete Your Booking'}
                            </h2>
                            <button
                                onClick={resetAndClose}
                                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Success State */}
                        {bookingState === 'success' && bookingResult && (
                            <div className="p-6">
                                <div className="mb-6 flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="text-gray-600">Your booking request has been received!</p>
                                </div>

                                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                                    <p className="text-xs font-medium uppercase text-gray-500">Booking ID</p>
                                    <p className="font-mono text-lg font-bold">{bookingResult.bookingId}</p>
                                </div>

                                <a
                                    href={bookingResult.whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Contact on WhatsApp
                                </a>

                                <button
                                    onClick={resetAndClose}
                                    className="mt-4 w-full py-3 text-center text-sm font-medium text-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                        )}

                        {/* Form State */}
                        {(bookingState === 'form' || bookingState === 'loading') && (
                            <div className="p-6 pb-8">
                                {/* Experience Info */}
                                <div className="mb-6 rounded-xl bg-orange-50 p-4">
                                    <p className="font-bold text-gray-900">{experienceTitle}</p>
                                    <p className="mt-1 text-2xl font-extrabold text-orange-600">
                                        €{total}
                                        <span className="text-sm font-normal text-gray-500"> total</span>
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                {/* Date Selection */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-bold text-gray-900">
                                        <Calendar className="mr-2 inline h-4 w-4" />
                                        Select Date
                                    </label>
                                    <CalendarComponent
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(d) => d < new Date()}
                                        className="rounded-xl border"
                                    />
                                </div>

                                {/* Guests */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-bold text-gray-900">
                                        <Users className="mr-2 inline h-4 w-4" />
                                        Participants
                                    </label>
                                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-2">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
                                            disabled={guests <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="font-bold">{guests}</span>
                                        <button
                                            onClick={() => setGuests(Math.min(50, guests + 1))}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    className="mt-6 w-full rounded-xl bg-orange-500 py-6 text-base font-bold text-white"
                                    onClick={handleSubmit}
                                    disabled={bookingState === 'loading'}
                                >
                                    {bookingState === 'loading' ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Confirm Booking • €${total}`
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
