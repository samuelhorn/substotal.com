// Keys for localStorage
export const CHART_VIEW_MODE_KEY = 'chart_view_mode';
export const TABLE_SORT_KEY = 'table_sort_settings';
export const PRIMARY_CURRENCY_KEY = 'primary_currency_preference';

export type ChartViewMode = 'monthly' | 'yearly';
export type TableSortSettings = {
    column: string;
    direction: 'asc' | 'desc';
};

// Helper functions to load and save settings
export function loadChartViewMode(): ChartViewMode {
    if (typeof window === 'undefined') return 'monthly';
    return (localStorage.getItem(CHART_VIEW_MODE_KEY) as ChartViewMode) || 'monthly';
}

export function saveChartViewMode(mode: ChartViewMode) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CHART_VIEW_MODE_KEY, mode);
}

export function loadTableSortSettings(): TableSortSettings | null {
    if (typeof window === 'undefined') return null;
    const settings = localStorage.getItem(TABLE_SORT_KEY);
    return settings ? JSON.parse(settings) : null;
}

export function saveTableSortSettings(settings: TableSortSettings) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TABLE_SORT_KEY, JSON.stringify(settings));
}

export function loadPrimaryCurrency(): string {
    if (typeof window === 'undefined') return 'USD';
    return localStorage.getItem(PRIMARY_CURRENCY_KEY) || 'USD';
}

export function savePrimaryCurrency(currency: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PRIMARY_CURRENCY_KEY, currency);
}