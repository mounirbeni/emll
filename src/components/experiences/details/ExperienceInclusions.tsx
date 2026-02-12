'use client';

import { Check, X } from 'lucide-react';

interface ExperienceInclusionsProps {
    included: string[];
    notIncluded: string[];
}

export default function ExperienceInclusions({ included, notIncluded }: ExperienceInclusionsProps) {
    const hasIncluded = included && included.length > 0;
    const hasNotIncluded = notIncluded && notIncluded.length > 0;

    if (!hasIncluded && !hasNotIncluded) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What's Included */}
            {hasIncluded && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                        </div>
                        What's Included
                    </h3>
                    <ul className="space-y-3">
                        {included.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* What's Not Included */}
            {hasNotIncluded && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="w-4 h-4 text-red-600" />
                        </div>
                        What's Not Included
                    </h3>
                    <ul className="space-y-3">
                        {notIncluded.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
