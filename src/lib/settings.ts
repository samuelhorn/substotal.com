import { loadAppState, saveAppState } from "./storage";

// Keys for localStorage
export const CHART_VIEW_MODE_KEY = 'chart_view_mode';
export const TABLE_SORT_KEY = 'table_sort_settings';
export const PRIMARY_CURRENCY_KEY = 'primary_currency_preference';

export type ChartViewMode = 'monthly' | 'yearly';
export type TableSortSettings = {
    column: string;
    direction: 'asc' | 'desc';
};

export interface NotificationSettings {
    enabled: boolean;
    reminderDays: number;
}

// Helper functions to load and save settings
export function loadChartViewMode(): ChartViewMode {
    const state = loadAppState();
    return state.settings.chartViewMode;
}

export function saveChartViewMode(mode: ChartViewMode) {
    const state = loadAppState();
    state.settings.chartViewMode = mode;
    saveAppState(state);
}

export function loadTableSortSettings(): TableSortSettings | null {
    const state = loadAppState();
    return state.settings.tableSortSettings;
}

export function saveTableSortSettings(settings: TableSortSettings) {
    const state = loadAppState();
    state.settings.tableSortSettings = settings;
    saveAppState(state);
}

export function loadPrimaryCurrency(): string {
    const state = loadAppState();
    return state.settings.primaryCurrency;
}

export function savePrimaryCurrency(currency: string) {
    const state = loadAppState();
    state.settings.primaryCurrency = currency;
    saveAppState(state);
}

export function loadNotificationSettings(): NotificationSettings {
    const state = loadAppState();
    return state.settings.notifications;
}

export function saveNotificationSettings(settings: NotificationSettings) {
    const state = loadAppState();
    state.settings.notifications = settings;
    saveAppState(state);
}

export function requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
        return Promise.resolve(false);
    }
    
    // Only access Notification API properties if it exists
    const permission = "Notification" in window ? Notification.permission : "denied";
    
    if (permission === "granted") {
        return Promise.resolve(true);
    }
    
    if (permission === "denied") {
        return Promise.resolve(false);
    }
    
    // Make sure we only call requestPermission when the API exists
    if ("Notification" in window) {
        return Notification.requestPermission()
            .then(permission => permission === "granted");
    }
    
    return Promise.resolve(false);
}