'use client';

import { Globe, Calendar, Sun, Cloud, Snowflake, Leaf } from 'lucide-react';

interface LanguagesAndSeasonsProps {
    languages?: string[];
    seasonalNotes?: string;
    bestTimeToVisit?: string;
}

export default function LanguagesAndSeasons({
    languages,
    seasonalNotes,
    bestTimeToVisit
}: LanguagesAndSeasonsProps) {
    const hasLanguages = languages && languages.length > 0;
    const hasSeasonalInfo = seasonalNotes || bestTimeToVisit;

    if (!hasLanguages && !hasSeasonalInfo) {
        return null;
    }

    // Season icon mapping
    const getSeasonIcon = (text: string) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('summer') || lowerText.includes('hot')) return <Sun className="w-5 h-5 text-orange-500" />;
        if (lowerText.includes('winter') || lowerText.includes('cold')) return <Snowflake className="w-5 h-5 text-blue-500" />;
        if (lowerText.includes('spring') || lowerText.includes('autumn') || lowerText.includes('fall')) return <Leaf className="w-5 h-5 text-green-500" />;
        return <Calendar className="w-5 h-5 text-gray-500" />;
    };

    return (
        <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Languages */}
                {hasLanguages && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            Available Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((language, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    {language}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Seasonal Information */}
                {hasSeasonalInfo && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-600" />
                            Seasonal Information
                        </h3>

                        {bestTimeToVisit && (
                            <div className="mb-4">
                                <div className="flex items-start gap-2 mb-2">
                                    {getSeasonIcon(bestTimeToVisit)}
                                    <span className="text-sm font-bold text-gray-900">Best Time to Visit</span>
                                </div>
                                <p className="text-gray-700 text-sm ml-7">
                                    {bestTimeToVisit}
                                </p>
                            </div>
                        )}

                        {seasonalNotes && (
                            <div>
                                <div className="flex items-start gap-2 mb-2">
                                    <Cloud className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-bold text-gray-900">Weather Notes</span>
                                </div>
                                <p className="text-gray-700 text-sm ml-7">
                                    {seasonalNotes}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
