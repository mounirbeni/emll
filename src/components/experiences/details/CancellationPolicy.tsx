'use client';

import { Calendar, RefreshCw, Phone, AlertTriangle } from 'lucide-react';

interface CancellationPolicyProps {
    policy?: {
        fullRefund?: string; // e.g., "24 hours before"
        partialRefund?: string; // e.g., "12-24 hours before"
        noRefund?: string; // e.g., "Less than 12 hours"
        weatherPolicy?: string;
        additionalNotes?: string[];
    };
}

export default function CancellationPolicy({ policy }: CancellationPolicyProps) {
    // Default policy if none provided
    const defaultPolicy = {
        fullRefund: "Cancel up to 24 hours before the experience for a full refund",
        partialRefund: "Cancel 12-24 hours before for a 50% refund",
        noRefund: "No refund for cancellations less than 12 hours before",
        weatherPolicy: "Full refund if cancelled due to poor weather conditions",
        additionalNotes: [
            "Cancellations must be made through our platform",
            "Refunds will be processed within 5-7 business days"
        ]
    };

    const activePolicy = policy || defaultPolicy;

    return (
        <section className="mb-12 border-t border-gray-100 pt-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Cancellation Policy</h2>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                {/* Timeline-based policy */}
                <div className="space-y-6 mb-8">
                    {activePolicy.fullRefund && (
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                                        100% Refund
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {activePolicy.fullRefund}
                                </p>
                            </div>
                        </div>
                    )}

                    {activePolicy.partialRefund && (
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-full">
                                        50% Refund
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {activePolicy.partialRefund}
                                </p>
                            </div>
                        </div>
                    )}

                    {activePolicy.noRefund && (
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                                        No Refund
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {activePolicy.noRefund}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Weather Policy */}
                {activePolicy.weatherPolicy && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Weather Cancellation</h4>
                                <p className="text-gray-700 text-sm">
                                    {activePolicy.weatherPolicy}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Notes */}
                {activePolicy.additionalNotes && activePolicy.additionalNotes.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-bold text-gray-900 mb-3">Important Notes</h4>
                        <ul className="space-y-2">
                            {activePolicy.additionalNotes.map((note, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contact for Changes */}
                <div className="mt-6 bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Need to make changes?</h4>
                            <p className="text-gray-700 text-sm">
                                Contact us as soon as possible to discuss your options.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
