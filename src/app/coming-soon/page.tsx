import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComingSoonPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-white">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Coming Soon
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
                We are expanding our services and this service will be available soon.
            </p>
            <Link href="/">
                <Button className="bg-[#FF5F00] hover:bg-[#E55500] text-white rounded-full px-8 py-6 text-lg font-bold">
                    Back to Homepage
                </Button>
            </Link>
        </div>
    );
}
