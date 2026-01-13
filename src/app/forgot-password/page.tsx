"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            toast.success("If an account exists for that email, we sent a reset link.");
            setEmail("");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
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
                            <Compass className="w-8 h-8 text-[#FF5F00]" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5F00] to-[#E55500]">
                                Explore Marrakesh
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Reset your password
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email and we will send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="pl-9 h-11"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-[#FF5F00] hover:bg-[#E55500] font-bold text-lg shadow-lg shadow-orange-500/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending link...
                                </>
                            ) : (
                                <>
                                    Send reset link <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Remembered your password?{" "}
                        <Link href="/login" className="font-medium text-[#FF5F00] hover:text-[#E55500]">
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#FF5F00] to-[#E55500] p-12">
                <div className="max-w-md text-white space-y-4">
                    <h2 className="text-3xl font-bold">Need a fresh start?</h2>
                    <p className="text-white/90">
                        We will help you get back to planning unforgettable experiences in Marrakech.
                    </p>
                </div>
            </div>
        </div>
    );
}
