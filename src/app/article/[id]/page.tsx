"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ArticlePage() {
    const params = useParams();
    const id = params.id;

    // This would typically come from a CMS or database
    const images = [
        "/images/placeholder-experience.svg",
        "/images/placeholder-experience.svg",
        "/images/placeholder-experience.svg"
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={images[(Number(id) || 1) % images.length]}
                    alt="Article Cover"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-white/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center px-4 max-w-4xl">
                        Exploring the Wonders of Marrakech
                    </h1>
                </div>
            </div>

            {/* Content */}
            <article className="container mx-auto px-4 max-w-3xl -mt-20 relative z-10 bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                <Link href="/" className="inline-flex items-center text-primary font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="lead text-xl text-black font-semibold mb-6">
                        Marrakech is a city that awakens all the senses. From the vibrant colors of the souks to the aromatic scents of spices, every corner tells a story.
                    </p>
                    <p className="mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h2 className="text-2xl font-bold text-black mb-4 mt-8">The Cultural Heart</h2>
                    <p className="mb-6">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className="relative h-[400px] w-full my-8 rounded-2xl overflow-hidden">
                        <Image
                            src="/images/placeholder-experience.svg"
                            alt="Market scene"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-4 mt-8">A Culinary Journey</h2>
                    <p className="mb-6">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                </div>
            </article>
        </div>
    );
}
