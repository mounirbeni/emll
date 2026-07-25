import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, Globe2, LineChart, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeader } from "@/components/layout/PageShell";

export const metadata: Metadata = {
    title: "Become a Supplier",
    description: "Partner with Explore Marrakech to showcase your experiences, tours, riads and activities to travelers around the world.",
    openGraph: {
        title: "Become a Supplier | Explore Marrakech",
        description: "Partner with us to showcase your unique Marrakech experiences to travelers around the world.",
        url: "https://marrakech-luxe.vercel.app/become-supplier",
    },
};

const benefits = [
    {
        icon: Globe2,
        title: "Reach global travelers",
        description: "Get in front of visitors planning their Marrakech trip long before they land.",
    },
    {
        icon: Wallet,
        title: "No upfront cost",
        description: "You only pay a commission on confirmed bookings. Listing your experience is free.",
    },
    {
        icon: BadgeCheck,
        title: "Verified partner status",
        description: "Vetted partners get a trust badge that measurably improves booking rates.",
    },
    {
        icon: LineChart,
        title: "Booking management",
        description: "Track requests, availability and payouts from one simple dashboard.",
    },
];

export default function BecomeSupplierPage() {
    return (
        <>
            <PageHero
                eyebrow="Partner with us"
                title="Become a Supplier"
                subtitle="Showcase your experiences, riads and activities to travelers around the world — and let us handle the bookings."
            />

            <Section>
                <SectionHeader
                    align="center"
                    eyebrow="Why partner"
                    title="Built for local hosts and guides"
                    subtitle="We work with the people who actually run the experiences, not middlemen."
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="surface-card-interactive p-6">
                            <div className="bg-brand-50 text-brand-600 mb-5 inline-flex rounded-xl p-3">
                                <benefit.icon className="h-6 w-6" />
                            </div>
                            <h3 className="type-h4 mb-2">{benefit.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section tone="surface" width="narrow">
                <div className="surface-card flex flex-col items-center gap-5 p-8 text-center md:p-12">
                    <span className="eyebrow">Applications</span>
                    <h2 className="type-h2">Self-serve registration is coming soon</h2>
                    <p className="text-muted-foreground max-w-xl">
                        In the meantime, get in touch and our partnerships team will walk you through
                        onboarding and get your first experience listed.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/support">Contact our team</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </Section>
        </>
    );
}
