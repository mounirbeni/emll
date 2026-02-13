import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        const finalPrice = Math.round(reservation.basePrice * 0.95); // 5% discount

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: {
                paymentStatus: 'WAITING_VERIFICATION',
                paymentMethod: 'BANK_TRANSFER',
                finalPrice: finalPrice,
            },
        });

        return NextResponse.json(updatedReservation);
    } catch (error) {
        console.error('Bank transfer update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
