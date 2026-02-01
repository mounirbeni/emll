import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Star, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Explore Marrakech like local - connecting travelers with the authentic soul of Marrakech since 2023. Meet our team and discover what makes us different.",
    openGraph: {
        title: "About Us | Explore Marrakech",
        description: "Connecting travelers with the authentic soul of Marrakech since 2023. Learn our story and meet our passionate team.",
        url: "https://marrakech-luxe.vercel.app/about",
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/placeholder-experience.svg"
                        alt="Marrakech Desert"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-white/80" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-gray-900">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Journey</h1>
                    <p className="text-xl md:text-2xl font-medium text-gray-800 max-w-2xl mx-auto">
                        Connecting travelers with the authentic soul of Marrakech since 2023.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                More Than Just a Booking Platform
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Explore Marrakech like local was born from a deep love for the Red City and a desire to share its hidden gems with the world. We realized that many travelers were missing out on the true essence of Marrakech—getting lost in tourist traps instead of finding authentic connections.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We set out to change that by curating a collection of exclusive, high-quality experiences led by passionate local experts. From the bustling souks to the serene Agafay desert, every activity we offer is hand-picked to ensure it meets our high standards of quality, safety, and authenticity.
                            </p>
                        </div>
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="/images/placeholder-experience.svg"
                                alt="Marrakech Architecture"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder's Vision */}
            <section className="py-20 px-4 bg-muted/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                        <Image
                            src="/images/mounir-banni.jpeg"
                            alt="Mounir Banni"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-medium italic text-foreground mb-8 leading-relaxed">
                        &ldquo;My dream is to show the world the Marrakech that I know and love—not just the monuments, but the warmth of its people, the richness of its traditions, and the magic that happens when you step off the beaten path.&rdquo;
                    </blockquote>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-primary"> Mounir Banni </h3>
                        <p className="text-muted-foreground">Founder, Explore Marrakech like local</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-secondary/30 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Explore Marrakech like local?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We don&apos;t just sell tours; we craft memories. Here is what sets us apart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Trusted & Verified",
                                description: "Every guide and host is personally vetted for quality and safety."
                            },
                            {
                                icon: Heart,
                                title: "Authentic Experiences",
                                description: "We focus on genuine cultural immersion, not just sightseeing."
                            },
                            {
                                icon: Star,
                                title: "Premium Quality",
                                description: "Top-rated activities ensuring comfort and excellence."
                            },
                            {
                                icon: Users,
                                title: "Local Support",
                                description: "24/7 support from our local team based right here in Marrakech."
                            }
                        ].map((item, index) => (
                            <Card key={index} className="border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
                                <CardContent className="pt-8 text-center space-y-4">
                                    <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
                                        <item.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-4 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "50+", label: "Unique Experiences" },
                            { number: "10k+", label: "Happy Travelers" },
                            { number: "4.9", label: "Average Rating" },
                            { number: "24/7", label: "Local Support" }
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                                <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* CTA */}
            <section className="py-24 px-4 bg-muted/30">
                <div className="container mx-auto max-w-4xl text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Ready to Explore the Real Marrakech?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of satisfied travelers and book your next adventure with us today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/search">
                            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
                                Browse Experiences
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full w-full sm:w-auto">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
