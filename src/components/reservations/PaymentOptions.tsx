'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentCard from './PaymentCard';
import { CreditCard, Building2, Banknote } from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentOptionsProps {
    reservation: {
        id: string;
        basePrice: number;
    };
}

export default function PaymentOptions({ reservation }: PaymentOptionsProps) {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<'PAYPAL' | 'BANK_TRANSFER' | 'CASH' | null>(null);
    const [loading, setLoading] = useState(false);

    // Calculate prices
    const payPalPrice = Math.round(reservation.basePrice * 0.90);
    const bankPrice = Math.round(reservation.basePrice * 0.95);
    const cashPrice = Math.round(reservation.basePrice * 1.10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePayPalSuccess = async (details: unknown, data: unknown) => {
        try {
            const res = await fetch(`/api/reservations/${reservation.id}/payment/paypal`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed to update status');
            router.push(`/reservation/confirmation/${reservation.id}`);
        } catch {
            toast.error('Payment successful but failed to update system. Please contact us.');
        }
    };

    const handleBankTransfer = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reservations/${reservation.id}/payment/bank`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed');
            router.push(`/reservation/confirmation/${reservation.id}`);
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleCash = async () => {
        if (!confirm(`Confirm pay on arrival with total €${cashPrice}?`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/reservations/${reservation.id}/payment/cash`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed');
            router.push(`/reservation/confirmation/${reservation.id}`);
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {/* PayPal Option */}
                <div onClick={() => setSelectedMethod('PAYPAL')}>
                    <PaymentCard
                        title="PayPal / Credit Card"
                        description="Secure payment via PayPal. Includes buyer protection."
                        originalPrice={reservation.basePrice}
                        finalPrice={payPalPrice}
                        discountLabel="-10% OFF"
                        discountColor="green"
                        icon={<CreditCard className="w-6 h-6" />}
                        selected={selectedMethod === 'PAYPAL'}
                        onSelect={() => setSelectedMethod('PAYPAL')}
                    />
                    {selectedMethod === 'PAYPAL' && (
                        <div className="mt-4 p-4 border border-orange-100 bg-orange-50/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test', currency: "EUR" }}>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [{
                                                amount: {
                                                    value: payPalPrice.toString(),
                                                    currency_code: "EUR"
                                                },
                                                description: `Booking #${reservation.id}`
                                            }]
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        const details = await actions.order!.capture();
                                        handlePayPalSuccess(details, data);
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    )}
                </div>

                {/* Bank Transfer Option */}
                <div onClick={() => setSelectedMethod('BANK_TRANSFER')}>
                    <PaymentCard
                        title="Bank Transfer"
                        description="Direct transfer to our bank account."
                        originalPrice={reservation.basePrice}
                        finalPrice={bankPrice}
                        discountLabel="-5% OFF"
                        discountColor="green"
                        icon={<Building2 className="w-6 h-6" />}
                        selected={selectedMethod === 'BANK_TRANSFER'}
                        onSelect={() => setSelectedMethod('BANK_TRANSFER')}
                    />
                    {selectedMethod === 'BANK_TRANSFER' && (
                        <div className="mt-4 p-6 border border-orange-100 bg-orange-50/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold mb-2">Bank Details</h4>
                            <p className="text-sm">Bank: Explore Marrakesh Business</p>
                            <p className="text-sm">IBAN: MA00 0000 0000 0000 0000 0000 00</p>
                            <p className="text-sm mb-4">BIC: BICMAXXX</p>
                            <Button onClick={handleBankTransfer} disabled={loading} className="w-full">
                                {loading ? 'Processing...' : 'Proceed with Bank Transfer'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Cash Option */}
                <div onClick={() => setSelectedMethod('CASH')}>
                    <PaymentCard
                        title="Cash on Arrival"
                        description="Pay when you arrive at the meeting point."
                        originalPrice={reservation.basePrice}
                        finalPrice={cashPrice}
                        discountLabel="+10% EXTRA"
                        discountColor="blue"
                        icon={<Banknote className="w-6 h-6" />}
                        selected={selectedMethod === 'CASH'}
                        onSelect={() => setSelectedMethod('CASH')}
                    />
                    {selectedMethod === 'CASH' && (
                        <div className="mt-4 p-6 border border-orange-100 bg-orange-50/50 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm mb-4">
                                Please note that paying on arrival incurs a <strong>10% service fee</strong>.
                                Bring the exact amount of <strong>€{cashPrice}</strong>.
                            </p>
                            <Button onClick={handleCash} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
                                {loading ? 'Processing...' : 'Confirm Pay on Arrival'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
