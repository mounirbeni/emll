import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Building2, Banknote, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PaymentClient from '../../../components/payment/PaymentClient';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { bookingId } = await searchParams;

  if (bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { experience: true },
    });

    if (!booking) {
      return (
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Booking not found</h1>
          <p className="mt-2 text-gray-600">The booking you are trying to pay for does not exist.</p>
          <Link href="/client/bookings">
            <Button className="mt-4">Go to My Bookings</Button>
          </Link>
        </div>
      );
    }

    if (booking.paymentStatus === 'PAID') {
      return (
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold text-green-600">Booking Already Paid</h1>
          <p className="mt-2 text-gray-600">This booking has already been paid for.</p>
          <Link href={`/client/bookings/${bookingId}`}>
            <Button className="mt-4">View Booking Details</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="mb-8">
          <Link href="/client/bookings" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
            &larr; Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">
            Securely pay for your booking: <span className="font-semibold">{booking.experience.title}</span>
          </p>
        </div>

        <PaymentClient booking={booking} />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-8 px-4 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">Manage how you pay for your bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="font-bold text-gray-900">PayPal</h2>
            <p className="text-sm text-gray-500 mt-1">Pay securely with PayPal or your card.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="font-bold text-gray-900">Bank transfer</h2>
            <p className="text-sm text-gray-500 mt-1">Transfer and upload proof of payment.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <Banknote className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="font-bold text-gray-900">Cash on arrival</h2>
            <p className="text-sm text-gray-500 mt-1">Pay your guide in person on the day.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 bg-orange-50/50 rounded-2xl">
        <CardContent className="p-6">
          <p className="font-bold text-gray-900 text-lg">Pay for a booking</p>
          <p className="text-sm text-gray-600 mt-1">Open a booking and choose &quot;Pay now&quot; to select your payment method.</p>
          <Link href="/client/bookings">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6">
              View my bookings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
