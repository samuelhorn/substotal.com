import { ChartViewMode, TableSortSettings } from "./settings";

export interface UserSettings {
    id?: string;
    user_id: string;
    chart_view_mode: ChartViewMode;
    table_sort_settings_column: string | null;
    table_sort_settings_direction: 'asc' | 'desc' | null;
    primary_currency: string;
    notifications_enabled: boolean;
    notifications_reminder_days: number;
    created_at?: string;
    updated_at?: string;
}

export const defaultSettings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
    chart_view_mode: 'monthly',
    table_sort_settings_column: null,
    table_sort_settings_direction: null,
    primary_currency: 'USD',
    notifications_enabled: false,
    notifications_reminder_days: 0
};