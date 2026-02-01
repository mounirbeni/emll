'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, Loader2, Compass, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to reset password');

            setIsSuccess(true);
            toast.success('Password reset successfully!');
            setTimeout(() => router.push('/login'), 3000);
        } catch (error) {
            console.error(error);
            const msg = error instanceof Error ? error.message : 'Something went wrong';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Invalid Link</h3>
                <p className="text-red-600 mb-6">
                    This password reset link is invalid or has expired.
                </p>
                <Link href="/forgot-password">
                    <Button className="w-full">
                        Request New Link
                    </Button>
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="bg-green-50 rounded-xl p-6 text-center animate-fade-in border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset</h3>
                <p className="text-gray-600 mb-6">
                    Your password has been successfully updated. You can now log in with your new password.
                </p>
                <Link href="/login">
                    <Button className="w-full btn-primary">
                        Log In Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-11"
                        minLength={8}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 h-11"
                        minLength={8}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <Button
                type="submit"
                className="w-full h-11 text-base btn-primary"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8">
                            <Compass className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                                Explore Marrakesh
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Set New Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Set a new password
                        </p>
                    </div>

                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>

            {/* Right Side - Image/Banner */}
            <div className="hidden lg:block relative bg-[#FFF5F0]">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/marrakech-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-50" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative h-full flex items-center justify-center p-12 text-center">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome Back
                        </h2>
                        <p className="text-lg text-gray-700">
                            Ready to continue your adventure? Sign in with your new password to access your bookings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
