import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ContactForm from './contact-form';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with our concierge team to plan your perfect Marrakech experience.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero */}
            <div className="relative bg-gray-50 py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange-300 blur-3xl" />
                    <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-blue-200 blur-3xl" />
                </div>
                <div className="container mx-auto px-4 text-center relative">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-600 mb-4">
                        Get In Touch
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Contact Our <span className="text-orange-500">Concierge Team</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Can&apos;t find the perfect experience? Our local experts are here to help you plan an unforgettable trip to Marrakech.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to reach us</h2>
                            <div className="space-y-5">
                                <ContactInfoItem
                                    icon={Phone}
                                    title="Phone"
                                    value="+212 524 000 000"
                                    href="tel:+212524000000"
                                />
                                <ContactInfoItem
                                    icon={Mail}
                                    title="Email"
                                    value="contact@exploremarrakesh.com"
                                    href="mailto:contact@exploremarrakesh.com"
                                />
                                <ContactInfoItem
                                    icon={MapPin}
                                    title="Location"
                                    value="Marrakech Medina, Morocco"
                                />
                                <ContactInfoItem
                                    icon={Clock}
                                    title="Working Hours"
                                    value="Daily: 8:00 AM – 9:00 PM (GMT+1)"
                                />
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="h-5 w-5 text-orange-600" />
                                <h3 className="font-bold text-gray-900">Need immediate help?</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Browse our FAQ or send us a support request and we&apos;ll respond within a few hours.
                            </p>
                            <div className="space-y-2">
                                <Link href="/faq" className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                                    View FAQ <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="/client/support" className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                                    Open Support Ticket <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                            <p className="text-gray-500 text-sm mb-8">We typically respond within 2–4 hours during working hours.</p>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactInfoItem({
    icon: Icon,
    title,
    value,
    href,
}: {
    icon: React.ElementType;
    title: string;
    value: string;
    href?: string;
}) {
    const content = (
        <div className="flex items-start gap-4 group">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-orange-500" />
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{value}</p>
            </div>
        </div>
    );

    if (href) {
        return <a href={href}>{content}</a>;
    }
    return <div>{content}</div>;
}
