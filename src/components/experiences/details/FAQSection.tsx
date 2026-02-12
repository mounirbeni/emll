'use client';

import { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
    q: string;
    a: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');

    if (!faqs || faqs.length === 0) {
        return null;
    }

    // Filter FAQs based on search term
    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="mb-12 border-t border-gray-100 pt-10">
            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-7 h-7 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>

            {/* Search Bar */}
            {faqs.length > 3 && (
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    />
                </div>
            )}

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="w-full space-y-3">
                {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="border border-gray-200 rounded-xl px-6 hover:border-orange-300 hover:shadow-md transition-all data-[state=open]:border-orange-500 data-[state=open]:shadow-lg"
                    >
                        <AccordionTrigger className="text-left text-base font-bold text-gray-900 hover:text-orange-600 hover:no-underline py-4">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* No results message */}
            {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No questions match your search.</p>
                </div>
            )}

            {/* Still have questions CTA */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-4">
                    We're here to help! Contact us and we'll get back to you as soon as possible.
                </p>
                <a
                    href="/support"
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                >
                    Contact Support
                </a>
            </div>
        </section>
    );
}
