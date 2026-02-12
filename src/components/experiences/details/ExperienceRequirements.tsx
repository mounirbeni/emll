'use client';

import { Backpack, Heart, Users, AlertCircle, Accessibility, Shirt } from 'lucide-react';

interface Requirements {
    whatToBring?: string[];
    physicalRequirements?: string;
    minAge?: number;
    maxAge?: number;
    accessibility?: string[];
    healthNotes?: string[];
    dressCode?: string;
}

interface ExperienceRequirementsProps {
    requirements: Requirements;
}

export default function ExperienceRequirements({ requirements }: ExperienceRequirementsProps) {
    const hasAnyRequirements =
        (requirements.whatToBring && requirements.whatToBring.length > 0) ||
        requirements.physicalRequirements ||
        requirements.minAge ||
        requirements.maxAge ||
        (requirements.accessibility && requirements.accessibility.length > 0) ||
        (requirements.healthNotes && requirements.healthNotes.length > 0) ||
        requirements.dressCode;

    if (!hasAnyRequirements) {
        return null;
    }

    return (
        <section className="mb-12 border-t border-gray-100 pt-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Important Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What to Bring */}
                {requirements.whatToBring && requirements.whatToBring.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Backpack className="w-5 h-5 text-blue-600" />
                            What to Bring
                        </h3>
                        <ul className="space-y-2">
                            {requirements.whatToBring.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Age Restrictions */}
                {(requirements.minAge || requirements.maxAge) && (
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Age Requirements
                        </h3>
                        <p className="text-gray-700">
                            {requirements.minAge && requirements.maxAge && (
                                <>Ages {requirements.minAge} - {requirements.maxAge} years</>
                            )}
                            {requirements.minAge && !requirements.maxAge && (
                                <>Minimum age: {requirements.minAge} years</>
                            )}
                            {!requirements.minAge && requirements.maxAge && (
                                <>Maximum age: {requirements.maxAge} years</>
                            )}
                        </p>
                    </div>
                )}

                {/* Physical Requirements */}
                {requirements.physicalRequirements && (
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-green-600" />
                            Physical Requirements
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {requirements.physicalRequirements}
                        </p>
                    </div>
                )}

                {/* Accessibility */}
                {requirements.accessibility && requirements.accessibility.length > 0 && (
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Accessibility className="w-5 h-5 text-indigo-600" />
                            Accessibility
                        </h3>
                        <ul className="space-y-2">
                            {requirements.accessibility.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-indigo-600 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Health & Safety Notes */}
                {requirements.healthNotes && requirements.healthNotes.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            Health & Safety
                        </h3>
                        <ul className="space-y-2">
                            {requirements.healthNotes.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Dress Code */}
                {requirements.dressCode && (
                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shirt className="w-5 h-5 text-pink-600" />
                            Dress Code
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {requirements.dressCode}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
