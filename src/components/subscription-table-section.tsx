"use client";

import { useState } from "react";
import { SubscriptionTable } from "@/components/subscription-table";
import { SubscriptionFormDialog } from "@/components/subscription-form-dialog";
import { useSubscriptions } from "@/components/subscription-context";
import { useCurrency } from "@/components/currency-context";
import { Subscription } from "@/lib/subscriptions";

export function SubscriptionTableSection() {
    const { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription, toggleHidden } = useSubscriptions();
    const { primaryCurrency, exchangeRates } = useCurrency();
    const [editingSubscription, setEditingSubscription] = useState<Subscription>();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleUpdateClick = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (subscription: Subscription) => {
        updateSubscription(subscription);
        setEditingSubscription(undefined);
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Subscriptions</h2>
                <SubscriptionFormDialog
                    onSubmit={addSubscription}
                    buttonLabel="Add Subscription"
                    buttonSize="sm"
                    className="float-right"
                />
            </header>
            <SubscriptionTable
                isLoading={isLoading}
                subscriptions={subscriptions}
                onUpdate={handleUpdateClick}
                onDelete={deleteSubscription}
                onToggleHidden={toggleHidden}
                primaryCurrency={primaryCurrency}
                exchangeRates={exchangeRates}
            />
            <SubscriptionFormDialog
                subscription={editingSubscription}
                onSubmit={handleSaveEdit}
                buttonLabel="Save Changes"
                showTriggerButton={false}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </>
    );
}