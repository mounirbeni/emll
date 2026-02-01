

interface ItineraryStep {
    time?: string;
    title: string;
    description?: string;
}

interface ExperienceItineraryProps {
    itinerary?: ItineraryStep[];
}

export default function ExperienceItinerary({ itinerary }: ExperienceItineraryProps) {
    // If no structured itinerary, we might mock one or return null. 
    // For this generic component, we render what's passed.
    if (!itinerary || itinerary.length === 0) return null;

    return (
        <section className="mb-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Itinerary</h2>
            <div className="relative border-l-2 border-gray-100 ml-3.5 space-y-8 pb-4">
                {itinerary.map((step, idx) => {
                    const isLast = idx === itinerary.length - 1;
                    const isFirst = idx === 0;

                    return (
                        <div key={idx} className="relative ml-8">
                            {/* Timestamp / Dot */}
                            <div className={`absolute -left-[43px] flex h-7 w-7 items-center justify-center rounded-full border-4 border-white ${isFirst ? 'bg-orange-500' : isLast ? 'bg-gray-900' : 'bg-gray-400'}`}>
                                {/* Inner visual handled by bg color */}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                                {step.time && (
                                    <span className="mb-1 text-sm font-bold text-gray-500 sm:mb-0 sm:w-16 sm:shrink-0 text-left">
                                        {step.time}
                                    </span>
                                )}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                                    {step.description && (
                                        <p className="mt-1 text-gray-600 text-sm leading-relaxed">{step.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-gray-400 italic mt-4 ml-4">* Itineraries are subject to change based on weather and traffic conditions.</p>
        </section>
    );
}
