// Common currency codes
export const CURRENCIES = [
    'USD', // US Dollar
    'EUR', // Euro 
    'GBP', // British Pound
    'JPY', // Japanese Yen
    'AUD', // Australian Dollar
    'CAD', // Canadian Dollar
    'CHF', // Swiss Franc
    'CNY', // Chinese Yuan
    'SEK', // Swedish Krona
    'NZD', // New Zealand Dollar
] as const;

export type Currency = typeof CURRENCIES[number];