export interface ExperienceItinerary {
    title: string;
    description: string;
}

export interface ExperienceFaq {
    q: string;
    a: string;
}

export interface RichExperience {
    title: string;
    category: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    shortDescription: string;
    fullDescription: string;
    highlights: string[];
    itinerary: ExperienceItinerary[];
    included: string[];
    notIncluded: string[];
    meetingPoint: string;
    importantInfo: string[];
    faqs: ExperienceFaq[];
    relatedExperiences: string[]; // Titles or IDs to link
    imageConcepts: string[]; // For future AI image generation
    pickupAvailable: boolean;
    gallery: string[];
    featured?: boolean;
    popularity?: number;
}
