'use client';

import { useSession, signOut } from 'next-auth/react';
import {
    User,
    Settings,
    LogOut,
    CreditCard,
    MessageSquare,
    Shield,
    HelpCircle,
    Sparkles,
    Wallet,
    Globe,
    Lock,
    Smartphone,
    Mail,
    Bell
} from 'lucide-react';
import Image from 'next/image';
import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { UserHubRow } from '@/components/mobile/UserHubRow';
import { UserHubSection } from '@/components/mobile/UserHubSection';

interface ProfileClientProps {
    user: any; // Using any to avoid type complexity with Prisma types on client, but practically it matches
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const { data: session } = useSession(); // Optimistic update support

    // Use session data if available (for immediate updates), otherwise fallback to server data
    const displayName = session?.user?.name || user?.name || 'Valued Guest';
    const displayEmail = session?.user?.email || user?.email || '';
    const displayImage = session?.user?.image || user?.image;
    // Format member since date
    const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024';
    const loyaltyPoints = user?.loyaltyPoints || 0;

    // Simple tier logic
    const tier = loyaltyPoints >= 1000 ? 'Gold' : loyaltyPoints >= 500 ? 'Silver' : 'Bronze';

    return (
        <MobileAppContainer className="bg-[#FDF8F3] pb-24">
            {/* Header Area */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-3xl font-bold text-charcoal mb-6">Account</h1>

                <div className="flex items-center gap-4 mb-2">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md">
                            {displayImage ? (
                                <Image
                                    src={displayImage}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-bold">
                                    {displayName.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-charcoal leading-tight">{displayName}</h2>
                        <p className="text-sm text-gray-500">{displayEmail}</p>
                    </div>
                </div>

                {/* Mini Stats / Badges */}
                <div className="flex gap-3 mt-4">
                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-charcoal">{loyaltyPoints} Points</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Member since {memberSince}</span>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Section 1: My Account */}
                <UserHubSection title="My Account">
                    <UserHubRow
                        icon={User}
                        title="Personal Information"
                        subtitle="Edit your profile details"
                        href="/client/profile/edit"
                    />
                    <UserHubRow
                        icon={Wallet}
                        title="Wallet & Credits"
                        subtitle="Manage your balance"
                        href="/client/wallet"
                    />
                    <UserHubRow
                        icon={Sparkles}
                        title="Member Benefits"
                        subtitle={`${tier} Tier • ${loyaltyPoints} pts`}
                        href="/client/membership"
                        highlight
                    />
                    <UserHubRow
                        icon={CreditCard}
                        title="Payments & Payouts"
                        href="/client/payments"
                    />
                </UserHubSection>

                {/* Section 2: Communication */}
                <UserHubSection title="Communication">
                    <UserHubRow
                        icon={MessageSquare}
                        title="Messages"
                        subtitle="Chat with support & hosts"
                        href="/client/messages"
                    />
                    <UserHubRow
                        icon={Bell}
                        title="Notifications"
                        href="/client/settings"
                    />
                </UserHubSection>

                {/* Section 3: App Settings */}
                <UserHubSection title="App Settings">
                    <UserHubRow
                        icon={Globe}
                        title="Language"
                        subtitle="English (US)"
                        href="/client/settings/language"
                    />
                    <UserHubRow
                        icon={Settings}
                        title="General"
                        href="/client/settings"
                    />
                    <UserHubRow
                        icon={HelpCircle}
                        title="Help & Support"
                        href="/client/support"
                    />
                </UserHubSection>

                {/* Section 4: Security */}
                <UserHubSection title="Security">
                    <UserHubRow
                        icon={Lock}
                        title="Change Password"
                        href="/client/security/password"
                    />
                    <UserHubRow
                        icon={Smartphone}
                        title="Two-Factor Auth"
                        href="/client/security/2fa"
                    />
                </UserHubSection>

                {/* Sign Out Button */}
                <div className="mt-8 mb-4 px-2">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full bg-white border border-gray-200 text-red-500 font-semibold py-3.5 rounded-xl shadow-sm active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>

                    <p className="text-center text-xs text-gray-300 mt-6 font-mono">
                        Version 12.0.0 (Build 2024.10)
                    </p>
                </div>
            </div>
        </MobileAppContainer>
    );
}
