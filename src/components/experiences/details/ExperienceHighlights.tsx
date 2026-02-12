'use client';

import { Sparkles, Users, Camera, MapPin, Clock, Star, Heart, Award } from 'lucide-react';

interface ExperienceHighlightsProps {
    highlights: string[];
}

// Icon mapping for common highlight keywords
const getHighlightIcon = (highlight: string) => {
    const iconClass = "w-5 h-5 text-orange-500 flex-shrink-0";
    const lowerHighlight = highlight.toLowerCase();

    if (lowerHighlight.includes('photo') || lowerHighlight.includes('picture')) {
        return <Camera className={iconClass} />;
    }
    if (lowerHighlight.includes('group') || lowerHighlight.includes('people')) {
        return <Users className={iconClass} />;
    }
    if (lowerHighlight.includes('location') || lowerHighlight.includes('place') || lowerHighlight.includes('visit')) {
        return <MapPin className={iconClass} />;
    }
    if (lowerHighlight.includes('time') || lowerHighlight.includes('hour') || lowerHighlight.includes('day')) {
        return <Clock className={iconClass} />;
    }
    if (lowerHighlight.includes('best') || lowerHighlight.includes('top') || lowerHighlight.includes('premium')) {
        return <Star className={iconClass} />;
    }
    if (lowerHighlight.includes('authentic') || lowerHighlight.includes('traditional') || lowerHighlight.includes('local')) {
        return <Heart className={iconClass} />;
    }
    if (lowerHighlight.includes('expert') || lowerHighlight.includes('guide') || lowerHighlight.includes('professional')) {
        return <Award className={iconClass} />;
    }

    return <Sparkles className={iconClass} />;
};

export default function ExperienceHighlights({ highlights }: ExperienceHighlightsProps) {
    if (!highlights || highlights.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Experience Highlights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="mt-0.5 group-hover:scale-110 transition-transform duration-300">
                            {getHighlightIcon(highlight)}
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">
                            {highlight}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
