import { Check, X } from 'lucide-react';

interface ExperienceInclusionsProps {
    included: string[];
    notIncluded: string[];
}

export default function ExperienceInclusions({ included, notIncluded }: ExperienceInclusionsProps) {
    return (
        <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">What&apos;s Included</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

                {/* Included */}
                <div>
                    <div className="space-y-4">
                        {included.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <Check className="h-3 w-3" />
                                </div>
                                <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Not Included */}
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">Not Included</h3>
                    <div className="space-y-4">
                        {notIncluded.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 opacity-75">
                                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <X className="h-3 w-3" />
                                </div>
                                <span className="text-gray-500">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
