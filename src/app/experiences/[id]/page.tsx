import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ServiceGallery from '@/components/experiences/ServiceGallery';
import BookingSidebar from '@/components/experiences/BookingSidebar';
import MobileBookingBar from '@/components/experiences/MobileBookingBar';
import { MapPin, Check, Info, Globe, Star, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
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
        description: exp?.shortDescription || 'Book this amazing experience in Marrakech with Explore Marrakech.',
    };
}

export default async function ExperienceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const experience = await prisma.experience.findFirst({
        where: {
            OR: [
                { id: id },
                { slug: id } // Support slug-based URLs
            ]
        }
    });

    if (!experience) {
        notFound();
    }

    // Parse FAQs if string, else use as is (Prisma Json type)
    const faqs = (Array.isArray(experience.faqs) ? experience.faqs : []) as { q: string; a: string }[];

    return (
        <div className="min-h-screen bg-white pb-20 pt-20">
            <div className="container mx-auto px-4 py-8">

                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-orange-500 hover:underline">Home</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href="/experiences" className="hover:text-orange-500 hover:underline">Experiences</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 line-clamp-1">{experience.title}</span>
                </nav>

                {/* Header Title Section */}
                <div className="mb-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                            {experience.category}
                        </span>
                        {experience.pickupAvailable && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Free Cancellation
                            </span>
                        )}
                    </div>

                    <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-5xl">
                        {experience.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-gray-900">4.9</span>
                            <span className="underline decoration-gray-300 underline-offset-4 hover:text-orange-500 hover:decoration-orange-500">(128 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{experience.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span className="underline decoration-dotted decoration-gray-400 underline-offset-4">{experience.location}</span>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <ServiceGallery images={experience.gallery} title={experience.title} />

                {/* Main Content Layout */}
                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-2">

                        {/* Quick Overview Grid if needed, or straight to description */}

                        {/* Full Description */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">About this activity</h2>
                            <div className="prose prose-lg max-w-none text-gray-600">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {experience.fullDescription}
                                </p>
                            </div>
                        </section>

                        {/* Highlights */}
                        <section className="mb-12 rounded-2xl bg-gray-50 p-8">
                            <h3 className="mb-6 text-xl font-bold text-gray-900">Experience Highlights</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {
                                    experience.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-gray-700">{highlight.replace(/'/g, "&apos;")}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </section>

                        {/* Included / Not Included */}
                        <section className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div>
                                <h3 className="mb-5 text-lg font-bold text-gray-900">What&apos;s included</h3>
                                <ul className="space-y-4">
                                    {
                                        experience.included.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full bg-green-50 p-0.5 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                <span className="text-gray-600 font-medium">{item.replace(/'/g, "&apos;")}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-5 text-lg font-bold text-gray-900">What&apos;s not included</h3>
                                <ul className="space-y-4">
                                    {
                                        experience.notIncluded.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 opacity-75">
                                                <div className="mt-0.5 text-red-400">
                                                    <Info className="h-4 w-4" />
                                                </div>
                                                <span className="text-gray-500">{item.replace(/'/g, "&apos;")}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </section>

                        {/* Meeting Point */}
                        <section className="mb-12 border-t border-gray-100 pt-10">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Meeting point</h2>
                            <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-5 transition-all hover:border-orange-200 hover:shadow-md">
                                <div className="rounded-full bg-primary/10 p-3 text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{experience.meetingPoint}</h4>
                                    {
                                        experience.pickupAvailable && (
                                            <p className="mt-1 text-sm font-medium text-green-600">Pickup available from your hotel or riad.</p>
                                        )
                                    }
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.meetingPoint + ' Marrakech')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center font-bold text-orange-600 hover:underline"
                                    >
                                        Open in Google Maps <ChevronRight className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                                <div className="hidden h-24 w-24 overflow-hidden rounded-lg bg-gray-200 md:block">
                                    {/* Placeholder for map preview image - could use static map API */}
                                    <div className="h-full w-full bg-orange-50"></div>
                                </div>
                            </div>
                        </section>

                        {/* FAQs */}
                        {
                            faqs.length > 0 && (
                                <section className="mb-12 border-t border-gray-100 pt-10">
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently ask questions</h2>
                                    <Accordion type="single" collapsible className="w-full">
                                        {
                                            faqs.map((faq: { q: string; a: string }, idx: number) => (
                                                <AccordionItem key={idx} value={`item-${idx}`} className='border-gray-200'>
                                                    <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-orange-600">
                                                        {faq.q}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-base text-gray-600">
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))
                                        }
                                    </Accordion>
                                </section>
                            )
                        }
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
