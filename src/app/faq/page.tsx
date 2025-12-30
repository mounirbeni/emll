"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background pt-28 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about booking and experiencing Marrakech.
                    </p>
                </div>

                <div className="space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
                            Booking & Payment
                        </h2>

                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-1" className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50">
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    How do I book an experience?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Simply browse our experiences, select the one you like, choose your date and number of guests, then click Check Availability. We&apos;ll contact you to confirm your booking.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50">
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    Do I need to pay online?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    No payment is required online. You can pay in cash when you meet your guide, or arrange payment via WhatsApp with our team.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50">
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    What payment methods do you accept?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    We accept cash in EUR, USD, and MAD. Payment details will be confirmed when we contact you.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
                            Experience Details
                        </h2>

                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-4" className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50">
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    Are hotel pickups included?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Most experiences include hotel pickup from the Medina or Gueliz areas. Specific pickup details are listed in each experience description.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50">
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    What languages do guides speak?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Our guides speak English, French, and Arabic. Some also speak Spanish, Italian, and German.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                <div className="mt-16 text-center bg-secondary rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-muted-foreground mb-6">
                        Our team is here to help! Contact us anytime.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/contact" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors inline-block">
                            Contact Us
                        </a>
                        <button
                            onClick={() => window.open('https://wa.me/212601439975', '_blank')}
                            className="px-6 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            WhatsApp Us
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
