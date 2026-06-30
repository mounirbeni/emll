/**
 * PayPal REST API helpers (Orders v2)
 * Uses client credentials for server-side create order & capture
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured');
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export interface CreateOrderParams {
  bookingId: string;
  amount: number;
  currency?: string;
}

export async function createPayPalOrder(params: CreateOrderParams): Promise<{ orderId: string }> {
  const token = await getPayPalAccessToken();
  const { bookingId, amount, currency = 'EUR' } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: bookingId,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: `Booking ${bookingId}`,
        },
      ],
      application_context: {
        return_url: `${appUrl}/client/bookings/${bookingId}/payment?paypal=success`,
        cancel_url: `${appUrl}/client/bookings/${bookingId}/payment?paypal=cancel`,
        brand_name: 'Explore Marrakesh',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
      },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || 'PayPal create order failed');
  }
  const data = (await res.json()) as { id: string };
  return { orderId: data.id };
}

export async function refundPayPalCapture(captureId: string, amount?: number, currency = 'EUR'): Promise<{ refundId: string }> {
  const token = await getPayPalAccessToken();
  const body: Record<string, unknown> = {};
  if (amount !== undefined) {
    body.amount = { value: amount.toFixed(2), currency_code: currency };
  }
  const res = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || 'PayPal refund failed');
  }
  const data = (await res.json()) as { id: string };
  return { refundId: data.id };
}

export async function capturePayPalOrder(orderId: string): Promise<{ transactionId: string }> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: '{}',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || 'PayPal capture failed');
  }
  const data = (await res.json()) as {
    status?: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{ id: string }>;
      };
    }>;
  };
  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  if (!captureId) {
    throw new Error('PayPal capture ID not found in response');
  }
  return { transactionId: captureId };
}
