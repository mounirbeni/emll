"use client";

import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { MoreAboutMarrakech } from "@/components/home/MoreAboutMarrakech";
import { Shield, Award, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-beige-50">
        <Hero />

        {/* Mobile Featured Experiences - Horizontal Scroll */}
        <section className="py-6 bg-beige-50">
          <div className="px-4">
            <h2 className="text-xl font-bold text-charcoal mb-4">
              Top Experiences
            </h2>
            <FeaturedExperiences isMobile />
          </div>
        </section>

        {/* Mobile Trust Section - Compact */}
        <section className="py-8 px-4">
          <div className="space-y-4">
            <TrustCard
              icon={<Shield className="w-5 h-5 text-orange-500" />}
              title="Best Price"
              description="We match any lower price"
            />
            <TrustCard
              icon={<Award className="w-5 h-5 text-orange-500" />}
              title="Local Experts"
              description="Certified local guides"
            />
            <TrustCard
              icon={<CreditCard className="w-5 h-5 text-orange-500" />}
              title="Secure Booking"
              description="Free cancellation 24h before"
            />
          </div>
        </section>
      </div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden md:block min-h-screen bg-white">
        <Hero />
        <Categories />
        <FeaturedExperiences />

        {/* Trust & Safety Section */}
        <section className="py-16 bg-white border-t border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-black mb-3">
                Why book with us?
              </h2>
              <p className="text-text-secondary">
                Your trusted partner for authentic Marrakech experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">Best Price Guarantee</h3>
                <p className="text-sm text-text-secondary">
                  Found a lower price? We'll match it and give you 10% off
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">Local Experts</h3>
                <p className="text-sm text-text-secondary">
                  All guides are certified locals with years of experience
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-black mb-2">Secure Booking</h3>
                <p className="text-sm text-text-secondary">
                  Free cancellation up to 24 hours before your experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Read More Section */}
        <MoreAboutMarrakech />

        {/* Join Community Section */}
        <section className="py-20 bg-[#FFF5F0]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Join our community
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover exclusive experiences, connect with local experts, and become part of our growing network of travelers and hosts in Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-accent text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                Become a Partner
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Mobile Trust Card Component
function TrustCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-charcoal mb-0.5">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}
