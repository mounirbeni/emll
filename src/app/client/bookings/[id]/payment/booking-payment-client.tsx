'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PaymentMethodSelector, type PaymentMethodType } from '@/components/payment/PaymentMethodSelector';
import { PayPalButton } from '@/components/payment/PayPalButton';
import { BankTransferForm } from '@/components/payment/BankTransferForm';
import { CashPaymentConfirmation } from '@/components/payment/CashPaymentConfirmation';
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge';
import type { PaymentStatusType } from '@/components/payment/PaymentStatusBadge';
import { toast } from 'sonner';

type BookingWithExperience = {
  id: string;
  totalPrice: number | { toNumber?: () => number };
  paymentStatus: string;
  experience: { title: string };
};

interface BookingPaymentClientProps {
  booking: BookingWithExperience;
}

const amountDisplay = (totalPrice: number | { toNumber?: () => number }) => {
  const n = typeof totalPrice === 'number' ? totalPrice : (totalPrice as { toNumber?: () => number }).toNumber?.() ?? Number(totalPrice);
  return `€${n.toFixed(2)}`;
};

export function BookingPaymentClient({ booking }: BookingPaymentClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [error, setError] = useState('');
  const paypalStatus = searchParams.get('paypal');

  const token = searchParams.get('token');

  useEffect(() => {
    if (paypalStatus === 'cancel') {
      toast.error('PayPal payment was cancelled.');
      router.replace(`/client/bookings/${booking.id}/payment`, { scroll: false });
    }
  }, [paypalStatus, router, booking.id]);

  useEffect(() => {
    if ((paypalStatus === 'success' || token) && token) {
      fetch('/api/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: token, bookingId: booking.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) toast.success('Payment successful!');
          router.replace(`/client/bookings/${booking.id}/payment`, { scroll: false });
          router.refresh();
        })
        .catch(() => {
          router.replace(`/client/bookings/${booking.id}/payment`, { scroll: false });
          router.refresh();
        });
    }
  }, [token, paypalStatus, booking.id, router]);

  const amount = amountDisplay(booking.totalPrice);
  const paidOrCash =
    booking.paymentStatus === 'PAID' ||
    booking.paymentStatus === 'CASH_ON_ARRIVAL';
  const pendingVerification = booking.paymentStatus === 'PENDING_VERIFICATION';

  const handleSuccess = () => {
    setError('');
    router.refresh();
  };

  if (paidOrCash) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Link href={`/client/bookings/${booking.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <PaymentStatusBadge status={booking.paymentStatus as PaymentStatusType} className="mb-4" />
            <h2 className="text-xl font-bold text-gray-900">
              {booking.paymentStatus === 'PAID' ? 'Payment complete' : 'Cash on arrival confirmed'}
            </h2>
            <p className="text-gray-600 mt-2">
              {booking.experience.title} — {amount}
            </p>
            <Link href={`/client/bookings/${booking.id}`}>
              <Button className="mt-6 bg-primary hover:bg-orange-600 rounded-xl">View booking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Link href={`/client/bookings/${booking.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <PaymentStatusBadge status="PENDING_VERIFICATION" className="mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Payment pending verification</h2>
            <p className="text-gray-600 mt-2">We received your proof and will confirm payment soon.</p>
            <Link href={`/client/bookings/${booking.id}`}>
              <Button className="mt-6 bg-primary hover:bg-orange-600 rounded-xl">Back to booking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-3">
        <Link href={`/client/bookings/${booking.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pay for your booking</h1>
          <p className="text-sm text-gray-500">{booking.experience.title}</p>
        </div>
      </div>

      <PaymentMethodSelector
        selected={selectedMethod}
        onSelect={setSelectedMethod}
        amount={amount}
      />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {selectedMethod === 'PAYPAL' && (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <PayPalButton
              bookingId={booking.id}
              amount={Number(typeof booking.totalPrice === 'number' ? booking.totalPrice : (booking.totalPrice as { toNumber?: () => number }).toNumber?.() ?? 0)}
              onSuccess={handleSuccess}
              onError={setError}
            />
          </CardContent>
        </Card>
      )}

      {selectedMethod === 'BANK_TRANSFER' && (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <BankTransferForm
              bookingId={booking.id}
              amount={amount}
              onSuccess={handleSuccess}
              onError={setError}
            />
          </CardContent>
        </Card>
      )}

      {selectedMethod === 'CASH' && (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <CashPaymentConfirmation
              bookingId={booking.id}
              amount={amount}
              experienceTitle={booking.experience.title}
              onSuccess={handleSuccess}
              onError={setError}
            />
          </CardContent>
        </Card>
      )}

      {selectedMethod && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => { setSelectedMethod(null); setError(''); }}>
            Change payment method
          </Button>
        </div>
      )}
    </div>
  );
}
