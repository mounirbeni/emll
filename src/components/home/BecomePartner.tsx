"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BecomePartner() {
    return (
        <section className="app-section bg-primary/5">
            <div className="app-container text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                    Join Our Network
                </span>
                <h2 className="type-h2 text-foreground mb-6">
                    Are you a local guide or tour operator?
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                    Partner with Explore Marrakech to reach thousands of travelers.
                    Manage your bookings, grow your business, and share your passion for the Red City.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/become-supplier">
                        <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-bold rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary text-white hover:bg-primary/90">
                            Become a Partner
                        </Button>
                    </Link>
                    <Link href="/support">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-bold rounded-full border-2 border-gray-200 bg-transparent hover:bg-white hover:border-gray-300 text-gray-700">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
