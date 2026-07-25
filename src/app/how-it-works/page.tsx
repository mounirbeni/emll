import { Search, Calendar, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeader } from "@/components/layout/PageShell";

export const metadata: Metadata = {
    title: "How It Works",
    description: "Booking your perfect Marrakech experience is simple. Browse experiences, check availability, get confirmed, and enjoy your adventure with local guides. No online payment required.",
    openGraph: {
        title: "How It Works | Explore Marrakech",
        description: "Learn how to book authentic Marrakech experiences in 4 easy steps. No online payment needed - pay directly to guides in cash.",
        url: "https://marrakech-luxe.vercel.app/how-it-works",
    },
};

const steps = [
    {
        icon: Search,
        title: "Browse Experiences",
        description: "Explore our curated collection of authentic Marrakech experiences. Filter by category, price, or duration to find your perfect adventure.",
    },
    {
        icon: Calendar,
        title: "Check Availability",
        description: "Select your preferred date and number of guests. Click 'Check Availability' and we'll confirm if your chosen experience is available.",
    },
    {
        icon: MessageCircle,
        title: "Get Confirmed",
        description: "We'll contact you within a few hours via WhatsApp or email to confirm all details, answer questions, and finalize your booking.",
    },
    {
        icon: CheckCircle,
        title: "Enjoy Your Experience",
        description: "Meet your local guide at the designated time and location. No online payment needed - pay directly to your guide in cash.",
    },
];

const reasons = [
    { label: "No Online Payment", detail: "Pay directly to guides in cash" },
    { label: "Licensed Guides", detail: "All guides are certified professionals" },
    { label: "Free Cancellation", detail: "Cancel up to 24 hours before" },
    { label: "24/7 Support", detail: "We're always here to help" },
];

const pricing = [
    {
        label: "Transparent Pricing",
        detail: "All prices are listed in Euros (€) per person. The total updates automatically based on your group size.",
    },
    {
        label: "Accepted Currencies",
        detail: "Guides accept EUR, USD, and MAD in cash. We'll confirm the exchange rate when we contact you.",
    },
    {
        label: "What's Included",
        detail: "Check each experience page for detailed information about what's included in the price.",
    },
];

export default function HowItWorksPage() {
    return (
        <>
            <PageHero
                eyebrow="Booking made simple"
                title="How It Works"
                subtitle="Booking your perfect Marrakech experience takes four easy steps — and no online payment."
            />

            <Section tone="surface">
                <SectionHeader
                    align="center"
                    eyebrow="The process"
                    title="From browsing to your first mint tea"
                    subtitle="We keep it human. A real person confirms every booking before you pay a dirham."
                />

                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <li key={step.title} className="surface-card-interactive flex flex-col p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="bg-brand-50 text-brand-600 flex h-12 w-12 items-center justify-center rounded-xl">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <span className="type-eyebrow text-ink-400">
                                        Step {idx + 1}
                                    </span>
                                </div>
                                <h3 className="type-h4 mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </li>
                        );
                    })}
                </ol>
            </Section>

            <Section>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="surface-card p-8">
                        <h3 className="type-h3 mb-6">Why Book With Us?</h3>
                        <ul className="space-y-4">
                            {reasons.map((reason) => (
                                <li key={reason.label} className="flex items-start gap-3">
                                    <CheckCircle className="text-mint-600 mt-0.5 h-5 w-5 shrink-0" />
                                    <span className="text-muted-foreground text-sm leading-relaxed">
                                        <strong className="text-foreground font-semibold">
                                            {reason.label}:
                                        </strong>{" "}
                                        {reason.detail}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="surface-card p-8">
                        <h3 className="type-h3 mb-6">Payment &amp; Pricing</h3>
                        <ul className="space-y-4">
                            {pricing.map((item) => (
                                <li key={item.label} className="text-muted-foreground text-sm leading-relaxed">
                                    <strong className="text-foreground font-semibold">
                                        {item.label}:
                                    </strong>{" "}
                                    {item.detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <Section tone="brand" size="sm">
                <div className="flex flex-col items-center gap-6 text-center">
                    <h2 className="type-h2 max-w-2xl text-white">Ready to Explore Marrakech?</h2>
                    <p className="type-lead max-w-2xl text-white/90">
                        Browse our collection of authentic experiences and start planning your
                        unforgettable journey today.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="text-brand-600 rounded-full bg-white font-bold hover:bg-white/90"
                    >
                        <Link href="/experiences">Explore Experiences</Link>
                    </Button>
                </div>
            </Section>
        </>
    );
}
