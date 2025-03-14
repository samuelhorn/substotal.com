import type { Metadata } from "next";
import { SubscriptionsPageContent } from "@/components/subscriptions-page-content";

const metaTitle = "Your Subscriptions | Substotal";
const metaDescription = "Manage and track all your subscription expenses in one place with SubTrack.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: ["subscription management", "subscription tracker", "recurring expenses", "subscription dashboard"],
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/subscriptions-og.png",
        width: 2400,
        height: 1260,
        alt: "Substotal - Subscription Tracker",
      },
    ],
  }
};

export default function SubscriptionsPage() {
  return <SubscriptionsPageContent />;
}
