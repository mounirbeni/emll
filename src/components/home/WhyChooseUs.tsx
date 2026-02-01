"use client";

import { ShieldCheck, UserCheck, CalendarCheck, CheckCircle2 } from "lucide-react";

const features = [
    {
        icon: <CalendarCheck className="w-8 h-8 text-primary" />,
        title: "Free Cancellation",
        description: "Plans change. Cancel up to 24h before for a full refund."
    },
    {
        icon: <UserCheck className="w-8 h-8 text-primary" />,
        title: "Trusted Local Guides",
        description: "Verified experts who know Marrakech inside and out."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Secure Booking",
        description: "Your payment information is always safe with us."
    },
    {
        icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
        title: "Best Price Guarantee",
        description: "We match any lower price you find online."
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Book With Us</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        We are committed to providing the best travel experience in Marrakech.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
