"use client";

import Link from "next/link";

export default function SkipLink() {
    return (
        <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-full focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
            Skip to main content
        </Link>
    );
}
