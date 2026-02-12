'use client';

import { useMemo } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  bookingId: string;
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PayPalButton({
  bookingId,
  amount,
  currency = 'EUR',
  onSuccess,
  onError,
  disabled,
}: PayPalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';

  const initialOptions = useMemo(
    () => ({
      clientId,
      currency,
      intent: 'capture' as const,
    }),
    [clientId, currency]
  );

  if (!clientId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID.
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
          disabled={disabled}
          createOrder={async () => {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId, amount, currency }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create order');
            return data.orderId;
          }}
          onApprove={async (data) => {
            if (!data.orderID) {
              onError('No order ID from PayPal');
              return;
            }
            try {
              const res = await fetch('/api/paypal/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID, bookingId }),
              });
              const result = await res.json();
              if (!res.ok) throw new Error(result.error || 'Capture failed');
              onSuccess();
            } catch (err) {
              onError(err instanceof Error ? err.message : 'Payment failed');
            }
          }}
          onError={(err: unknown) => {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === 'object' && err !== null && 'message' in err
                  ? String((err as { message?: unknown }).message)
                  : 'PayPal error';
            onError(String(message));
          }}
          onCancel={() => {
            onError('Payment was cancelled.');
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
