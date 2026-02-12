import { redirect } from 'next/navigation';

export default function DashboardPaymentRedirect() {
  redirect('/client/dashboard/payment');
}
