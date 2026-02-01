import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const experiences = [
    {
        id: 1,
        title: "Marrakech Medina Guided Walking Tour",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        price: 45,
        rating: 4.9,
        reviews: 128,
        duration: "4 hours",
        category: "City Tours"
    },
    {
        id: 2,
        title: "Agafay Desert Sunset & Dinner",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        price: 85,
        rating: 4.8,
        reviews: 94,
        duration: "6 hours",
        category: "Desert Trips"
    },
    {
        id: 3,
        title: "Atlas Mountains Day Trip",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        price: 60,
        rating: 4.7,
        reviews: 210,
        duration: "8 hours",
        category: "Adventures"
    },
    {
        id: 4,
        title: "Traditional Moroccan Cooking Class",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        price: 55,
        rating: 5.0,
        reviews: 75,
        duration: "3 hours",
        category: "Food & Culture"
    }
];

export function FeaturedExperiences() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Experiences</h2>
                        <p className="text-gray-600">Handpicked activities for your trip</p>
                    </div>
                    <Link href="/experiences">
                        <Button variant="outline" className="hidden md:flex">
                            View All
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-56 w-full bg-gray-200">
                                <Image
                                    src={exp.image === "IMAGE_PLACEHOLDER_PENDING_UPLOAD" ? "/images/placeholder-experience.svg" : exp.image}
                                    alt={exp.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-800 z-10">
                                    {exp.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                    <span className="text-sm font-medium text-gray-900">{exp.rating}</span>
                                    <span className="text-xs text-gray-500">({exp.reviews})</span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {exp.title}
                                </h3>

                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{exp.duration}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="text-xs text-gray-500 block">From</span>
                                        <span className="text-lg font-bold text-primary">€{exp.price}</span>
                                    </div>
                                    <Button size="sm" className="rounded-full px-5">
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/experiences">
                        <Button variant="outline" size="lg" className="w-full">
                            View All Experiences
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
