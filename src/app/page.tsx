import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing-page-content";

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
        url: "/home-og.png",
        width: 2400,
        height: 1260,
        alt: "Substotal - Subscription Tracker",
      },
    ],
  },
};

export default function LandingPage() {
  return <LandingPageContent />;
}