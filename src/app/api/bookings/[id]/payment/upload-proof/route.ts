import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus, TransactionStatus } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  req: Request,
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

    const formData = await req.formData();
    const file = formData.get('proof') as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please upload a proof image (jpg, png, jpeg)' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG and JPEG are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png'].includes(ext) ? ext : 'jpg';
    const filename = `${bookingId}-${Date.now()}.${safeExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments');

    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, Buffer.from(bytes));

    const proofImageUrl = `/uploads/payments/${filename}`;
    const amount = Number(booking.totalPrice);

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: 'EUR',
          status: TransactionStatus.PENDING,
          method: PaymentMethod.BANK_TRANSFER,
          proofImageUrl,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: PaymentStatus.PENDING_VERIFICATION },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Proof uploaded. We will verify your payment shortly.',
      paymentStatus: 'PENDING_VERIFICATION',
      proofImageUrl,
    });
  } catch (err) {
    console.error('Upload proof error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
