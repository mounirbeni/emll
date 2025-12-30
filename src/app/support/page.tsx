"use client";

import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Failed to send message');

            toast.success('Message sent successfully! We will get back to you soon.');
            form.reset();
        } catch (error: unknown) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-12 sm:pb-20">
            {/* Header Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mb-12">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Support Center
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        We&apos;re here to help you with any questions or issues you may have.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

                    {/* Left Column: Contact Info & FAQ */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Contact Cards */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="h-6 w-6 text-primary" />
                                Get in Touch
                            </h2>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Phone Support</h3>
                                        <p className="text-muted-foreground text-sm mt-1">+212 601 439 975</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Available 24/7</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Email Support</h3>
                                        <p className="text-muted-foreground text-sm mt-1">infoexploremarrakesh@gmail.com</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Response within 24h</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Office Location</h3>
                                        <p className="text-muted-foreground text-sm mt-1">Marrakech Medina, Morocco</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-8 border-t border-border">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <HelpCircle className="h-6 w-6 text-primary" />
                                Common Questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I cancel a booking?</AccordionTrigger>
                                    <AccordionContent>
                                        You can cancel your booking up to 24 hours before the scheduled time for a full refund. Please contact us via email or phone with your booking ID.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is payment secure?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, we use industry-standard encryption for all transactions. You can also choose to pay in cash directly to the guide for many experiences.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Do you offer private tours?</AccordionTrigger>
                                    <AccordionContent>
                                        Absolutely! Most of our experiences can be booked as private tours. Look for the &quot;Private&quot; tag or contact us for a custom arrangement.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-border shadow-lg h-full">
                            <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-primary" />
                                    Send us a Message
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Fill out the form below and our support team will get back to you as soon as possible.
                                </p>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" name="name" placeholder="John Doe" required className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                                        <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" className="h-12" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" name="subject" placeholder="How can we help you?" required className="h-12" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            className="w-full min-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Please describe your issue or question in detail..."
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto gap-2 rounded-full py-6 px-8 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
