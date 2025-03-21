'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    Subscription,
    loadSubscriptions as loadSubscriptionsFromStorage,
    addSubscription as addSubscriptionToStorage,
    updateSubscription as updateSubscriptionInStorage,
    deleteSubscription as deleteSubscriptionFromStorage,
} from "@/lib/subscriptions";
import { createClient } from "@/lib/supabase/client";
import { clearAppState, loadAppState } from "@/lib/storage";
import {
    loadPrimaryCurrency,
    savePrimaryCurrency,
    loadTableSortSettings,
    saveTableSortSettings,
    loadChartViewMode,
    saveChartViewMode,
    ChartViewMode,
    TableSortSettings
} from "@/lib/settings";
import { getExchangeRates } from "@/lib/currency";

// Add a flag to track if data has been migrated
const MIGRATION_COMPLETED_KEY = 'subtrack_migration_completed';

interface AppContextType {
    // Subscription data and methods
    subscriptions: Subscription[];
    isLoadingSubscriptions: boolean;
    addSubscription: (subscription: Subscription) => Promise<void>;
    updateSubscription: (subscription: Subscription) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    toggleHidden: (subscription: Subscription) => Promise<void>;

    // Currency data and methods
    primaryCurrency: string;
    setPrimaryCurrency: (currency: string) => Promise<void>;
    exchangeRates: Record<string, number>;
    isLoadingCurrency: boolean;

    // Table sort settings
    tableSortSettings: TableSortSettings | null;
    setTableSortSettings: (settings: TableSortSettings | null) => Promise<void>;

    // Chart view mode (monthly/yearly)
    chartViewMode: ChartViewMode;
    setChartViewMode: (mode: ChartViewMode) => Promise<void>;

    // User and migration data
    userId?: string | null;
    setMigrationCompleted: () => void;

    // Overall loading state
    isLoading: boolean;

    // Refresh data function
    refreshData: () => Promise<void>;

    // Data merging
    showMergePrompt: boolean;
    handleMergeData: (mergeOption: 'cloud' | 'local' | 'both') => Promise<void>;
    pendingLocalData: Subscription[];
    pendingCloudData: Subscription[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // Subscription state
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

    // Currency state
    const [primaryCurrency, setPrimaryCurrencyState] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);

    // Table sort settings state
    const [tableSortSettings, setTableSortSettingsState] = useState<TableSortSettings | null>(null);

    // Chart view mode state (monthly/yearly)
    const [chartViewMode, setChartViewModeState] = useState<ChartViewMode>("monthly");

    // User and migration state
    const [userId, setUserId] = useState<string | null>(null);

    // Add new state for data merge prompt
    const [showMergePrompt, setShowMergePrompt] = useState(false);
    const [pendingLocalData, setPendingLocalData] = useState<Subscription[]>([]);
    const [pendingCloudData, setPendingCloudData] = useState<Subscription[]>([]);

    const handleSetMigrationCompleted = useCallback(() => {
        localStorage.setItem(MIGRATION_COMPLETED_KEY, 'true');
    }, []);

    // Load currency settings
    const loadCurrencySettings = useCallback(async () => {
        setIsLoadingCurrency(true);
        try {
            // Load saved primary currency preference
            const savedCurrency = await loadPrimaryCurrency();
            if (savedCurrency) {
                setPrimaryCurrencyState(savedCurrency);
            }

            // Load exchange rates
            const rates = await getExchangeRates();
            setExchangeRates(rates);
        } catch (error) {
            console.error("Failed to load currency settings:", error);
            toast.error("Failed to load currency settings");
        } finally {
            setIsLoadingCurrency(false);
        }
    }, []);

    // Handle saving currency preference
    const handleSetPrimaryCurrency = useCallback(async (currency: string) => {
        setPrimaryCurrencyState(currency);
        try {
            await savePrimaryCurrency(currency);
        } catch (error) {
            console.error("Failed to save currency preference:", error);
            toast.error("Failed to save currency preference");
        }
    }, []);

    // Handle saving table sort settings
    const handleSetTableSortSettings = useCallback(async (settings: TableSortSettings | null) => {
        setTableSortSettingsState(settings);
        try {
            await saveTableSortSettings(settings);
        } catch (error) {
            console.error("Failed to save table sort settings:", error);
            toast.error("Failed to save table settings");
        }
    }, []);

    // Handle saving chart view mode
    const handleSetChartViewMode = useCallback(async (mode: ChartViewMode) => {
        setChartViewModeState(mode);
        try {
            await saveChartViewMode(mode);
        } catch (error) {
            console.error("Failed to save chart view mode:", error);
            toast.error("Failed to save chart view preference");
        }
    }, []);

    // Load data function that can be called when needed
    const loadData = useCallback(async () => {
        // Set both loading flags at the start
        setIsLoadingSubscriptions(true);
        setIsLoadingCurrency(true);

        try {
            const supabase = createClient();

            // Check if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            // Load settings in parallel but make sure to properly await them
            const currencyPromise = loadCurrencySettings();
            const sortSettingsPromise = loadTableSortSettings();
            const chartViewPromise = loadChartViewMode();

            // Wait for the settings to load
            await currencyPromise;
            const sortSettings = await sortSettingsPromise;
            setTableSortSettingsState(sortSettings);
            const viewMode = await chartViewPromise;
            setChartViewModeState(viewMode || "monthly");

            // Now load subscriptions
            if (user?.id) {
                // If user is logged in, check for existing Supabase data first
                const { data: userSubs, error } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                const localData = loadSubscriptionsFromStorage();
                const hasSupabaseData = userSubs && userSubs.length > 0;
                const hasLocalData = localData && localData.length > 0;

                // If user has Supabase data, use it
                if (hasSupabaseData) {
                    // Check if there's also local data that needs to be merged
                    if (hasLocalData) {
                        // We have both cloud and local data
                        // Instead of automatically merging, prompt the user
                        setPendingLocalData(localData);
                        setPendingCloudData(userSubs);
                        setShowMergePrompt(true);
                        // Load cloud data for now
                        setSubscriptions(userSubs);
                    } else {
                        // No local data, just use cloud data
                        setSubscriptions(userSubs);
                        handleSetMigrationCompleted();
                    }
                } else {
                    // No Supabase data - check for local data to migrate
                    if (hasLocalData) {
                        // We have local data, let's migrate it automatically
                        const subscriptionsToMigrate = localData.map(sub => ({
                            ...sub,
                            user_id: user.id
                        }));

                        // Migrate to Supabase
                        const { error: migrateError } = await supabase
                            .from('user_subscriptions')
                            .upsert(subscriptionsToMigrate);

                        if (migrateError) throw migrateError;

                        // Get settings from local storage as well
                        const appState = loadAppState();

                        // Migrate settings if any
                        if (Object.keys(appState.settings).length > 0) {
                            const { error: settingsError } = await supabase
                                .from('user_settings')
                                .upsert({
                                    user_id: user.id,
                                    ...appState.settings
                                }, {
                                    onConflict: 'user_id',
                                    ignoreDuplicates: false
                                });

                            if (settingsError) console.error('Settings migration error:', settingsError);
                        }

                        // Set the subscriptions and mark migration as complete
                        setSubscriptions(localData);
                        handleSetMigrationCompleted();
                        toast.success('Your data has been migrated to your account!');

                        // Cloud-first approach: Clear local storage after migration
                        clearAppState();
                    } else {
                        // No local data either, start fresh
                        setSubscriptions([]);
                        handleSetMigrationCompleted();
                    }
                }
            } else {
                // Not logged in - use local data
                const localData = loadSubscriptionsFromStorage();
                setSubscriptions(localData);
                // Reset merge prompt state when logged out
                setShowMergePrompt(false);
                setPendingLocalData([]);
                setPendingCloudData([]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load your data');
            // Fall back to local storage if Supabase fails
            const localData = loadSubscriptionsFromStorage();
            setSubscriptions(localData);
        } finally {
            // Always reset loading states
            setIsLoadingSubscriptions(false);
            setIsLoadingCurrency(false);
        }
    }, [handleSetMigrationCompleted, loadCurrencySettings]);

    // Add new function to handle data merging
    const handleMergeData = useCallback(async (mergeOption: 'cloud' | 'local' | 'both') => {
        if (!userId || (!pendingLocalData.length && !pendingCloudData.length)) {
            setShowMergePrompt(false);
            return;
        }

        try {
            const supabase = createClient();
            let finalSubscriptions: Subscription[] = [];

            if (mergeOption === 'cloud') {
                // Keep cloud data only
                finalSubscriptions = [...pendingCloudData];
            } else if (mergeOption === 'local') {
                // Replace cloud with local
                finalSubscriptions = pendingLocalData.map(sub => ({
                    ...sub,
                    user_id: userId
                }));

                // Update Supabase: first delete all existing subs
                await supabase
                    .from('user_subscriptions')
                    .delete()
                    .eq('user_id', userId);

                // Then insert the local ones
                const { error } = await supabase
                    .from('user_subscriptions')
                    .insert(finalSubscriptions);

                if (error) throw error;
            } else if (mergeOption === 'both') {
                // Merge both data sets
                // Create a Map to track existing subscriptions by ID
                const subMap = new Map<string, Subscription>();

                // Add cloud subs to the map first
                pendingCloudData.forEach(sub => {
                    subMap.set(sub.id, sub);
                });

                // Add or overwrite with local subs (with user_id)
                const localWithUserId = pendingLocalData.map(sub => ({
                    ...sub,
                    user_id: userId
                }));

                localWithUserId.forEach(sub => {
                    // Only add if it doesn't exist in cloud
                    if (!subMap.has(sub.id)) {
                        subMap.set(sub.id, sub);
                    }
                });

                finalSubscriptions = Array.from(subMap.values());

                // Update all subscriptions in Supabase
                // Using upsert to handle both updates and inserts
                const { error } = await supabase
                    .from('user_subscriptions')
                    .upsert(finalSubscriptions);

                if (error) throw error;
            }

            // Update local state
            setSubscriptions(finalSubscriptions);
            // Clear local storage since we've now merged/handled the data
            clearAppState();
            // Reset merge state
            setShowMergePrompt(false);
            setPendingLocalData([]);
            setPendingCloudData([]);

            toast.success('Subscription data synchronized successfully!');
            handleSetMigrationCompleted();
        } catch (error) {
            console.error('Error merging data:', error);
            toast.error('Failed to merge subscription data');
        }
    }, [userId, pendingLocalData, pendingCloudData, handleSetMigrationCompleted]);

    // Set up auth state listener and initial data load
    useEffect(() => {
        const supabase = createClient();

        // Initial data load once on mount
        loadData();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                // Load data on sign in
                loadData();
            } else if (event === 'SIGNED_OUT') {
                loadData();
            }
        });

        // Cleanup listener on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [loadData]);

    const handleAddSubscription = useCallback(async (subscription: Subscription) => {
        try {
            // Different behavior based on authentication status
            if (userId) {
                // CLOUD FIRST: For authenticated users, save directly to Supabase
                const supabase = createClient();
                const newSubscription = {
                    ...subscription,
                    user_id: userId
                };

                // Optimistic UI update
                setSubscriptions(prev => [...prev, newSubscription]);

                // Save to Supabase
                const { error } = await supabase
                    .from('user_subscriptions')
                    .insert([newSubscription]);

                if (error) {
                    // Rollback on error
                    setSubscriptions(prev => prev.filter(s => s.id !== subscription.id));
                    throw error;
                }

                toast.success(`Added ${subscription.name} subscription`);
            } else {
                // For unauthenticated users, save to local storage
                const updatedSubscriptions = addSubscriptionToStorage(subscription);
                setSubscriptions(updatedSubscriptions);
                toast.success(`Added ${subscription.name} subscription`);
            }
        } catch (error) {
            console.error('Error adding subscription:', error);
            toast.error('Failed to add subscription');
        }
    }, [userId]);

    const handleUpdateSubscription = useCallback(async (subscription: Subscription) => {
        // Store previous state for rollback
        const previousSubscriptions = [...subscriptions];

        try {
            if (userId) {
                // CLOUD FIRST: For authenticated users, update directly in Supabase
                const supabase = createClient();
                const updatedSubscription = {
                    ...subscription,
                    user_id: userId
                };

                // Optimistic UI update
                setSubscriptions(prev => prev.map(sub =>
                    sub.id === subscription.id ? updatedSubscription : sub
                ));

                // Update in Supabase
                const { error } = await supabase
                    .from('user_subscriptions')
                    .update(updatedSubscription)
                    .eq('id', subscription.id)
                    .eq('user_id', userId);

                if (error) {
                    // Rollback on error
                    setSubscriptions(previousSubscriptions);
                    throw error;
                }

                toast.success(`Updated ${subscription.name} subscription`);
            } else {
                // For unauthenticated users, update in local storage
                updateSubscriptionInStorage(subscription);
                setSubscriptions(prev => prev.map(sub =>
                    sub.id === subscription.id ? subscription : sub
                ));
                toast.success(`Updated ${subscription.name} subscription`);
            }
        } catch (error) {
            // Revert to previous state on error
            setSubscriptions(previousSubscriptions);
            console.error('Error updating subscription:', error);
            toast.error('Failed to update subscription');
        }
    }, [userId, subscriptions]);

    const handleDeleteSubscription = useCallback(async (id: string) => {
        // Store previous state for rollback
        const previousSubscriptions = [...subscriptions];

        try {
            if (userId) {
                // CLOUD FIRST: For authenticated users, delete directly from Supabase
                const supabase = createClient();

                // Optimistic UI update
                setSubscriptions(prev => prev.filter(sub => sub.id !== id));

                // Delete from Supabase
                const { error } = await supabase
                    .from('user_subscriptions')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', userId);

                if (error) {
                    // Rollback on error
                    setSubscriptions(previousSubscriptions);
                    throw error;
                }

                toast.success('Subscription deleted');
            } else {
                // For unauthenticated users, delete from local storage
                deleteSubscriptionFromStorage(id);
                setSubscriptions(prev => prev.filter(sub => sub.id !== id));
                toast.success('Subscription deleted');
            }
        } catch (error) {
            // Revert to previous state on error
            setSubscriptions(previousSubscriptions);
            console.error('Error deleting subscription:', error);
            toast.error('Failed to delete subscription');
        }
    }, [userId, subscriptions]);

    const handleToggleHidden = useCallback(async (subscription: Subscription) => {
        const updatedSubscription = {
            ...subscription,
            hidden: !subscription.hidden
        };

        // Store previous state for rollback
        const previousSubscriptions = [...subscriptions];

        try {
            if (userId) {
                // CLOUD FIRST: For authenticated users, update directly in Supabase
                const supabase = createClient();

                // Ensure user_id is set
                const cloudSubscription = {
                    ...updatedSubscription,
                    user_id: userId
                };

                // Optimistic UI update
                setSubscriptions(prev => prev.map(sub =>
                    sub.id === subscription.id ? updatedSubscription : sub
                ));

                // Update in Supabase
                const { error } = await supabase
                    .from('user_subscriptions')
                    .update(cloudSubscription)
                    .eq('id', subscription.id)
                    .eq('user_id', userId);

                if (error) {
                    // Rollback on error
                    setSubscriptions(previousSubscriptions);
                    throw error;
                }
            } else {
                // For unauthenticated users, update in local storage
                updateSubscriptionInStorage(updatedSubscription);
                setSubscriptions(prev => prev.map(sub =>
                    sub.id === subscription.id ? updatedSubscription : sub
                ));
            }
        } catch (error) {
            // Revert to previous state on error
            setSubscriptions(previousSubscriptions);
            console.error('Error toggling subscription visibility:', error);
            toast.error('Failed to update subscription');
        }
    }, [userId, subscriptions]);

    return (
        <AppContext.Provider
            value={{
                // Subscription data and methods
                subscriptions,
                isLoadingSubscriptions,
                addSubscription: handleAddSubscription,
                updateSubscription: handleUpdateSubscription,
                deleteSubscription: handleDeleteSubscription,
                toggleHidden: handleToggleHidden,

                // Currency data and methods
                primaryCurrency,
                setPrimaryCurrency: handleSetPrimaryCurrency,
                exchangeRates,
                isLoadingCurrency,

                // Table sort settings
                tableSortSettings,
                setTableSortSettings: handleSetTableSortSettings,

                // Chart view mode
                chartViewMode,
                setChartViewMode: handleSetChartViewMode,

                // User and migration data
                userId,
                setMigrationCompleted: handleSetMigrationCompleted,

                // Data merging
                showMergePrompt,
                handleMergeData,
                pendingLocalData,
                pendingCloudData,

                // Overall loading state
                isLoading: isLoadingSubscriptions || isLoadingCurrency,

                // Function to manually refresh data
                refreshData: loadData
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Helper hooks to access specific parts of the context
export function useSubscriptions() {
    const {
        subscriptions,
        isLoadingSubscriptions: isLoading,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleHidden,
        userId,
        setMigrationCompleted,
        showMergePrompt,
        handleMergeData,
        pendingLocalData,
        pendingCloudData,
        refreshData
    } = useApp();

    return {
        subscriptions,
        isLoading,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleHidden,
        userId,
        setMigrationCompleted,
        showMergePrompt,
        handleMergeData,
        pendingLocalData,
        pendingCloudData,
        refreshData
    };
}

export function useCurrency() {
    const { primaryCurrency, setPrimaryCurrency, exchangeRates, isLoadingCurrency } = useApp();

    return {
        primaryCurrency,
        setPrimaryCurrency,
        exchangeRates,
        isLoading: isLoadingCurrency
    };
}

export function useTableSort() {
    const { tableSortSettings, setTableSortSettings } = useApp();

    return {
        tableSortSettings,
        setTableSortSettings
    };
}

export function useChartView() {
    const { chartViewMode, setChartViewMode } = useApp();

    return {
        chartViewMode,
        setChartViewMode
    };
}