import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PaymentStatus, TransactionStatus } from '@prisma/client';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.paymentStatus !== PaymentStatus.PENDING_VERIFICATION) {
      return NextResponse.json(
        { error: 'Booking is not pending verification' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: PaymentStatus.PAID },
      }),
      ...booking.payments
        .filter((p) => p.status === TransactionStatus.PENDING)
        .map((p) =>
          prisma.payment.update({
            where: { id: p.id },
            data: { status: TransactionStatus.COMPLETED },
          })
        ),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Payment verified',
      paymentStatus: 'PAID',
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 500 }
    );
  }
}
