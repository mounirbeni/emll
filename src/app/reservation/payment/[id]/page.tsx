import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PaymentOptions from '../../../../components/reservations/PaymentOptions'; // Will create this next
import ReservationSummary from '@/components/reservations/ReservationSummary';

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Reservation
    const reservation = await prisma.reservation.findUnique({
        where: { id },
    });

    if (!reservation) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Reservation not found</h1>
                <p>Please check your link or contact support.</p>
            </div>
        );
    }

    // Fetch Experience Title
    const experience = await prisma.experience.findUnique({
        where: { id: reservation.experienceId },
        select: { title: true },
    });

    if (reservation.paymentStatus === 'PAID' || reservation.paymentStatus === 'CASH_ON_DELIVERY' || reservation.paymentStatus === 'WAITING_VERIFICATION') {
        redirect(`/reservation/confirmation/${id}`);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Complete Your Booking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Payment Options */}
                <div className="lg:col-span-2">
                    <PaymentOptions
                        reservation={reservation}
                    />
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <ReservationSummary
                        reservation={reservation}
                        experienceTitle={experience?.title || 'Experience'}
                    />
                </div>
            </div>
        </div>
    );
}
