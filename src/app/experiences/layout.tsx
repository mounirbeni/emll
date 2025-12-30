import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Experiences",
    description: "Discover the magic of Marrakech with our curated selection of premium activities, tours, and adventures. From desert excursions to cooking classes, find your perfect Moroccan experience.",
    openGraph: {
        title: "All Experiences | Explore Marrakech",
        description: "Discover the magic of Marrakech with our curated selection of premium activities, tours, and adventures.",
        url: "https://marrakech-luxe.vercel.app/experiences",
    },
};

export default function ExperiencesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
