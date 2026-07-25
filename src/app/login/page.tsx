'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/client';
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        // Basic validation
        if (!email || !password) {
            setErrorMessage('Email and password are required');
            setIsLoading(false);
            return;
        }

        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                // Parse error message to provide better feedback
                if (result.error === 'CredentialsSignin') {
                    setErrorMessage('Invalid email or password');
                } else if (result.error === 'Email and password are required') {
                    setErrorMessage('Email and password are required');
                } else if (result.error === 'Invalid email or password') {
                    setErrorMessage('Invalid email or password');
                } else {
                    setErrorMessage(result.error || 'Sign in failed. Please try again.');
                }
                toast.error(result.error || 'Sign in failed');
                return;
            }

            if (!result?.ok) {
                setErrorMessage('Sign in failed. Please try again.');
                toast.error('Sign in failed');
                return;
            }

            toast.success('Welcome back!');

            // Use router.refresh() to update session, then redirect
            router.refresh();

            // Wait a moment for session to update
            await new Promise(resolve => setTimeout(resolve, 300));

            // Fetch session to check role and determine redirect
            try {
                const sessionRes = await fetch('/api/auth/me', { cache: 'no-store' });
                const sessionData = await sessionRes.json();

                if (!sessionData?.authenticated) {
                    // Session might still be updating, try redirect anyway
                    // Middleware will handle redirect if needed
                    let finalUrl = '/client';
                    if (callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
                        finalUrl = callbackUrl;
                    }
                    window.location.href = finalUrl;
                    return;
                }

                // Redirect based on role
                if (sessionData?.user?.role === 'ADMIN') {
                    window.location.href = '/admin/dashboard';
                } else {
                    // Validate callback URL to prevent open redirects
                    let finalUrl = '/client';
                    if (callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
                        finalUrl = callbackUrl;
                    }
                    window.location.href = finalUrl;
                }
            } catch {
                // Fallback: redirect to client dashboard
                window.location.href = '/client';
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

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
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="infoexploremarrakesh@gmail.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 h-11"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:text-brand-700 -my-2 inline-flex min-h-11 items-center text-sm font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-9 h-11"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="text-muted-foreground hover:text-foreground absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* The label carries the touch area so the whole row is
                            tappable, not just the 18px checkbox. */}
                        <label
                            htmlFor="remember"
                            className="-ml-1 inline-flex min-h-11 cursor-pointer items-center gap-2 px-1 text-sm font-medium"
                        >
                            <Checkbox id="remember" />
                            Remember me
                        </label>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-primary hover:bg-brand-600 font-bold text-lg shadow-brand"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        disabled={isLoading}
                        className="w-full h-11"
                        onClick={() => signIn('google', { callbackUrl })}
                        type="button"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-primary hover:text-brand-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Banner */}
            <div className="hidden lg:block relative bg-gray-50">
                <div className="absolute inset-0">
                    {/* We could use an actual image here, but a gradient placeholder works for now if no image is available 
                       If there's an image in public, we could use it. */}
                    <div className="absolute inset-0 bg-[url('/images/homepage.jpg')] bg-cover bg-center mix-blend-overlay opacity-50" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative h-full flex items-center justify-center p-12 text-center">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Experience the Magic of Marrakech
                        </h2>
                        <p className="text-lg text-gray-700">
                            &quot;The sheer variety of experiences available made our trip unforgettable. Highly recommended!&quot;
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i} className="w-6 h-6 text-primary fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="font-semibold text-gray-900">- Sarah Jenkins, UK</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
