export interface ActivityPackage {
    name: string;
    price: number;
    description: string;
    included: string[];
    notIncluded?: string[];
}

export interface PackageCategory {
    name: string;
    description?: string;
    packages: ActivityPackage[];
}

export interface Activity {
    id: string;
    title: string;
    subtitle?: string; // Optional compelling subtitle
    price: number;
    priceRange?: string; // Optional price range if applicable
    rating: number;
    reviews: number;
    category: string;
    image: string;
    duration: string;
    features: string[];
    location: string;
    tags?: string[];
    images?: string[];
    host: {
        name: string;
        image: string;
        bio?: string; // Optional host biography
        verified?: boolean; // Verified expert status
    };
    description: string;
    included: string[];
    exclusions: string[]; // What is not included
    meetingPoint: string;
    endingPoint: string;
    cancellationPolicy: string;
    requirements: string[];
    ageRestrictions: string;
    whatToBring: string[];
    experienceHighlights: string[]; // Experience highlights and/or step-by-step itinerary
    additionalInfo: string; // Any additional useful information
    itinerary: {
        time: string;
        title: string;
        description: string;
    }[];
    minGroupSize: number;
    maxGroupSize: number;
    packages?: ActivityPackage[];
    packageCategories?: PackageCategory[];

    // === Luxury Enhancement Fields ===
    targetAudience?: string; // Who will love this experience
    uniqueSellingPoints?: string[]; // What makes this experience special
    premiumAddons?: {
        name: string;
        price: number;
        description: string;
    }[]; // Optional upgrades
    importantNotes?: string[]; // Critical information guests must know
    whatToExpect?: string; // Detailed step-by-step experience description
    authenticMoroccanElements?: string[]; // Cultural highlights and authentic elements
    difficulty?: 'Easy' | 'Moderate' | 'Challenging'; // Activity difficulty level
    languages?: string[]; // Available guide languages
    accessibility?: string; // Accessibility information
    seasonalNotes?: string; // Best time to book, seasonal considerations
}
