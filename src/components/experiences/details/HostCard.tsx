'use client';

import Image from 'next/image';
import { BadgeCheck, Globe, Clock, Star } from 'lucide-react';

interface HostInfo {
    name: string;
    image: string;
    bio: string;
    verified: boolean;
    yearsExperience?: number;
    languages?: string[];
    responseTime?: string;
}

interface HostCardProps {
    host: HostInfo;
}

export default function HostCard({ host }: HostCardProps) {
    return (
        <section className="mb-12 border-t border-gray-100 pt-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Meet Your Host</h2>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Host Image */}
                    <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            <Image
                                src={host.image || '/images/default-avatar.svg'}
                                alt={host.name}
                                fill
                                className="rounded-full object-cover ring-4 ring-white shadow-lg"
                            />
                            {host.verified && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 ring-4 ring-white shadow-lg">
                                    <BadgeCheck className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Host Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {host.name}
                                </h3>
                                {host.verified && (
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                                        <BadgeCheck className="w-4 h-4" />
                                        Verified Host
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                            {host.bio}
                        </p>

                        {/* Host Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            {host.yearsExperience && (
                                <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                    <Star className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-700">
                                        {host.yearsExperience}+ years experience
                                    </span>
                                </div>
                            )}

                            {host.languages && host.languages.length > 0 && (
                                <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                    <Globe className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-700">
                                        Speaks {host.languages.join(', ')}
                                    </span>
                                </div>
                            )}

                            {host.responseTime && (
                                <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-700">
                                        Responds within {host.responseTime}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
