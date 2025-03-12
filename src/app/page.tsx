"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SubscriptionFormDialog } from "@/components/subscription-form-dialog";
import { SubscriptionTable } from "@/components/subscription-table";
import { CostSummaryCards } from "@/components/cost-summary-cards";
import { SubscriptionCharts } from "@/components/subscription-charts";
import { Separator } from "@/components/ui/separator";
import { CurrencySelect } from "@/components/currency-select";
import {
  Subscription,
  loadSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription
} from "@/lib/subscriptions";
import { getExchangeRates, PRIMARY_CURRENCY_KEY } from "@/lib/currency";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [primaryCurrency, setPrimaryCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [editingSubscription, setEditingSubscription] = useState<Subscription>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const loadedSubscriptions = loadSubscriptions();
    setSubscriptions(loadedSubscriptions);

    // Load saved primary currency preference or determine from subscriptions
    const savedCurrency = localStorage.getItem(PRIMARY_CURRENCY_KEY);
    if (savedCurrency) {
      setPrimaryCurrency(savedCurrency);
    } else if (loadedSubscriptions.length > 0) {
      const currencyCounts = loadedSubscriptions.reduce((acc, sub) => {
        acc[sub.currency] = (acc[sub.currency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostUsedCurrency = Object.entries(currencyCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      if (mostUsedCurrency) {
        setPrimaryCurrency(mostUsedCurrency);
        localStorage.setItem(PRIMARY_CURRENCY_KEY, mostUsedCurrency);
      }
    }

    // Load exchange rates
    getExchangeRates().then(rates => {
      setExchangeRates(rates);
    }).catch(error => {
      console.error('Failed to load exchange rates:', error);
      toast.error('Failed to load currency exchange rates');
    });
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

  const handleCurrencyChange = (currency: string) => {
    setPrimaryCurrency(currency);
    localStorage.setItem(PRIMARY_CURRENCY_KEY, currency);
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
    <main className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your recurring expenses
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <CurrencySelect
            value={primaryCurrency}
            onValueChange={handleCurrencyChange}
          />
          <SubscriptionFormDialog
            onSubmit={handleAddSubscription}
            buttonLabel="Add Subscription"
          />
        </div>
      </header>

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
    </main>
  );
}
