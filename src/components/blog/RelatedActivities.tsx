import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { Star, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export async function RelatedActivities() {
    // Fetch 3 random active services
    // Since Prisma doesn't have native random, we can fetch some and pick random or just take 3
    // For performance, simple take 3 is fine, or take 10 and shuffle in JS
    const services = await prisma.service.findMany({
        take: 3,
        orderBy: { rating: 'desc' }
    })

    if (services.length === 0) return null

    return (
        <div className="py-12 border-t mt-12">
            <h2 className="text-2xl font-bold mb-8">Experiences You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Link key={service.id} href={`/experiences/${service.id}`} className="group block">
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="relative aspect-[4/3] bg-gray-100">
                                <Image
                                    src={service.images[0] || '/placeholder.jpg'}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                />
                                <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white text-xs backdrop-blur-sm">
                                    {service.category}
                                </Badge>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-1 mb-2 text-yellow-500">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <span className="text-sm font-semibold text-gray-900">{service.rating}</span>
                                    <span className="text-xs text-gray-500">({service.reviews})</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{service.duration}</span>
                                    </div>
                                    <span className="font-bold text-lg">€{service.price}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
