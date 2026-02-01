'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, Compass, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error('Failed to submit request');

            setIsSubmitted(true);
            toast.success('Reset link sent!');
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
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
                            Reset Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Reset your password
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="bg-green-50 rounded-xl p-6 text-center animate-fade-in border border-green-100">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Use a different email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                            Back to log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:block relative flex-1 bg-gray-50">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/marrakech-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-50" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative h-full flex items-center justify-center p-12 text-center">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Secure & Simple
                        </h2>
                        <p className="text-lg text-gray-700">
                            Recover access to your account and continue your journey through the wonders of Marrakesh.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
