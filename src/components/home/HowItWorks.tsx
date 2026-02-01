"use client";



export function HowItWorks() {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm z-10">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-3">Browse Experiences</h3>
                        <p className="text-gray-500 leading-relaxed px-4">
                            Explore our handpicked selection of authentic tours and activities in Marrakech.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm z-10">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-3">Choose Date & Guests</h3>
                        <p className="text-gray-500 leading-relaxed px-4">
                            Select your preferred date and number of people for your adventure.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm z-10">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-3">Instant Confirmation</h3>
                        <p className="text-gray-500 leading-relaxed px-4">
                            Receive your ticket immediately via email with all the details you need.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
