'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banknote, Loader2, CheckCircle } from 'lucide-react';

interface CashPaymentConfirmationProps {
  bookingId: string;
  amount: string;
  experienceTitle?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export function CashPaymentConfirmation({
  bookingId,
  amount,
  experienceTitle,
  onSuccess,
  onError,
  disabled,
}: CashPaymentConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    onError('');

    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment/cash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to confirm');
      }

      setConfirmed(true);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
        <p className="font-bold text-gray-900">Cash on arrival confirmed</p>
        <p className="text-sm text-gray-600 mt-2">
          Pay <strong className="text-primary">{amount}</strong> to your guide in person on the day of the experience.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-white border border-primary/10 text-left text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">What to do next:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Arrive at the meeting point at the scheduled time</li>
            <li>Your guide will greet you and confirm the booking</li>
            <li>Pay the amount in cash (EUR or local currency as agreed)</li>
            <li>Enjoy your experience!</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 md:p-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Banknote className="w-5 h-5 text-primary" />
          Pay on arrival
        </h3>
        <p className="text-sm text-gray-600">
          You will pay <strong className="text-primary">{amount}</strong> in cash to your guide when you meet for the experience
          {experienceTitle ? `: ${experienceTitle}` : ''}.
        </p>
      </div>

      <Button
        type="button"
        onClick={handleConfirm}
        disabled={disabled || loading}
        className="w-full h-12 rounded-xl bg-primary hover:bg-orange-600 text-white font-bold"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm cash on arrival'
        )}
      </Button>
    </div>
  );
}
