"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Mail, Calendar, LogOut } from "lucide-react";
import { toast } from "sonner";

interface UserData {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success("Logged out successfully");
            router.push('/');
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF5F00]" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pt-28 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your personal details and account status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-2 border-[#FF5F00]">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} />
                                    <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">{user.name || "User"}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()} Account</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-[#FF5F00]" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-[#FF5F00]" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{user.name || "Not set"}</p>
                                    </div>
                                </div>

                                {user.createdAt && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-[#FF5F00]" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Member Since</p>
                                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage your account and bookings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/search')}
                            >
                                Browse Experiences
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
