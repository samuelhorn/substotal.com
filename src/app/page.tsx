import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { MainValuePropositionSection } from "@/components/sections/main-value-proposition-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { SubscriptionCategoriesSection } from "@/components/sections/subscription-categories-section";
import { SubscriptionCostFactsSection } from "@/components/sections/subscription-cost-facts-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";

const metaTitle = "Substotal - Track Your Subscriptions and Save Money";
const metaDescription = "Manage all your subscriptions in one place. No account required, completely private, and forever free.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: ["subscription tracker", "subscription management", "expense tracking", "personal finance", "budget tool"],
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/og.png",
        width: 2400,
        height: 1260,
        alt: "Substotal - Subscription Tracker",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <MainValuePropositionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <SubscriptionCategoriesSection />
      <SubscriptionCostFactsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}