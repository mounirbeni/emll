import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BecomeSupplierPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-white pt-20">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Become a Supplier
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
                Partner with us to showcase your unique experiences to travelers around the world.
                Registration coming soon.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                        Back to Home
                    </Button>
                </Link>
                <Link href="/contact">
                    <Button className="bg-[#FF5F00] hover:bg-[#E55500] text-white rounded-full px-8 py-6 text-lg font-bold">
                        Contact Us
                    </Button>
                </Link>
            </div>
        </div>
    );
}
