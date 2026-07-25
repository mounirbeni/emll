'use client';

import { useSession, signOut } from 'next-auth/react';
import {
    User,
    LogOut,
    CreditCard,
    MessageSquare,
    Lock,
    Smartphone,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    Edit2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { updateProfile } from '../actions';
import { toast } from 'sonner';

interface ProfileClientProps {
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
        phone: string | null;
        createdAt: Date;
        loyaltyPoints: number;
    };
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const { data: session, update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use session data if available (for immediate updates), otherwise fallback to server data
    const displayName = session?.user?.name || user?.name || 'Valued Guest';
    const displayEmail = session?.user?.email || user?.email || '';
    const displayPhone = user?.phone || 'Not set';
    const displayImage = session?.user?.image || user?.image;

    // Format member since date
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '2024';

    async function handleUpdateProfile(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                await update(); // Update session
                setIsEditing(false);
                toast.success('Profile updated successfully');
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 text-center shadow-sm">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                                {displayImage ? (
                                    <Image
                                        src={displayImage}
                                        alt={displayName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                                        {displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h2>
                        <p className="text-sm text-gray-500 mb-6">{displayEmail}</p>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member Since
                                </span>
                                <span className="font-medium text-gray-900">{memberSince}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Account Settings</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <Link href="/client/payments" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Payments</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </Link>
                            <Link href="/client/messages" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Messages</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </Link>
                            <div className="p-4">
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form / Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

                        {isEditing ? (
                            <form action={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                defaultValue={displayName}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                defaultValue={displayPhone !== 'Not set' ? displayPhone : ''}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={displayEmail}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Email address cannot be changed. Contact support for assistance.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary-dark text-white min-w-[120px]"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Full Name</span>
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <User className="w-4 h-4 text-gray-400" />
                                            {displayName}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Phone Number</span>
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {displayPhone}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 md:col-span-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Email Address</span>
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {displayEmail}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Security & Privacy</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Password</h4>
                                        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/client/security/password">Update</Link>
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/client/security/2fa">Enable</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
