import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Frequently Asked Questions",
    description: "Find answers to common questions about booking and experiencing Marrakech. Learn about payments, hotel pickups, guide languages, and more.",
    openGraph: {
        title: "FAQ | Explore Marrakech",
        description: "Find answers to common questions about booking and experiencing Marrakech with our trusted local guides.",
        url: "https://marrakech-luxe.vercel.app/faq",
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
