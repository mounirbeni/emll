"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function WhatsAppButton() {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        const phoneNumber = "212601439975"; // Morocco format: +212 601 439 975
        const message = encodeURIComponent("Hi! I need help with booking an experience in Marrakech.");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            /* .fab-floating keeps this clear of the bottom nav and of any docked
               booking bar; see globals.css. */
            className="fab-floating layer-docked group fixed right-4 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-lg transition-all duration-300 hover:bg-[#20bd5a] md:right-6"
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap font-semibold ${isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
                }`}>
                Chat with us
            </span>
        </button>
    );
}
