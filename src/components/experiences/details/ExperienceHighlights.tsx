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
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {highlights.map((highlight, idx) => (
                    <div
                        key={idx}
                        className="flex-none w-[85%] snap-center sm:w-auto flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-orange-100 hover:bg-orange-50/30"
                    >
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
                            {getIconForHighlight(highlight)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 leading-tight text-sm">
                                {highlight}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
