import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { bookingService } from '@/services/booking.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge';
import type { PaymentStatusType } from '@/components/payment/PaymentStatusBadge';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingStatusPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const ownershipId = session.user.email ?? session.user.id;

  let booking;
  try {
    booking = await bookingService.getBookingById(id, ownershipId);
  } catch {
    booking = null;
  }

  if (!booking) {
    notFound();
  }

  const b = booking as {
    id: string;
    status: string;
    paymentStatus: string;
    totalPrice: number | { toNumber?: () => number };
    date: Date;
    experience: { title: string };
  };
  const totalPrice = typeof b.totalPrice === 'number' ? b.totalPrice : (b.totalPrice as { toNumber?: () => number }).toNumber?.() ?? 0;

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-20">
      <Link href={`/client/bookings/${b.id}`}>
        <Button variant="ghost" size="icon" className="rounded-full -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Booking status</h1>
          <p className="text-gray-600 mb-4">{b.experience.title}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500">Booking:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              {b.status}
            </span>
            <span className="text-sm text-gray-500">Payment:</span>
            <PaymentStatusBadge status={b.paymentStatus as PaymentStatusType} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
            <p>Date: {new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p>Total: €{totalPrice.toFixed(2)}</p>
          </div>
          <Link href={`/client/bookings/${b.id}`}>
            <Button className="mt-6 w-full bg-primary hover:bg-orange-600 rounded-xl">View full details</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
