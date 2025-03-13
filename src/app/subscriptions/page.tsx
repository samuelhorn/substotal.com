"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SubscriptionFormDialog } from "@/components/subscription-form-dialog";
import { SubscriptionTable } from "@/components/subscription-table";
import { CostSummaryCards } from "@/components/cost-summary-cards";
import { SubscriptionCharts } from "@/components/subscription-charts";
import { Separator } from "@/components/ui/separator";
import { WelcomeModal } from "@/components/welcome-modal";
import { useCurrency } from "@/components/currency-context";
import {
  Subscription,
  loadSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription
} from "@/lib/subscriptions";
import { loadPrimaryCurrency, savePrimaryCurrency } from "@/lib/settings";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { primaryCurrency, exchangeRates } = useCurrency();

  useEffect(() => {
    const loadedSubscriptions = loadSubscriptions();
    setSubscriptions(loadedSubscriptions);

    // If no saved currency preference exists, determine from subscriptions
    const savedCurrency = loadPrimaryCurrency();
    if (!savedCurrency && loadedSubscriptions.length > 0) {
      const currencyCounts = loadedSubscriptions.reduce((acc, sub) => {
        acc[sub.currency] = (acc[sub.currency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostUsedCurrency = Object.entries(currencyCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      if (mostUsedCurrency) {
        savePrimaryCurrency(mostUsedCurrency);
      }
    }
  }, []);

  // Handler for adding a new subscription
  const handleAddSubscription = (subscription: Subscription) => {
    const updatedSubscriptions = addSubscription(subscription);
    setSubscriptions(updatedSubscriptions);
    toast.success(`Added ${subscription.name} subscription`);
  };

  // Handler for updating an existing subscription
  const handleUpdateSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  // Handler for saving edited subscription
  const handleSaveEdit = (subscription: Subscription) => {
    const updatedSubscriptions = updateSubscription(subscription);
    setSubscriptions(updatedSubscriptions);
    toast.success(`Updated ${subscription.name} subscription`);
    setEditingSubscription(undefined);
  };

  // Handler for deleting a subscription
  const handleDeleteSubscription = (id: string) => {
    const subscriptionToDelete = subscriptions.find(sub => sub.id === id);
    const updatedSubscriptions = deleteSubscription(id);
    setSubscriptions(updatedSubscriptions);
    if (subscriptionToDelete) {
      toast.success(`Deleted ${subscriptionToDelete.name} subscription`);
    }
  };

  const handleToggleHidden = (subscription: Subscription) => {
    const updatedSubscription = {
      ...subscription,
      hidden: !subscription.hidden
    };
    const updatedSubscriptions = updateSubscription(updatedSubscription);
    setSubscriptions(updatedSubscriptions);
  };

  return (
    <div className="space-y-8">
      {/* Welcome modal for new users */}
      <WelcomeModal />

      <div className="space-y-4">
        <CostSummaryCards
          subscriptions={subscriptions}
          primaryCurrency={primaryCurrency}
          exchangeRates={exchangeRates}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SubscriptionCharts
            subscriptions={subscriptions}
            primaryCurrency={primaryCurrency}
            exchangeRates={exchangeRates}
          />
        </div>

        <Separator className="my-6" />

        <div>
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Subscriptions</h2>
            <SubscriptionFormDialog
              onSubmit={handleAddSubscription}
              buttonLabel="Add Subscription"
              buttonSize="sm"
            />
          </header>
          <SubscriptionTable
            subscriptions={subscriptions}
            onUpdate={handleUpdateSubscription}
            onDelete={handleDeleteSubscription}
            onToggleHidden={handleToggleHidden}
            primaryCurrency={primaryCurrency}
            exchangeRates={exchangeRates}
          />
        </div>
      </div>

      {/* Edit subscription dialog */}
      <SubscriptionFormDialog
        subscription={editingSubscription}
        onSubmit={handleSaveEdit}
        buttonLabel="Save Changes"
        showTriggerButton={false}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}
