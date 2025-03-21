import { loadAppState, loadAppStateAsync, saveAppState, saveAppStateAsync } from "./storage";
import { createClient } from "./supabase/client";

export type ChartViewMode = 'monthly' | 'yearly';

export type TableSortSettings = {
    column: string;
    direction: 'asc' | 'desc';
};

// Helper functions to load and save settings
export async function loadChartViewMode(): Promise<ChartViewMode> {
    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Load state from Supabase if user is logged in, otherwise from local storage
    const state = user ? await loadAppStateAsync(user.id) : loadAppState();
    return state.settings.chart_view_mode || 'monthly';
}

export async function saveChartViewMode(mode: ChartViewMode) {
    const state = loadAppState();
    state.settings.chart_view_mode = mode;
    saveAppState(state);

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Also save to Supabase if user is logged in
        await saveAppStateAsync(state, user.id);
    }
}

export async function loadTableSortSettings(): Promise<TableSortSettings | null> {
    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Load state from Supabase if user is logged in, otherwise from local storage
    const state = user ? await loadAppStateAsync(user.id) : loadAppState();
    if (!state.settings.table_sort_settings_column || !state.settings.table_sort_settings_direction) {
        return null;
    }
    return {
        column: state.settings.table_sort_settings_column,
        direction: state.settings.table_sort_settings_direction
    };
}

export async function saveTableSortSettings(settings: TableSortSettings | null) {
    const state = loadAppState();
    if (settings) {
        state.settings.table_sort_settings_column = settings.column;
        state.settings.table_sort_settings_direction = settings.direction;
    } else {
        state.settings.table_sort_settings_column = null;
        state.settings.table_sort_settings_direction = null;
    }
    saveAppState(state);

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Also save to Supabase if user is logged in
        await saveAppStateAsync(state, user.id);
    }
}

export async function loadPrimaryCurrency(): Promise<string> {
    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Load state from Supabase if user is logged in, otherwise from local storage
    const state = user ? await loadAppStateAsync(user.id) : loadAppState();
    return state.settings.primary_currency;
}

export async function savePrimaryCurrency(currency: string) {
    const state = loadAppState();
    state.settings.primary_currency = currency;
    saveAppState(state);

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Also save to Supabase if user is logged in
        await saveAppStateAsync(state, user.id);
    }
}

export async function loadNotificationSettings() {
    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Load state from Supabase if user is logged in, otherwise from local storage
    const state = user ? await loadAppStateAsync(user.id) : loadAppState();
    return {
        enabled: state.settings.notifications_enabled,
        reminderDays: state.settings.notifications_reminder_days
    };
}

export async function saveNotificationSettings(settings: { enabled: boolean; reminderDays: number }) {
    const state = loadAppState();
    state.settings.notifications_enabled = settings.enabled;
    state.settings.notifications_reminder_days = settings.reminderDays;
    saveAppState(state);

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Also save to Supabase if user is logged in
        await saveAppStateAsync(state, user.id);
    }
}