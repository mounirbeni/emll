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
        <div className="py-12 border-t border-border mt-12">
            <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-charcoal">Related Services</h2>
                    <p className="text-sm text-medium-gray">Turn inspiration into bookings — curated experiences for your trip.</p>
                </div>
                <Link href="/services" className="text-sm font-semibold text-primary hover:underline">
                    View all
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Link key={service.id} href={`/services/${service.id}`} className="group block">
                        <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                                <Image
                                    src={(service.images as unknown as string[])?.[0] || '/placeholder.jpg'}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-white/95 text-charcoal hover:bg-white text-xs backdrop-blur-sm rounded-full">
                                        {service.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3.5 w-3.5 ${i < Math.floor(service.rating || 0)
                                                    ? 'text-primary fill-primary'
                                                    : 'text-border'
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-xs font-semibold text-charcoal ml-1">{(service.rating || 0).toFixed(1)}</span>
                                        <span className="text-xs text-medium-gray">({service.reviews || 0})</span>
                                    </div>
                                    <span className="text-lg font-bold text-primary">€{service.price.toFixed(0)}</span>
                                </div>
                                <h3 className="font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-medium-gray">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{service.duration}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
