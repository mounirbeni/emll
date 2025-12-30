"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
    return (
        <footer className="bg-secondary pt-8 sm:pt-16 pb-6 sm:pb-8">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">

                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-2xl font-bold text-primary tracking-tight">
                            Explore Marrakech like local
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Discover authentic Marrakech experiences with trusted local guides.
                        </p>
                        <div className="pt-2">
                            <h4 className="font-semibold text-sm mb-3">Newsletter</h4>
                            <form className="flex flex-col sm:flex-row gap-2" onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                                const email = emailInput.value;

                                const promise = fetch('/api/newsletter', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email }),
                                }).then(async (response) => {
                                    const data = await response.json();
                                    if (!response.ok) throw new Error(data.error || 'Failed to subscribe');
                                    return data;
                                });

                                toast.promise(promise, {
                                    loading: 'Subscribing...',
                                    success: 'Thank you for subscribing!',
                                    error: (err) => err.message,
                                });

                                form.reset();
                            }}>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
                                    className="text-sm h-10 sm:h-9"
                                    required
                                />
                                <Button type="submit" size="sm" className="shrink-0 h-10 sm:h-9">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-foreground">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/search" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    All Things to do
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-foreground">Categories</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/search?category=Adventures" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    Adventures
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?category=City+Tours" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    City Tours
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?category=Food+%26+Drink" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    Food & Drink
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?category=Wellness" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    Wellness
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?category=Excursions" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                    Excursions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-foreground">Contact</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">+212 601 439 975</p>
                                    <p className="text-xs text-muted-foreground">24/7 Support</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">infoexploremarrakesh@gmail.com</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">Marrakech Medina<br />Morocco, 40000</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <h5 className="font-semibold text-sm mb-3">Follow Us</h5>
                            <div className="flex gap-3">
                                <Link href="https://www.instagram.com/emll.ma" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                                <Link href="https://www.facebook.com/share/1C3vJtvcui/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="https://x.com/emwma24?s=09" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="https://www.tiktok.com/@emll.ma" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-6 sm:pt-8 mt-6 sm:mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Explore Marrakech like local. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
