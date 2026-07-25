import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

// Components
import ExperienceHero from '@/components/experiences/details/ExperienceHero';
import ExperienceGallery from '@/components/experiences/details/ExperienceGallery';
import ExperienceHighlights from '@/components/experiences/details/ExperienceHighlights';
import ExperienceTimeline from '@/components/experiences/details/ExperienceTimeline';
import ExperienceInclusions from '@/components/experiences/details/ExperienceInclusions';
import ExperienceMeetingPoint from '@/components/experiences/details/ExperienceMeetingPoint';
import HostCard from '@/components/experiences/details/HostCard';
import ExperienceRequirements from '@/components/experiences/details/ExperienceRequirements';
import FAQSection from '@/components/experiences/details/FAQSection';
import CancellationPolicy from '@/components/experiences/details/CancellationPolicy';
import LanguagesAndSeasons from '@/components/experiences/details/LanguagesAndSeasons';
import RelatedExperiences from '@/components/experiences/details/RelatedExperiences';

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
    const expWithLanguages = experience as unknown as { languages?: string[] };
    const languages = Array.isArray(expWithLanguages.languages)
        ? expWithLanguages.languages
        : ['English', 'French', 'Arabic'];
    const itinerary = (Array.isArray(experience.itinerary) ? experience.itinerary : []) as Array<{
        time: string;
        title: string;
        description: string;
        location?: string;
        icon?: string;
    }>;

    // Mock data for new features (can be replaced with actual DB fields)
    const hostInfo = {
        name: "Ahmed El Fassi",
        image: "/images/host-avatar.svg",
        bio: "Passionate local guide with deep knowledge of Marrakech's history and culture. I love sharing the authentic side of my city with travelers from around the world.",
        verified: true,
        yearsExperience: 8,
        languages: languages,
        responseTime: "1 hour"
    };

    const requirements = {
        whatToBring: [
            "Comfortable walking shoes",
            "Sun protection (hat, sunscreen)",
            "Camera",
            "Water bottle",
            "Light jacket for evening"
        ],
        physicalRequirements: "Moderate fitness level required. This experience involves walking for extended periods.",
        minAge: 12,
        accessibility: [
            "Not wheelchair accessible",
            "Not suitable for people with mobility issues",
            "Service animals allowed"
        ],
        healthNotes: [
            "Not recommended for pregnant travelers",
            "Not recommended for people with heart conditions"
        ],
        dressCode: "Modest clothing recommended when visiting religious sites"
    };

    // No pt-* here — PublicLayout offsets the fixed header, and the Footer
    // carries the bottom clearance for the nav and the docked booking bar.
    return (
        <div className="min-h-screen bg-background">

            {/* 1. Hero Section */}
            <ExperienceHero
                experienceId={experience.id}
                title={experience.title}
                category={experience.category}
                location={experience.location}
                duration={experience.duration}
                rating={experience.avgRating ?? 0}
                reviews={experience.reviewCount ?? 0}
                pickupAvailable={experience.pickupAvailable}
                languages={languages}
                images={experience.gallery}
            />

            {/* 2. Gallery Section */}
            <div className="mt-8">
                <ExperienceGallery images={experience.gallery} title={experience.title} />
            </div>

            <div className="container mx-auto mt-12 px-4 max-w-[1400px]">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2 space-y-0">

                        {/* 3. Description */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">About this experience</h2>
                            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:font-bold prose-p:leading-relaxed prose-li:marker:text-orange-500">
                                <p className="whitespace-pre-line leading-relaxed text-gray-700">
                                    {experience.fullDescription}
                                </p>
                            </div>
                        </section>

                        {/* 4. Highlights */}
                        <ExperienceHighlights highlights={experience.highlights} />

                        {/* 5. Languages & Seasonal Info */}
                        <LanguagesAndSeasons
                            languages={languages}
                            seasonalNotes="Best enjoyed during spring and autumn when temperatures are mild"
                            bestTimeToVisit="March to May, September to November"
                        />

                        {/* 6. Accordion Sections (Mobile Collapsible) */}
                        <div className="mb-12">
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {/* Inclusions */}
                                <AccordionItem value="inclusions" className="border border-gray-200 rounded-xl px-6 data-[state=open]:border-orange-500">
                                    <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-orange-600 hover:no-underline py-4">
                                        What&apos;s Included
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <ExperienceInclusions
                                            included={experience.included}
                                            notIncluded={experience.notIncluded}
                                        />
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Itinerary */}
                                {itinerary.length > 0 && (
                                    <AccordionItem value="itinerary" className="border border-gray-200 rounded-xl px-6 data-[state=open]:border-orange-500">
                                        <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-orange-600 hover:no-underline py-4">
                                            Itinerary
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6">
                                            <ExperienceTimeline itinerary={itinerary} />
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                {/* Meeting Point */}
                                <AccordionItem value="meeting-point" className="border border-gray-200 rounded-xl px-6 data-[state=open]:border-orange-500">
                                    <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-orange-600 hover:no-underline py-4">
                                        Meeting Point
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <ExperienceMeetingPoint
                                            address={experience.meetingPoint}
                                            pickupAvailable={experience.pickupAvailable}
                                            description={(experience as unknown as { meetingPointDescription?: string }).meetingPointDescription}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* 7. Requirements & Important Info */}
                        <ExperienceRequirements requirements={requirements} />

                        {/* 8. Host Information */}
                        <HostCard host={hostInfo} />

                        {/* 9. Cancellation Policy */}
                        <CancellationPolicy />

                        {/* 10. FAQs */}
                        {faqs.length > 0 && (
                            <FAQSection faqs={faqs} />
                        )}

                        {/* 11. Related Experiences */}
                        <div className="border-t border-gray-100 pt-10">
                            <RelatedExperiences currentId={experience.id} category={experience.category} />
                        </div>

                    </div>

                    {/* Right Column (Sticky Booking Sidebar - Desktop Only) */}
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

            {/* Mobile Booking Bar (Fixed Bottom) */}
            <MobileBookingBar
                experienceId={experience.id}
                experienceTitle={experience.title}
                price={experience.price}
                currency={experience.currency}
            />
        </div>
    );
}
