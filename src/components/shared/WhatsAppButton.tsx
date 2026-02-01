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
            className="fixed bottom-6 right-6 z-50 h-14 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group"
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
