import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { bookingService } from '@/services/booking.service';
import { BookingPaymentClient } from './booking-payment-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPaymentPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const userIdentifier = session.user.email ?? session.user.id;

  let booking;
  try {
    booking = await bookingService.getBookingById(id, userIdentifier as string);
  } catch {
    booking = null;
  }

  if (!booking) {
    notFound();
  }

  return <BookingPaymentClient booking={booking} />;
}
