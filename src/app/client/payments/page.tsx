import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Building2, Banknote, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">Manage how you pay for your bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-gray-900">PayPal</h2>
            <p className="text-sm text-gray-500 mt-1">Pay securely with PayPal or your card.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-gray-900">Bank transfer</h2>
            <p className="text-sm text-gray-500 mt-1">Transfer and upload proof of payment.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4">
              <Banknote className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-gray-900">Cash on arrival</h2>
            <p className="text-sm text-gray-500 mt-1">Pay your guide in person on the day.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5 rounded-2xl">
        <CardContent className="p-6">
          <p className="font-medium text-gray-900">Pay for a booking</p>
          <p className="text-sm text-gray-600 mt-1">Open a booking and choose &quot;Pay now&quot; to select your payment method.</p>
          <Link href="/client/bookings">
            <Button className="mt-4 bg-primary hover:bg-orange-600 text-white rounded-xl">
              View my bookings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
