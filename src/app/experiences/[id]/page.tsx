import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

// Components
import ExperienceHero from '@/components/experiences/details/ExperienceHero';
import ExperienceGallery from '@/components/experiences/details/ExperienceGallery';
import ExperienceHighlights from '@/components/experiences/details/ExperienceHighlights';
import ExperienceItinerary from '@/components/experiences/details/ExperienceItinerary';
import ExperienceInclusions from '@/components/experiences/details/ExperienceInclusions';
import ExperienceMeetingPoint from '@/components/experiences/details/ExperienceMeetingPoint';
import RelatedExperiences from '@/components/experiences/details/RelatedExperiences';
import ReviewsList from '@/components/experiences/reviews/ReviewsList';

import BookingSidebar from '@/components/experiences/BookingSidebar';
import MobileBookingBar from '@/components/experiences/MobileBookingBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Next.js 15 params usage
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const exp = await prisma.experience.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        select: { title: true, shortDescription: true }
    });

    return {
        title: exp?.title || 'Experience Details - Marrakech',
        description: exp?.shortDescription || 'Book this amazing experience in Marrakech.',
    };
}

export default async function ExperienceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const experience = await prisma.experience.findFirst({
        where: {
            OR: [
                { id: id },
                { slug: id }
            ]
        }
    });

    if (!experience) {
        notFound();
    }

    // Parse Data
    const faqs = (Array.isArray(experience.faqs) ? experience.faqs : []) as { q: string; a: string }[];
    const languages = Array.isArray((experience as any).languages) ? (experience as any).languages as string[] : ['English', 'French'];

    // Parse itinerary if it exists in DB, otherwise empty (or we could try to infer/mock if structure changed)
    const itinerary = (Array.isArray(experience.itinerary) ? experience.itinerary : []) as any[];

    return (
        <div className="min-h-screen bg-white pb-32 pt-20">

            {/* 1. Hero Section */}
            <ExperienceHero
                title={experience.title}
                category={experience.category}
                location={experience.location}
                duration={experience.duration}
                rating={(experience as any).avgRating || 0}
                reviews={(experience as any).reviewCount || 0}
                pickupAvailable={experience.pickupAvailable}
                languages={languages}
                images={experience.gallery}
            />

            {/* 2. Gallery Section (Desktop) */}
            <div className="mt-8">
                <ExperienceGallery images={experience.gallery} title={experience.title} />
            </div>

            <div className="container mx-auto mt-12 px-4">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2">

                        {/* 3. Description (Storytelling) */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">About this activity</h2>
                            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:font-bold prose-p:leading-relaxed prose-li:marker:text-orange-500">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {experience.fullDescription}
                                </p>
                            </div>
                        </section>

                        {/* 4. Highlights */}
                        <ExperienceHighlights highlights={experience.highlights} />

                        <Accordion type="single" collapsible className="w-full mb-10" defaultValue="itinerary">
                            {/* 5. Inclusions */}
                            <AccordionItem value="inclusions" className="border-gray-200">
                                <AccordionTrigger className="text-xl font-bold text-gray-900 pb-4">What&apos;s Included</AccordionTrigger>
                                <AccordionContent>
                                    <ExperienceInclusions
                                        included={experience.included}
                                        notIncluded={experience.notIncluded}
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            {/* 6. Itinerary */}
                            {itinerary.length > 0 && (
                                <AccordionItem value="itinerary" className="border-gray-200">
                                    <AccordionTrigger className="text-xl font-bold text-gray-900 pb-4">Itinerary</AccordionTrigger>
                                    <AccordionContent>
                                        <ExperienceItinerary itinerary={itinerary} />
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* 7. Meeting Point */}
                            <AccordionItem value="meeting-point" className="border-gray-200">
                                <AccordionTrigger className="text-xl font-bold text-gray-900 pb-4">Meeting Point</AccordionTrigger>
                                <AccordionContent>
                                    <ExperienceMeetingPoint
                                        address={experience.meetingPoint}
                                        pickupAvailable={experience.pickupAvailable}
                                        description={(experience as any).meetingPointDescription || undefined}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* 8. FAQs */}
                        {faqs.length > 0 && (
                            <section className="mb-12 border-t border-gray-100 pt-10">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, idx) => (
                                        <AccordionItem key={idx} value={`item-${idx}`} className='border-gray-200'>
                                            <AccordionTrigger className="text-left text-lg font-bold text-gray-900 hover:text-orange-600 hover:no-underline">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-base text-gray-600 leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* 9. Reviews Section */}
                        <ReviewsList experienceId={experience.id} />

                        {/* 10. Related Experiences */}
                        <RelatedExperiences currentId={experience.id} category={experience.category} />

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="relative hidden lg:block lg:col-span-1">
                        <BookingSidebar
                            experienceId={experience.id}
                            experienceTitle={experience.title}
                            price={experience.price}
                            currency={experience.currency}
                            pickupAvailable={experience.pickupAvailable}
                        />
                    </div>

                </div>
            </div>

            {/* Mobile Booking Bar */}
            <MobileBookingBar
                experienceId={experience.id}
                experienceTitle={experience.title}
                price={experience.price}
                currency={experience.currency}
            />
        </div>
    );
}
