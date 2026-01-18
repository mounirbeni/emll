'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile } from '@/app/client/actions';

interface ProfileClientProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        createdAt: Date;
        loyaltyPoints: number;
    };
}

export function ProfileClient({ user }: ProfileClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('phone', formData.phone);

            const result = await updateProfile(formDataObj);

            if (result.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                router.refresh(); // Immediate UI refresh
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-1">
                    Manage your account information
                </p>
            </div>

            {/* Profile Info Card */}
            <Card className="border-none shadow-sm bg-white rounded-3xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-10 rounded-xl bg-gray-50"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="pl-10 rounded-xl"
                                    placeholder="+212 XXX XXX XXX"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full rounded-xl bg-[#FF5F00] hover:bg-[#E55500]"
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="w-full rounded-xl"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-xl bg-[#FF5F00] hover:bg-[#E55500]"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Member Since</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                                <Award className="w-6 h-6 text-[#FF5F00]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Loyalty Points</p>
                                <p className="font-semibold text-gray-900">{user.loyaltyPoints} Points</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
