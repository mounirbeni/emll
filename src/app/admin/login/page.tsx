'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid credentials. Please try again.');
            } else {
                // Wait a moment for session to update
                await new Promise(resolve => setTimeout(resolve, 100));
                router.refresh();

                // Verify admin role before redirecting
                const sessionRes = await fetch('/api/auth/me');
                const sessionData = await sessionRes.json();

                if (sessionData?.user?.role === 'ADMIN') {
                    toast.success('Welcome back, Admin!');
                    router.push(callbackUrl.startsWith('/admin') ? callbackUrl : '/admin/dashboard');
                } else {
                    toast.error('Access denied. Admin privileges required.');
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -ml-32 -mb-32" />
            </div>

            <Card className="w-full max-w-md relative z-10 border-none shadow-2xl bg-white">
                <CardHeader className="text-center pb-8 pt-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FF5F00] to-[#E55500] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform rotate-3">
                            <Compass className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                        Admin Portal
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-medium">
                        Explore Marrakesh Management
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="infoexploremarrakesh@gmail.com"
                                className="h-11 bg-white/50 focus:bg-white transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-white/50 focus:bg-white transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-accent text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Secure Login
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="absolute bottom-6 text-center text-xs text-gray-400 font-medium">
                &copy; 2024 Explore Marrakesh. Secure Admin Access.
            </div>
        </div>
    );
}
