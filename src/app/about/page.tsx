import Image from "next/image";
import Link from "next/link";
import { Heart, Shield, Star, Users } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeader } from "@/components/layout/PageShell";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Explore Marrakech like local - connecting travelers with the authentic soul of Marrakech since 2023. Meet our team and discover what makes us different.",
    openGraph: {
        title: "About Us | Explore Marrakech",
        description: "Connecting travelers with the authentic soul of Marrakech since 2023. Learn our story and meet our passionate team.",
        url: "https://marrakech-luxe.vercel.app/about",
    },
};

const values = [
    {
        icon: Shield,
        title: "Trusted & Verified",
        description: "Every guide and host is personally vetted for quality and safety.",
    },
    {
        icon: Heart,
        title: "Authentic Experiences",
        description: "We focus on genuine cultural immersion, not just sightseeing.",
    },
    {
        icon: Star,
        title: "Premium Quality",
        description: "Top-rated activities ensuring comfort and excellence.",
    },
    {
        icon: Users,
        title: "Local Support",
        description: "24/7 support from our local team based right here in Marrakech.",
    },
];

const stats = [
    { number: "50+", label: "Unique Experiences" },
    { number: "10k+", label: "Happy Travelers" },
    { number: "4.9", label: "Average Rating" },
    { number: "24/7", label: "Local Support" },
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                eyebrow="Our story"
                title="More Than Just a Booking Platform"
                subtitle="Connecting travelers with the authentic soul of Marrakech since 2023."
            />

            <Section>
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div className="space-y-5">
                        <SectionHeader
                            eyebrow="How we started"
                            title="Born from a love of the Red City"
                            className="mb-0"
                        />
                        <p className="text-muted-foreground leading-relaxed">
                            Explore Marrakech like local was born from a deep love for the Red City
                            and a desire to share its hidden gems with the world. We realized that
                            many travelers were missing out on the true essence of Marrakech—getting
                            lost in tourist traps instead of finding authentic connections.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We set out to change that by curating a collection of exclusive,
                            high-quality experiences led by passionate local experts. From the
                            bustling souks to the serene Agafay desert, every activity we offer is
                            hand-picked to ensure it meets our high standards of quality, safety,
                            and authenticity.
                        </p>
                    </div>

                    <div className="relative h-[380px] overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src="/images/homepage.jpg"
                            alt="Marrakech architecture"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </Section>

            {/* Founder */}
            <Section tone="surface" width="narrow">
                <div className="flex flex-col items-center text-center">
                    <div className="border-brand-500 relative mb-8 h-28 w-28 overflow-hidden rounded-full border-4 shadow-lg">
                        <Image
                            src="/images/mounir-banni.jpeg"
                            alt="Mounir Banni"
                            fill
                            className="object-cover"
                            sizes="112px"
                        />
                    </div>
                    <blockquote className="font-display text-foreground mb-8 text-2xl font-medium italic leading-relaxed md:text-3xl">
                        &ldquo;My dream is to show the world the Marrakech that I know and love—not
                        just the monuments, but the warmth of its people, the richness of its
                        traditions, and the magic that happens when you step off the beaten
                        path.&rdquo;
                    </blockquote>
                    <div className="space-y-1">
                        <h3 className="type-h4 text-brand-600">Mounir Banni</h3>
                        <p className="text-muted-foreground text-sm">
                            Founder, Explore Marrakech like local
                        </p>
                    </div>
                </div>
            </Section>

            {/* Values */}
            <Section>
                <SectionHeader
                    align="center"
                    eyebrow="What sets us apart"
                    title="Why Choose Explore Marrakech like local?"
                    subtitle="We don't just sell tours; we craft memories. Here is what sets us apart."
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((item) => (
                        <div key={item.title} className="surface-card-interactive p-6 text-center">
                            <div className="bg-brand-50 text-brand-600 mb-5 inline-flex rounded-xl p-3">
                                <item.icon className="h-7 w-7" />
                            </div>
                            <h3 className="type-h4 mb-2">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Stats */}
            <Section tone="brand" size="sm">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="space-y-2">
                            <div className="type-h1 text-white">{stat.number}</div>
                            <div className="text-sm font-medium text-white/80">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section tone="surface">
                <div className="flex flex-col items-center gap-6 text-center">
                    <h2 className="type-h2 max-w-2xl">Ready to Explore the Real Marrakech?</h2>
                    <p className="type-lead text-muted-foreground max-w-2xl">
                        Join thousands of satisfied travelers and book your next adventure with us
                        today.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/experiences">Browse Experiences</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="rounded-full">
                            <Link href="/support">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </Section>
        </>
    );
}
