import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createPayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bookingId, amount, currency } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, totalPrice: true, userEmail: true, userId: true, paymentStatus: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isOwner =
      booking.userId === session.user?.id ||
      booking.userEmail === session.user?.email;
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'Booking is already paid' },
        { status: 400 }
      );
    }

    const result = await createPayPalOrder({
      bookingId,
      amount,
      currency,
    });

    return NextResponse.json({ orderId: result.orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Create order failed';
    console.error('PayPal create order error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
