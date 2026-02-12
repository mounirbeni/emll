import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { capturePayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus, TransactionStatus } from '@prisma/client';
import { z } from 'zod';

const bodySchema = z.object({
  orderId: z.string().min(1),
  bookingId: z.string().min(1),
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

    const { orderId, bookingId } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { experience: { select: { title: true } } },
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

    const { transactionId } = await capturePayPalOrder(orderId);

    const amount = Number(booking.totalPrice);

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: 'EUR',
          status: TransactionStatus.COMPLETED,
          method: PaymentMethod.PAYPAL,
          transactionId,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paymentIntentId: transactionId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      transactionId,
      message: 'Payment completed successfully',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Capture failed';
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
