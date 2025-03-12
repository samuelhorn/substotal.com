import { Subscription } from "./subscriptions";
import { ChartViewMode, TableSortSettings } from "./settings";

export interface AppState {
    subscriptions: Subscription[];
    settings: {
        chartViewMode: ChartViewMode;
        tableSortSettings: TableSortSettings | null;
        primaryCurrency: string;
        notifications: {
            enabled: boolean;
            reminderDays: number;
        };
    };
}

const STORAGE_KEY = 'subtrack_app_state';

export function loadAppState(): AppState {
    const defaultState: AppState = {
        subscriptions: [],
        settings: {
            chartViewMode: 'monthly',
            tableSortSettings: null,
            primaryCurrency: 'USD',
            notifications: {
                enabled: false,
                reminderDays: 0
            }
        }
    };

    if (typeof window === 'undefined') {
        return defaultState;
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return defaultState;
        }

        const savedState = JSON.parse(data);

        // Ensure notifications settings exist by merging with defaults
        const migratedState: AppState = {
            ...defaultState,
            ...savedState,
            settings: {
                ...defaultState.settings,
                ...savedState.settings,
                notifications: {
                    ...defaultState.settings.notifications,
                    ...(savedState.settings?.notifications || {})
                }
            }
        };

        return migratedState;
    } catch (error) {
        console.error("Failed to load app state from localStorage:", error);
        return defaultState;
    }
}

export function saveAppState(state: AppState): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save app state to localStorage:", error);
    }
}

export function exportAppState(): string {
    const state = loadAppState();
    return JSON.stringify(state);
}

export function importAppState(jsonString: string): boolean {
    try {
        const state = JSON.parse(jsonString);
        // Basic validation that the imported data has the right shape
        if (!state.subscriptions || !state.settings) {
            throw new Error('Invalid app state format');
        }
        saveAppState(state);
        return true;
    } catch (error) {
        console.error("Failed to import app state:", error);
        return false;
    }
}