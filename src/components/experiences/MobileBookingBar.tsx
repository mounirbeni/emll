"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileBookingWizard } from '@/components/mobile/MobileBookingWizard';
import { useRouter } from 'next/navigation';

interface MobileBookingBarProps {
    experienceId: string;
    experienceTitle: string;
    price: number;
    currency: string;
}

export default function MobileBookingBar({
    experienceId,
    experienceTitle,
    price,
    currency
}: MobileBookingBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Mobile bottom bar (hidden on desktop)
    return (
        <>
            {/* Fixed Bottom Bar - Mobile Only */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-2xl shadow-gray-900/20 lg:hidden"
                style={{
                    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
                }}
            >
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl font-bold text-gray-900">
                            {currency === 'EUR' ? '€' : currency}{price}
                            <span className="text-sm font-normal text-gray-500">/person</span>
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="rounded-xl bg-orange-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
                    >
                        Book Now
                    </Button>
                </div>
            </div>

            <MobileBookingWizard
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                serviceTitle={experienceTitle}
                servicePrice={price}
                serviceId={experienceId}
                onBookingSuccess={(bookingId) => {
                    setIsOpen(false);
                    router.push(`/client/payments?bookingId=${bookingId}`);
                }}
            />
        </>
    );
}
