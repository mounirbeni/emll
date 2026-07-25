// Server component: it only composes sections, and FeaturedExperiences needs to
// query real experiences. Each interactive section carries its own "use client".
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CategoryExplorer } from "@/components/home/CategoryExplorer";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BlogPreview } from "@/components/home/BlogPreview";
import { BecomePartner } from "@/components/home/BecomePartner";

// Re-render at most every 5 minutes so featured experiences stay current
// without hitting the database on every request.
export const revalidate = 300;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <Hero />

      {/* Why Choose Us - Features Grid */}
      <WhyChooseUs />

      {/* Featured Experiences - Top Picks */}
      <FeaturedExperiences />

      {/* Category Explorer - Browse by type */}
      <CategoryExplorer />

      {/* How It Works - Simple Steps */}
      <HowItWorks />

      {/* Blog Preview - Travel Tips */}
      <BlogPreview />

      {/* Become a Partner CTA */}
      <BecomePartner />

    </div>
  );
}
