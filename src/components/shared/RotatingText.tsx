"use client";

import { useState, useEffect } from "react";

interface RotatingTextProps {
    staticText: string;
    rotatingWords: string[];
    interval?: number;
    className?: string;
}

/**
 * RotatingText Component
 * 
 * Displays static text followed by rotating words with smooth fade transitions.
 * Designed for Next.js with no hydration issues.
 * 
 * @param staticText - The text that remains constant
 * @param rotatingWords - Array of words to rotate through
 * @param interval - Time between word changes in ms (default: 2500)
 * @param className - Additional CSS classes
 */
export function RotatingText({
    staticText,
    rotatingWords,
    interval = 2500,
    className = "",
}: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Fade out current word
        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false);
        }, interval - 300);

        // Change word and fade in
        const changeWordTimer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
            setIsVisible(true);
        }, interval);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(changeWordTimer);
        };
    }, [currentIndex, interval, rotatingWords.length]);

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <span className="text-black font-medium">{staticText}</span>
            <span
                className="text-[#FF5F00] font-bold transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
            >
                {rotatingWords[currentIndex]}
            </span>
        </div>
    );
}
