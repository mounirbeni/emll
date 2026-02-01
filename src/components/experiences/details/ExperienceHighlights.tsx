import { Check, Flame, Camera, Coffee, Mountain, Footprints } from 'lucide-react';

interface ExperienceHighlightsProps {
    highlights: string[];
}

// Helper to get a semi-relevant icon or default to Check
// In a real app, highlights might come with an icon key from CMS
function getIconForHighlight(text: string) {
    const t = text.toLowerCase();
    if (t.includes('view') || t.includes('photo')) return <Camera className="h-5 w-5" />;
    if (t.includes('tea') || t.includes('dinner') || t.includes('lunch')) return <Coffee className="h-5 w-5" />;
    if (t.includes('desert') || t.includes('dune')) return <Flame className="h-5 w-5" />; // Heat/Sun
    if (t.includes('atlas') || t.includes('mountain')) return <Mountain className="h-5 w-5" />;
    if (t.includes('walk') || t.includes('hike')) return <Footprints className="h-5 w-5" />;
    return <Check className="h-5 w-5" />;
}

export default function ExperienceHighlights({ highlights }: ExperienceHighlightsProps) {
    return (
        <section className="mb-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Experience Highlights</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {highlights.map((highlight, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-orange-100 hover:bg-orange-50/30"
                    >
                        <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
                            {getIconForHighlight(highlight)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 leading-tight">
                                {highlight}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
