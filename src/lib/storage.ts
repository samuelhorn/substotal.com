import { Subscription } from "./subscriptions";
import { UserSettings, defaultSettings } from "./settings-keys";
import { createClient } from "./supabase/supabase";

export interface AppState {
    subscriptions: Subscription[];
    settings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
}

const STORAGE_KEY = 'subtrack_app_state';

/**
 * Validates that required Supabase tables exist
 */
async function validateSupabaseTables() {
    try {
        const supabase = createClient();

        // Check if tables exist by trying to get their structure
        const { error: subsTableError } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .limit(1);

        const { error: settingsTableError } = await supabase
            .from('user_settings')
            .select('user_id')
            .limit(1);

        // Return validation results
        return {
            userSubscriptionsExists: !subsTableError,
            userSettingsExists: !settingsTableError,
            subsError: subsTableError,
            settingsError: settingsTableError
        };
    } catch (error) {
        console.error("Failed to validate Supabase tables:", error);
        return {
            userSubscriptionsExists: false,
            userSettingsExists: false,
            error
        };
    }
}

/**
 * Loads app state, optionally trying to fetch from Supabase if a userId is provided
 */
export async function loadAppStateAsync(userId?: string): Promise<AppState> {
    // If we're in a server context or no window is available
    if (typeof window === 'undefined') {
        return { subscriptions: [], settings: defaultSettings };
    }

    // If we have a userId, try to load from Supabase
    if (userId) {
        try {
            const supabase = createClient();

            // Validate tables exist before proceeding
            const validation = await validateSupabaseTables();
            if (!validation.userSubscriptionsExists || !validation.userSettingsExists) {
                console.error("Supabase tables validation failed:", validation);
                throw new Error("Required Supabase tables don't exist or are inaccessible");
            }

            // Get subscriptions
            const { data: subscriptions, error: subsError } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', userId);
            if (subsError) throw subsError;

            // Get settings
            const { data: settings, error: settingsError } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();

            // For settings, we want to handle "no records" differently than other errors
            if (settingsError && settingsError.code !== 'PGRST116') {
                throw settingsError;
            }

            // If we successfully retrieved data from Supabase, mark migration as completed
            // This ensures that if a user clears local storage and signs in again,
            // we'll properly recognize their cloud data
            if ((subscriptions && subscriptions.length > 0) || settings) {
                localStorage.setItem('subtrack_migration_completed', 'true');
            }

            // Return combined state, preferring Supabase data over local
            return {
                subscriptions: subscriptions || [],
                settings: settings ? {
                    chart_view_mode: settings.chart_view_mode,
                    table_sort_settings_column: settings.table_sort_settings_column,
                    table_sort_settings_direction: settings.table_sort_settings_direction,
                    primary_currency: settings.primary_currency,
                    notifications_enabled: settings.notifications_enabled,
                    notifications_reminder_days: settings.notifications_reminder_days
                } : defaultSettings
            };
        } catch (error) {
            console.error("Failed to load app state from Supabase:", JSON.stringify(error, null, 2));
            // Only fall back to local storage if migration is not completed
            if (!localStorage.getItem('subtrack_migration_completed')) {
                return loadAppState();
            }
            // If migration is completed but Supabase failed, return empty state
            return { subscriptions: [], settings: defaultSettings };
        }
    }

    // Load from localStorage as fallback
    return loadAppState();
}

/**
 * Loads app state from local storage (synchronous version)
 */
export function loadAppState(): AppState {
    if (typeof window === 'undefined') {
        return { subscriptions: [], settings: defaultSettings };
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return { subscriptions: [], settings: defaultSettings };
        }

        const savedState = JSON.parse(data);
        // Ensure all settings exist by merging with defaults
        return {
            ...savedState,
            settings: {
                ...defaultSettings,
                ...savedState.settings,
                // Convert old format to new format if needed
                ...(savedState.settings?.tableSortSettings && {
                    table_sort_settings_column: savedState.settings.tableSortSettings.column,
                    table_sort_settings_direction: savedState.settings.tableSortSettings.direction
                }),
                ...(savedState.settings?.notifications && {
                    notifications_enabled: savedState.settings.notifications.enabled,
                    notifications_reminder_days: savedState.settings.notifications.reminderDays
                })
            }
        };
    } catch (error) {
        console.error("Failed to load app state from localStorage:", error);
        return { subscriptions: [], settings: defaultSettings };
    }
}

/**
 * Saves app state, optionally to Supabase if a userId is provided
 */
export async function saveAppStateAsync(state: AppState, userId?: string): Promise<void> {
    // Always save locally first
    saveAppState(state);

    // If userId is provided, sync with Supabase
    if (userId) {
        const supabase = createClient();

        try {
            // First load existing Supabase state to ensure we're not losing data
            const { data: existingSubscriptions } = await supabase
                .from('user_subscriptions')
                .select('id, user_id')
                .eq('user_id', userId);

            const existingIds = new Set((existingSubscriptions || []).map(sub => sub.id));

            // Handle subscriptions sync - only if there are subscriptions to sync
            // CRITICAL FIX: Don't delete all records if local state is empty
            if (state.subscriptions.length > 0) {
                // Find subscriptions we need to create or update
                const subscriptionsToUpsert = state.subscriptions.map(sub => ({
                    ...sub,
                    user_id: userId
                }));

                // Find IDs that exist in DB but not in current state (to be deleted)
                // Using Array.from() for better compatibility
                const idsToDelete = Array.from(existingIds).filter(id =>
                    !state.subscriptions.some(sub => sub.id === id)
                );

                // Upsert subscriptions
                if (subscriptionsToUpsert.length > 0) {
                    const { error: upsertError } = await supabase
                        .from('user_subscriptions')
                        .upsert(subscriptionsToUpsert, {
                            onConflict: 'id',
                            ignoreDuplicates: false
                        });
                    if (upsertError) throw upsertError;
                }

                // Delete removed subscriptions - only if we have something in our state
                if (idsToDelete.length > 0) {
                    const { error: deleteError } = await supabase
                        .from('user_subscriptions')
                        .delete()
                        .in('id', idsToDelete);
                    if (deleteError) throw deleteError;
                }
            } else if (hasMigrationCompleted() && existingSubscriptions?.length === 0) {
                // Only sync empty state if migration is completed AND there are no existing subscriptions
                // This prevents accidentally deleting all data on first sign-in
                console.log("State is empty, but not deleting existing data as a precaution");
            }

            // Upsert settings - always sync settings even if subscriptions are empty
            if (Object.keys(state.settings).length > 0) {
                const settingsToUpsert = {
                    user_id: userId,
                    chart_view_mode: state.settings.chart_view_mode || defaultSettings.chart_view_mode,
                    table_sort_settings_column: state.settings.table_sort_settings_column,
                    table_sort_settings_direction: state.settings.table_sort_settings_direction,
                    primary_currency: state.settings.primary_currency || defaultSettings.primary_currency,
                    notifications_enabled: state.settings.notifications_enabled,
                    notifications_reminder_days: state.settings.notifications_reminder_days
                };

                const { error: settingsError } = await supabase
                    .from('user_settings')
                    .upsert(settingsToUpsert, {
                        onConflict: 'user_id',
                        ignoreDuplicates: false
                    });
                if (settingsError) throw settingsError;
            }
        } catch (error) {
            console.error('Error saving state to Supabase:', error);
            throw error;
        }
    }
}

/**
 * Saves app state to localStorage (synchronous version)
 */
export function saveAppState(state: AppState): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save app state to localStorage:", error);
    }
}

/**
 * Clears all app state from storage
 */
export function clearAppState(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export app state as a JSON string
 */
export function exportAppState(): string {
    const state = loadAppState();
    return JSON.stringify(state, null, 2);
}

/**
 * Import app state from a JSON string
 * Returns true if successful, false otherwise
 */
export function importAppState(jsonData: string): boolean {
    try {
        const state = JSON.parse(jsonData);

        // Validate basic structure
        if (!state || typeof state !== 'object') {
            return false;
        }

        // Validate required properties
        if (!Array.isArray(state.subscriptions) || !state.settings) {
            return false;
        }

        // Validate subscriptions structure
        for (const sub of state.subscriptions) {
            if (!sub.id || !sub.name || !sub.amount || !sub.currency || !sub.cycle) {
                return false;
            }
        }

        // Merge with default settings to ensure all required settings exist
        const importedState: AppState = {
            subscriptions: state.subscriptions,
            settings: {
                ...defaultSettings,
                ...state.settings
            }
        };

        // Save the imported state
        saveAppState(importedState);
        return true;
    } catch (error) {
        console.error('Error importing app state:', error);
        return false;
    }
}

/**
 * Check if there is local data that can be migrated to the cloud
 */
export function hasMigratableData(): boolean {
    try {
        // If migration is already completed, there's no data to migrate
        if (localStorage.getItem('subtrack_migration_completed') === 'true') {
            return false;
        }

        // Only check for migratable data if migration hasn't been completed
        const state = loadAppState();
        return state.subscriptions.length > 0 || Object.keys(state.settings).length > 0;
    } catch {
        return false;
    }
}

/**
 * Check if migration has been completed
 */
export function hasMigrationCompleted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('subtrack_migration_completed') === 'true';
}