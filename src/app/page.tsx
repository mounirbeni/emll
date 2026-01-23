"use client";

import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { MoreAboutMarrakech } from "@/components/home/MoreAboutMarrakech";
import { Shield, Award, CreditCard, Star, TrendingUp, Users } from "lucide-react";
import { MobileCard } from "@/components/mobile/MobileCard";
import { MobileButton } from "@/components/mobile/MobileButton";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Mobile App Layout */}
      <div className="md:hidden min-h-screen bg-beige-50">
        {/* Fullscreen Hero */}
        <Hero />

        {/* Quick Stats Section */}
        <section className="px-4 py-6 -mt-8 relative z-10">
          <div className="grid grid-cols-3 gap-3">
            <MobileCard className="text-center py-4" noPadding>
              <div className="flex flex-col items-center gap-1">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <p className="text-lg font-bold text-charcoal">4.9</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </MobileCard>
            <MobileCard className="text-center py-4" noPadding>
              <div className="flex flex-col items-center gap-1">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-lg font-bold text-charcoal">12K+</p>
                <p className="text-xs text-gray-500">Travelers</p>
              </div>
            </MobileCard>
            <MobileCard className="text-center py-4" noPadding>
              <div className="flex flex-col items-center gap-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-lg font-bold text-charcoal">200+</p>
                <p className="text-xs text-gray-500">Tours</p>
              </div>
            </MobileCard>
          </div>
        </section>

        {/* Featured Experiences - Horizontal Scroll */}
        <section className="py-6">
          <div className="px-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                Top Experiences
              </h2>
              <p className="text-sm text-gray-500">Handpicked for you</p>
            </div>
            <Link href="/services">
              <button className="text-sm font-semibold text-primary">
                See All →
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto hide-scrollbar scroll-snap-x">
            <div className="flex gap-4 px-4 pb-2">
              <FeaturedExperiences isMobile />
            </div>
          </div>
        </section>

        {/* Why Book With Us - App Style Cards */}
        <section className="px-4 py-6">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Why Book With Us
          </h2>
          <div className="space-y-3">
            <TrustCard
              icon={<Shield className="w-5 h-5 text-primary" />}
              title="Best Price Guarantee"
              description="We match any lower price"
            />
            <TrustCard
              icon={<Award className="w-5 h-5 text-primary" />}
              title="Local Experts"
              description="Certified local guides"
            />
            <TrustCard
              icon={<CreditCard className="w-5 h-5 text-primary" />}
              title="Secure Booking"
              description="Free cancellation 24h before"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="px-4 py-6">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/services">
              <MobileCard className="text-center py-6 cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <p className="font-semibold text-charcoal">Explore Tours</p>
                </div>
              </MobileCard>
            </Link>
            <Link href="/become-supplier">
              <MobileCard className="text-center py-6 cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <p className="font-semibold text-charcoal">Become Partner</p>
                </div>
              </MobileCard>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-8 mb-6">
          <MobileCard className="bg-gradient-to-br from-primary to-accent text-white p-6">
            <h3 className="text-xl font-bold mb-2">Ready to Explore?</h3>
            <p className="text-white/90 mb-4 text-sm">
              Discover authentic Marrakech with local experts
            </p>
            <Link href="/services">
              <MobileButton
                variant="secondary"
                fullWidth
                className="bg-white text-primary hover:bg-gray-50"
              >
                Browse Experiences
              </MobileButton>
            </Link>
          </MobileCard>
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
                  Found a lower price? We&apos;ll match it and give you 10% off
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
    <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-charcoal mb-0.5">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}
