import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExperienceMeetingPointProps {
    address: string;
    description?: string;
    pickupAvailable: boolean;
}

export default function ExperienceMeetingPoint({ address, description, pickupAvailable }: ExperienceMeetingPointProps) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ' Marrakech')}`;

    return (
        <section className="mb-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Meeting Point</h2>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {/* Visual Map Placeholder (Interactive Maps can be heavy for MVP, static image or placeholder is fine) */}
                <div className="relative h-48 w-full bg-orange-50 bg-[url('/patterns/map-pattern.svg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/5" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-orange-600 text-white shadow-xl">
                            <MapPin className="h-6 w-6 fill-white" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                            <div>
                                <h4 className="font-bold text-gray-900">{address}</h4>
                                {description && <p className="text-sm text-gray-500">{description}</p>}
                            </div>
                        </div>
                        {pickupAvailable && (
                            <div className="ml-7 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 max-w-fit">
                                Note: Pickup is available from your hotel. Please arrange strictly 24 hours in advance.
                            </div>
                        )}
                    </div>

                    <Button asChild variant="outline" className="shrink-0 gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4" />
                            Get Directions
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
