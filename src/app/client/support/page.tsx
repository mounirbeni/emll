"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare, HelpCircle, FileText, ChevronRight } from "lucide-react";

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        // Show success message (would normally use toast)
        alert("Message sent successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Support Center</h1>
                <p className="text-gray-500 text-lg">
                    Have questions? We're here to help you with your Marrakech adventure.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content - FAQ & Contact */}
                <div className="lg:col-span-2 space-y-8">

                    {/* FAQ Section */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-b-gray-100">
                                <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-primary hover:no-underline py-4">
                                    How do I receive my booking confirmation?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Once your booking is confirmed, you will receive an email with all the details. You can also view your tickets anytime in the "My Bookings" section of this dashboard.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b-gray-100">
                                <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-primary hover:no-underline py-4">
                                    What is the cancellation policy?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Most experiences offer a full refund if cancelled at least 24 hours in advance. Please check the specific policy on your booking details page as some special tours may differ.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b-gray-100">
                                <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-primary hover:no-underline py-4">
                                    How do I contact my guide?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Detailed contact information for your guide or meeting point coordinator will be available in your booking confirmation 24 hours before the experience starts.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-b-0">
                                <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-primary hover:no-underline py-4">
                                    Do I need to print my tickets?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    No! We are eco-friendly. Simply show the QR code from your mobile dashboard or email confirmation to your guide.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Name</label>
                                    <Input placeholder="Your name" required className="rounded-xl border-gray-200 focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email</label>
                                    <Input type="email" placeholder="your@email.com" required className="rounded-xl border-gray-200 focus-visible:ring-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Subject</label>
                                <Input placeholder="Brief description of your issue" required className="rounded-xl border-gray-200 focus-visible:ring-primary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Message</label>
                                <Textarea
                                    placeholder="How can we help you?"
                                    className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-primary resize-none"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full md:w-auto bg-primary hover:bg-orange-600 text-white font-bold rounded-xl h-12 px-8"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Contact Cards */}
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                        <h3 className="font-bold text-gray-900 mb-4">Direct Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-primary/10 shadow-sm">
                                <Phone className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <p className="font-bold text-gray-900">Phone Support</p>
                                    <p className="text-sm text-gray-500 mb-1">Mon-Fri, 9am - 6pm</p>
                                    <a href="tel:+212524000000" className="text-primary font-bold hover:underline">
                                        +212 524 000 000
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-primary/10 shadow-sm">
                                <Mail className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <p className="font-bold text-gray-900">Email Us</p>
                                    <p className="text-sm text-gray-500 mb-1">We reply within 24h</p>
                                    <a href="mailto:support@exploremarrakesh.com" className="text-primary font-bold hover:underline">
                                        support@exploremarrakesh.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Useful Resources</h3>
                        <div className="space-y-2">
                            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Terms of Service</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </a>
                            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Privacy Policy</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </a>
                            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Booking Guide</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
