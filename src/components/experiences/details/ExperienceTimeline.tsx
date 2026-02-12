'use client';

import { Clock, MapPin, Star, Coffee, Camera, Utensils, Mountain } from 'lucide-react';

interface TimelineItem {
    time: string;
    title: string;
    description: string;
    location?: string;
    icon?: string;
}

interface ExperienceTimelineProps {
    itinerary: TimelineItem[];
}

// Icon mapping for different activity types
const getActivityIcon = (iconName?: string) => {
    const iconClass = "w-5 h-5";

    switch (iconName?.toLowerCase()) {
        case 'food':
        case 'meal':
        case 'lunch':
        case 'dinner':
            return <Utensils className={iconClass} />;
        case 'coffee':
        case 'break':
            return <Coffee className={iconClass} />;
        case 'photo':
        case 'camera':
            return <Camera className={iconClass} />;
        case 'mountain':
        case 'hiking':
            return <Mountain className={iconClass} />;
        case 'highlight':
        case 'star':
            return <Star className={iconClass} />;
        default:
            return <Clock className={iconClass} />;
    }
};

export default function ExperienceTimeline({ itinerary }: ExperienceTimelineProps) {
    if (!itinerary || itinerary.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {itinerary.map((item, index) => (
                <div key={index} className="relative flex gap-6 group">
                    {/* Timeline line and icon */}
                    <div className="relative flex flex-col items-center">
                        {/* Icon circle */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-4 ring-white shadow-md group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 z-10">
                            {getActivityIcon(item.icon)}
                        </div>

                        {/* Connecting line */}
                        {index < itinerary.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-orange-200 to-gray-200 mt-2 min-h-[60px]" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                        {/* Time badge */}
                        <div className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 mb-3">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time}</span>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                            {item.title}
                        </h4>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed mb-3">
                            {item.description}
                        </p>

                        {/* Location */}
                        {item.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span>{item.location}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
