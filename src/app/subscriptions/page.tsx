import type { Metadata } from "next";
import { SubscriptionProvider } from "@/components/subscription-context";
import { SubscriptionSummarySection } from "@/components/subscription-summary-section";
import { SubscriptionChartsSection } from "@/components/subscription-charts-section";
import { SubscriptionTableSection } from "@/components/subscription-table-section";
import { Separator } from "@/components/ui/separator";
import { WelcomeModal } from "@/components/welcome-modal";

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
  return (
    <SubscriptionProvider>
      <div className="space-y-8">
        {/* Welcome Modal */}
        <WelcomeModal />

        {/* Cost Summary Cards */}
        <SubscriptionSummarySection />

        {/* Subscription Charts */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SubscriptionChartsSection />
          </div>

          <Separator className="my-6" />

          {/* Subscription Table */}
          <div>
            <SubscriptionTableSection />
          </div>
        </div>
      </div>
    </SubscriptionProvider>
  );
}
