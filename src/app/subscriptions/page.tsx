import type { Metadata } from "next";
import { SubscriptionSummarySection } from "@/components/subscription-summary-section";
import { SubscriptionChartsSection } from "@/components/subscription-charts-section";
import { SubscriptionTableSection } from "@/components/subscription-table-section";
import { WelcomeModal } from "@/components/welcome-modal";
import { createClient } from "@/lib/supabase/server";
import { AuthRedirect } from "@/components/auth-redirect";
import { revalidatePath } from "next/cache";

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

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* If no user is logged in, check if we should redirect to sign-in */}
      {!user && <AuthRedirect />}
      <div className="space-y-4">
        {/* Welcome Modal */}
        <WelcomeModal />
        {/* Cost Summary Cards */}
        <SubscriptionSummarySection />
        {/* Subscription Charts */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SubscriptionChartsSection />
          </div>
          {/* Subscription Table */}
          <div className="mt-8">
            <SubscriptionTableSection />
          </div>
        </div>
      </div>
    </>
  );
}
