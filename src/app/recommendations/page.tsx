import type { Metadata } from "next";
import RecommendationsClient from "./RecommendationsClient";

export const metadata: Metadata = {
    title: "Recommendations",
    description: "The best places in Marrakech to eat, relax at a spa or hammam, play, sleep, and explore — curated by our local team.",
    openGraph: {
        title: "Best of Marrakech | Explore Marrakech",
        description: "Our local team's hand-picked guide to the best restaurants, spas, nightlife, gaming, hotels and outdoor spots in Marrakech.",
        url: "https://marrakech-luxe.vercel.app/recommendations",
    },
};

export default function RecommendationsPage() {
    return <RecommendationsClient />;
}
