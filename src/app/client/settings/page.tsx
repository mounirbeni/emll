'use client';

import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { UserHubSection } from '@/components/mobile/UserHubSection';
import { UserHubRow } from '@/components/mobile/UserHubRow';
import { Globe, Bell, Moon, Smartphone } from 'lucide-react';

export default function SettingsPage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Preferences" showBack />

            <div className="p-4">
                <UserHubSection title="General">
                    <UserHubRow
                        icon={Globe}
                        title="Language"
                        subtitle="English (US)"
                        href="/client/settings/language"
                    />
                    <UserHubRow
                        icon={Smartphone}
                        title="App Appearance"
                        subtitle="System Default"
                        href="#"
                    />
                </UserHubSection>

                <UserHubSection title="Notifications">
                    <UserHubRow
                        icon={Bell}
                        title="Push Notifications"
                        subtitle="On"
                        href="#"
                    />
                    <UserHubRow
                        icon={Mail}
                        title="Email Preferences"
                        subtitle="Weekly Newsletter"
                        href="#"
                    />
                </UserHubSection>
            </div>
        </MobileAppContainer>
    );
}

// Helper icons
function Mail(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
