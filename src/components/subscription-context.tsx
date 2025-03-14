"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    Subscription,
    loadSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
} from "@/lib/subscriptions";

interface SubscriptionContextType {
    subscriptions: Subscription[];
    isLoading: boolean;
    addSubscription: (subscription: Subscription) => void;
    updateSubscription: (subscription: Subscription) => void;
    deleteSubscription: (id: string) => void;
    toggleHidden: (subscription: Subscription) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load subscriptions on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Adding a small delay to show skeleton during initial load
                // await new Promise((resolve) => setTimeout(resolve, 200));
                const data = loadSubscriptions();
                setSubscriptions(data);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAddSubscription = useCallback((subscription: Subscription) => {
        const updatedSubscriptions = addSubscription(subscription);
        setSubscriptions(updatedSubscriptions);
        toast.success(`Added ${subscription.name} subscription`);
    }, []);

    const handleUpdateSubscription = useCallback((subscription: Subscription) => {
        const updatedSubscriptions = updateSubscription(subscription);
        setSubscriptions(updatedSubscriptions);
        toast.success(`Updated ${subscription.name} subscription`);
    }, []);

    const handleDeleteSubscription = useCallback((id: string) => {
        const subscriptionToDelete = subscriptions.find((sub) => sub.id === id);
        const updatedSubscriptions = deleteSubscription(id);
        setSubscriptions(updatedSubscriptions);

        if (subscriptionToDelete) {
            toast.success(`Deleted ${subscriptionToDelete.name} subscription`);
        }
    }, [subscriptions]);

    const handleToggleHidden = useCallback((subscription: Subscription) => {
        const updatedSubscription = {
            ...subscription,
            hidden: !subscription.hidden,
        };
        const updatedSubscriptions = updateSubscription(updatedSubscription);
        setSubscriptions(updatedSubscriptions);
    }, []);

    const value = {
        subscriptions,
        isLoading,
        addSubscription: handleAddSubscription,
        updateSubscription: handleUpdateSubscription,
        deleteSubscription: handleDeleteSubscription,
        toggleHidden: handleToggleHidden,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error("useSubscriptions must be used within a SubscriptionProvider");
    }
    return context;
}