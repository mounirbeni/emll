'use client';

import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { UserHubSection } from '@/components/mobile/UserHubSection';
import { UserHubRow } from '@/components/mobile/UserHubRow';
import { MessageCircle, HelpCircle, FileText, Mail } from 'lucide-react';

export default function SupportPage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Help & Support" showBack />

            <div className="p-4">
                <div className="bg-primary/10 rounded-2xl p-6 mb-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-orange-500/20">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-charcoal mb-1">Need help now?</h2>
                    <p className="text-sm text-gray-600 mb-4">Our support team is available 24/7 to assist you.</p>
                    <button className="bg-primary text-white font-semibold py-2.5 px-6 rounded-xl shadow-md active:scale-95 transition-transform w-full">
                        Start Live Chat
                    </button>
                </div>

                <UserHubSection title="Resources">
                    <UserHubRow
                        icon={HelpCircle}
                        title="FAQ"
                        subtitle="Frequently asked questions"
                        href="#"
                    />
                    <UserHubRow
                        icon={FileText}
                        title="Terms of Service"
                        href="#"
                    />
                    <UserHubRow
                        icon={FileText}
                        title="Privacy Policy"
                        href="#"
                    />
                </UserHubSection>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">App Version 12.0.0 (Beta)</p>
                </div>
            </div>
        </MobileAppContainer>
    );
}
