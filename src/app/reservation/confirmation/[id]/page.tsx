import { prisma } from '@/lib/prisma';
import ReservationSummary from '@/components/reservations/ReservationSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
        where: { id },
    });

    if (!reservation) {
        return <div>Reservation not found</div>;
    }

    const experience = await prisma.experience.findUnique({
        where: { id: reservation.experienceId },
        select: { title: true },
    });

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-600">Your reservation has been successfully recorded.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div>
                    <ReservationSummary
                        reservation={reservation}
                        experienceTitle={experience?.title || 'Experience'}
                    />

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                        <h3 className="font-bold mb-2">Payment Status</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Method</span>
                            <span className="font-medium">{reservation.paymentMethod || 'Not Selected'}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Status</span>
                            <span className={`font-bold px-2 py-1 rounded text-sm ${reservation.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                                    reservation.paymentStatus === 'WAITING_VERIFICATION' ? 'bg-yellow-100 text-yellow-700' :
                                        reservation.paymentStatus === 'CASH_ON_DELIVERY' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                }`}>
                                {reservation.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                        <h3 className="font-bold text-green-800 text-lg mb-2">Need Help?</h3>
                        <p className="text-green-700 mb-4">Contact us via WhatsApp for immediate support.</p>
                        <Link href={`https://wa.me/212600000000?text=Hello, I have a question about my booking #${reservation.id}`} target="_blank">
                            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-xl">
                                Chat on WhatsApp
                            </Button>
                        </Link>
                    </div>

                    <Link href="/">
                        <Button variant="outline" className="w-full h-12 rounded-xl">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
