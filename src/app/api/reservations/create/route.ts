import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            fullName,
            email,
            phone,
            experienceId,
            numberOfPersons,
            date,
            time,
            notes,
        } = body;

        // Basic Validation
        if (!fullName || !email || !phone || !experienceId || !numberOfPersons || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch Experience to get basePrice
        const experience = await prisma.experience.findUnique({
            where: { id: experienceId },
        });

        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        // Calculate basePrice (per person * number of people?)
        // User request says "basePrice: experience.basePrice".
        // Usually it acts as a unit price. But let's assume it means total base price for now,
        // or unit price.
        // "finalPrice = basePrice * 0.90" implies basePrice is the total amount to be discounted.
        // So basePrice should be unitPrice * numberOfPersons.
        // Let's calculate total base price.
        const totalBasePrice = experience.price * numberOfPersons;

        const reservation = await prisma.reservation.create({
            data: {
                fullName,
                email,
                phone,
                experienceId,
                numberOfPersons,
                date: date.toString(),
                time,
                notes,
                basePrice: totalBasePrice,
                paymentStatus: 'NOT_PAID',
            },
        });

        return NextResponse.json({
            reservationId: reservation.id,
            redirectUrl: `/reservation/payment/${reservation.id}`,
        });
    } catch (error) {
        console.error('Reservation creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
