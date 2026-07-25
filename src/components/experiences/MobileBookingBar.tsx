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
            {/* Docked above the bottom nav so both stay reachable on mobile. */}
            <div className="dock-above-nav layer-docked border-border fixed left-0 right-0 border-t bg-white px-4 py-3 shadow-lg lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-ink-500 text-xs">From</p>
                        <p className="text-foreground text-xl font-bold">
                            {currency === 'EUR' ? '€' : currency}{price}
                            <span className="text-ink-500 text-sm font-normal">/person</span>
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="lg"
                        className="shadow-brand rounded-xl px-8 text-base font-bold"
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
