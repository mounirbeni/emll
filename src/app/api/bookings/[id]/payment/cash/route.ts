import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus, TransactionStatus } from '@prisma/client';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;

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

    const amount = Number(booking.totalPrice);

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: 'EUR',
          status: TransactionStatus.PENDING,
          method: PaymentMethod.CASH,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: PaymentStatus.CASH_ON_ARRIVAL },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Cash on arrival confirmed',
      paymentStatus: 'CASH_ON_ARRIVAL',
    });
  } catch (err) {
    console.error('Cash payment error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Payment failed' },
      { status: 500 }
    );
  }
}
