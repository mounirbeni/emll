'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethodSelector, type PaymentMethodType } from '@/components/payment/PaymentMethodSelector';
import { PayPalButton } from '@/components/payment/PayPalButton';
import { BankTransferForm } from '@/components/payment/BankTransferForm';
import { Loader2, Banknote } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any; // Using any for simplicity as I can't easily import Prisma types here without full type generation, but in real app I'd use BookingWithExperience
}

export default function PaymentClient({ booking }: PaymentClientProps) {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>('PAYPAL');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayPalSuccess = async () => {
        toast.success('Payment successful!');
        router.refresh();
        // Redirect or show success
        router.push(`/client/bookings/${booking.id}`);
    };

    const handlePayPalError = (msg: string) => {
        toast.error(`PayPal Error: ${msg}`);
    };

    const handleCashPayload = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}/payment/cash`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Failed to update payment status');

            toast.success('Booking confirmed! You can pay on arrival.');
            router.push(`/client/bookings/${booking.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle>Select Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <PaymentMethodSelector
                            selected={selectedMethod}
                            onSelect={setSelectedMethod}
                            amount={`€${booking.totalPrice}`}
                        />

                        <div className="pt-6 border-t border-gray-100">
                            {selectedMethod === 'PAYPAL' && (
                                <div className="max-w-md mx-auto">
                                    <PayPalButton
                                        bookingId={booking.id}
                                        amount={booking.totalPrice}
                                        onSuccess={handlePayPalSuccess}
                                        onError={handlePayPalError}
                                    />
                                </div>
                            )}

                            {selectedMethod === 'BANK_TRANSFER' && (
                                <div>
                                    <BankTransferForm
                                        bookingId={booking.id}
                                        amount={`€${booking.totalPrice}`}
                                        onSuccess={() => {
                                            toast.success('Proof uploaded successfully!');
                                            router.refresh();
                                        }}
                                        onError={(msg) => toast.error(msg)}
                                    />
                                </div>
                            )}

                            {selectedMethod === 'CASH' && (
                                <div className="text-center space-y-4">
                                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                        <Banknote className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-gray-900">Pay on Arrival</h3>
                                        <p className="text-gray-600 max-w-sm mx-auto">
                                            You can pay the full amount of <span className="font-bold text-gray-900">€{booking.totalPrice}</span> in cash (EUR or MAD) when you meet your guide.
                                        </p>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 font-bold text-lg shadow-lg shadow-orange-500/20"
                                        onClick={handleCashPayload}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : (
                                            'Confirm Pay on Arrival'
                                        )}
                                    </Button>
                                    <p className="text-xs text-gray-400">By confirming, you agree to our cancellation policy.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
                <Card className="border-none shadow-md rounded-2xl sticky top-24">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-2xl">
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</p>
                                <p className="font-bold text-gray-900">{booking.experience.title}</p>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</p>
                                    <p className="font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</p>
                                    <p className="font-medium text-gray-900">{booking.numberOfPeople} People</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-xl text-gray-900">Total</span>
                                    <span className="font-bold text-2xl text-orange-600">€{booking.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
