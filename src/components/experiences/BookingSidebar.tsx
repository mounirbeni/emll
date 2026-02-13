'use client';

import BookingForm from '@/components/reservations/BookingForm';

interface BookingSidebarProps {
    experienceId: string;
    experienceTitle: string;
    price: number;
    currency: string;
    pickupAvailable: boolean;
}

export default function BookingSidebar({
    experienceId,
    price,
    currency,
}: BookingSidebarProps) {
    return (
        <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-orange-50 p-6 text-center">
                    <span className="text-sm font-medium text-gray-500">Best Price Guaranteed</span>
                    <div className="mt-1 flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-extrabold text-gray-900">
                            {currency === 'EUR' ? '€' : currency}{price}
                        </span>
                        <span className="text-sm font-medium text-gray-500">per person</span>
                    </div>
                </div>
            </div>

            <BookingForm experienceId={experienceId} basePrice={price} />
        </div>
    );
}
