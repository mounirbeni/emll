import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Wishlist",
    description: "View your saved Marrakech experiences. Keep track of your favorite activities, tours, and adventures for easy planning.",
    openGraph: {
        title: "Wishlist | Explore Marrakech",
        description: "Your favorite Marrakech experiences saved for later. Easy planning for your perfect trip.",
        url: "https://marrakech-luxe.vercel.app/wishlist",
    },
};

export default function WishlistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
