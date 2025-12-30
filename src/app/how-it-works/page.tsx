import { Search, Calendar, MessageCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";

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
        description: "Explore our curated collection of 30+ authentic Marrakech experiences. Filter by category, price, or duration to find your perfect adventure.",
        color: "bg-blue-500"
    },
    {
        icon: Calendar,
        title: "Check Availability",
        description: "Select your preferred date and number of guests. Click 'Check Availability' and we'll confirm if your chosen experience is available.",
        color: "bg-green-500"
    },
    {
        icon: MessageCircle,
        title: "Get Confirmed",
        description: "We'll contact you within a few hours via WhatsApp or email to confirm all details, answer questions, and finalize your booking.",
        color: "bg-purple-500"
    },
    {
        icon: CheckCircle,
        title: "Enjoy Your Experience",
        description: "Meet your local guide at the designated time and location. No online payment needed - pay directly to your guide in cash.",
        color: "bg-orange-500"
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background pt-28 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        How It Works
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Booking your perfect Marrakech experience is simple. Follow these 4 easy steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <Card key={idx} className="border-border hover:border-primary/50 transition-all hover:shadow-lg group">
                                <CardContent className="p-6 text-center">
                                    <div className="relative mb-6">
                                        <div className={`h-20 w-20 rounded-full ${step.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card className="border-border bg-secondary/50">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-4">Why Book With Us?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                        <strong className="text-foreground">No Online Payment:</strong> Pay directly to guides in cash
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                        <strong className="text-foreground">Licensed Guides:</strong> All guides are certified professionals
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                        <strong className="text-foreground">Free Cancellation:</strong> Cancel up to 24 hours before
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                        <strong className="text-foreground">24/7 Support:</strong> We&apos;re always here to help
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-secondary/50">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-4">Payment & Pricing</h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    <strong className="text-foreground">Transparent Pricing:</strong> All prices are listed in Euros (€) for 2 people. The total updates automatically based on your group size.
                                </p>
                                <p>
                                    <strong className="text-foreground">Accepted Currencies:</strong> Guides accept EUR, USD, and MAD in cash. We&apos;ll confirm the exchange rate when we contact you.
                                </p>
                                <p>
                                    <strong className="text-foreground">What&apos;s Included:</strong> Check each experience page for detailed information about what&apos;s included in the price.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Explore Marrakech?</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Browse our collection of authentic experiences and start planning your unforgettable journey today.
                    </p>
                    <Link href="/search">
                        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                            Explore Experiences
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
