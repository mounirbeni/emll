"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/layout/PageShell";

const faqGroups = [
    {
        heading: "Booking & Payment",
        items: [
            {
                q: "How do I book an experience?",
                a: "Simply browse our experiences, select the one you like, choose your date and number of guests, then click Check Availability. We'll contact you to confirm your booking.",
            },
            {
                q: "Do I need to pay online?",
                a: "No payment is required online. You can pay in cash when you meet your guide, or arrange payment via WhatsApp with our team.",
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept cash in EUR, USD, and MAD. Payment details will be confirmed when we contact you.",
            },
            {
                q: "Can I cancel or change my booking?",
                a: "Yes. You can cancel free of charge up to 24 hours before your experience starts. To change a date, message us and we'll rebook you subject to availability.",
            },
        ],
    },
    {
        heading: "Experience Details",
        items: [
            {
                q: "Are hotel pickups included?",
                a: "Most experiences include hotel pickup from the Medina or Gueliz areas. Specific pickup details are listed in each experience description.",
            },
            {
                q: "What languages do guides speak?",
                a: "Our guides speak English, French, and Arabic. Some also speak Spanish, Italian, and German.",
            },
            {
                q: "What should I wear or bring?",
                a: "Comfortable walking shoes and modest clothing work best across the Medina and religious sites. For desert and mountain trips, bring sunscreen, a hat, and a light layer for the evening.",
            },
        ],
    },
    {
        heading: "Groups & Accessibility",
        items: [
            {
                q: "Do you host private or family groups?",
                a: "Yes. Almost every experience can be booked privately for your group. Message us with your dates and group size and we'll arrange it.",
            },
            {
                q: "Are experiences suitable for children?",
                a: "Many are. Each experience page lists a recommended minimum age, and our team is happy to suggest the most family-friendly options.",
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <>
            <PageHero
                eyebrow="Help centre"
                title="Frequently Asked Questions"
                subtitle="Answers to the questions we get most about booking and experiencing Marrakech."
            />

            <Section width="narrow">
                <div className="space-y-12">
                    {faqGroups.map((group) => (
                        <div key={group.heading}>
                            <h2 className="type-h3 border-border mb-6 border-b pb-3">
                                {group.heading}
                            </h2>

                            <Accordion type="single" collapsible className="space-y-3">
                                {group.items.map((item) => (
                                    <AccordionItem
                                        key={item.q}
                                        value={item.q}
                                        className="border-border data-[state=open]:border-brand-300 data-[state=open]:bg-brand-50/40 rounded-xl border px-5 transition-colors"
                                    >
                                        <AccordionTrigger className="hover:text-primary text-left font-semibold">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            </Section>

            <Section tone="surface" size="sm" width="narrow">
                <div className="surface-card flex flex-col items-center gap-5 p-8 text-center md:p-10">
                    <h3 className="type-h3">Still have questions?</h3>
                    <p className="text-muted-foreground max-w-md">
                        Our team is here to help — usually replying within a couple of hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/support">Contact Us</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full"
                        >
                            <a
                                href="https://wa.me/212601439975"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Us
                            </a>
                        </Button>
                    </div>
                </div>
            </Section>
        </>
    );
}
