import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { History, Receipt } from 'lucide-react';

export default function PaymentsPage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Payments" showBack />

            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Receipt className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Transactions Yet</h2>
                <p className="text-gray-500 max-w-xs mx-auto">
                    Your payment history will appear here once you book an experience.
                </p>
            </div>
        </MobileAppContainer>
    );
}
