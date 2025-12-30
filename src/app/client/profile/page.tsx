"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Save, Lock } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user");
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            // User API returns direct data, not wrapped
            setProfile(data);
            setFormData({
                name: data.name || "",
                phone: data.phone || "",
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            toast.success("Profile updated successfully");
            await fetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to change password");
            }

            toast.success("Password changed successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setDialogOpen(false);
        } catch (error: any) {
            console.error("Error changing password:", error);
            toast.error(error.message || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#FF5F00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">
                    Manage your account information
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-[#FF5F00] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                {profile?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <h3 className="font-semibold text-gray-900">{profile?.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile?.email || ""}
                                        className="pl-10 bg-gray-50"
                                        disabled
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="pl-10"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">Password</h4>
                            <p className="text-sm text-gray-600">
                                Change your account password
                            </p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Enter your current password and choose a new one
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    currentPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    newPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={changingPassword} className="w-full">
                                        {changingPassword ? "Changing..." : "Change Password"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
