'use client';

import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { UserHubSection } from '@/components/mobile/UserHubSection';
import { UserHubRow } from '@/components/mobile/UserHubRow';
import { Globe, Bell, Smartphone, Mail } from 'lucide-react';

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
