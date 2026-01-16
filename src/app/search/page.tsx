import { Suspense } from "react";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Skeleton } from "@/components/ui/skeleton";

// Mock services data - replace with API call in production
const MOCK_SERVICES = [
    {
        id: "1",
        title: "Desert Adventure at Sunrise",
        description: "Experience the breathtaking beauty of the Sahara desert at sunrise with a camel trek.",
        price: 120,
        duration: "Full day",
        category: "Adventures",
        rating: 4.8,
        reviewCount: 245,
        location: "Erg Chebbi, Merzouga",
        maxGuests: 6,
    },
    {
        id: "2",
        title: "Medina Souk Walking Tour",
        description: "Explore the winding alleys of the historic Medina with a knowledgeable local guide.",
        price: 45,
        duration: "3-4 hours",
        category: "City Tours",
        rating: 4.6,
        reviewCount: 128,
        location: "Old Medina, Marrakech",
        maxGuests: 12,
    },
    {
        id: "3",
        title: "Moroccan Cooking Class",
        description: "Learn to prepare authentic Moroccan dishes in a local home kitchen.",
        price: 85,
        duration: "3-4 hours",
        category: "Food & Drink",
        rating: 4.9,
        reviewCount: 89,
        location: "Medina",
        maxGuests: 8,
    },
    {
        id: "4",
        title: "Atlas Mountains Hiking",
        description: "Trek through stunning mountain peaks with panoramic views of Marrakech below.",
        price: 95,
        duration: "Full day",
        category: "Excursions",
        rating: 4.7,
        reviewCount: 156,
        location: "High Atlas Mountains",
        maxGuests: 10,
    },
    {
        id: "5",
        title: "Moroccan Hammam Experience",
        description: "Relax in a traditional hammam with steam bath and massage treatments.",
        price: 65,
        duration: "2 hours",
        category: "Wellness",
        rating: 4.5,
        reviewCount: 203,
        location: "Medina",
        maxGuests: 20,
    },
    {
        id: "6",
        title: "Marrakech City Tour",
        description: "Discover the main attractions of Marrakech with visits to Jemaa el-Fnaa, Koutoubia Mosque, and more.",
        price: 50,
        duration: "4-5 hours",
        category: "City Tours",
        rating: 4.4,
        reviewCount: 312,
        location: "Marrakech City Center",
        maxGuests: 15,
    },
];

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <div className="flex flex-col mb-8">
                <h1 className="text-4xl font-serif text-[var(--color-secondary)] mb-2">Find Your Experience</h1>
                <p className="text-muted-foreground">Discover the best of Marrakech, guided by locals.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                        <SearchFilters />
                    </Suspense>
                </aside>

                {/* Results Grid */}
                <main className="lg:col-span-3">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-[300px]" /><Skeleton className="h-[300px]" /></div>}>
                        <SearchResults services={MOCK_SERVICES} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
