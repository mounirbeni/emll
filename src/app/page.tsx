"use client";

import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { MoreAboutMarrakech } from "@/components/home/MoreAboutMarrakech";
import { Shield, Award, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
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
            <button className="bg-[#FF5F00] hover:bg-[#E55500] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
              Become a Partner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
