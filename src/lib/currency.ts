import { PRIMARY_CURRENCY_KEY } from './settings'

// Cache exchange rates for 24 hours
const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface ExchangeRates {
    rates: Record<string, number>;
    timestamp: number;
}

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { rates, timestamp } = JSON.parse(cached) as ExchangeRates;
        if (Date.now() - timestamp < CACHE_DURATION) {
            return rates;
        }
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();

        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            rates: data.rates,
            timestamp: Date.now()
        }));

        return data.rates;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Return cached data even if expired, or 1:1 conversion as fallback
        if (cached) {
            const { rates } = JSON.parse(cached) as ExchangeRates;
            return rates;
        }
        return { [baseCurrency]: 1 };
    }
}

export function convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>): number {
    if (fromCurrency === toCurrency) return amount;
    if (!rates[fromCurrency] || !rates[toCurrency]) return amount;

    // Convert to USD first (base currency of the API), then to target currency
    const amountInUSD = amount / rates[fromCurrency];
    return amountInUSD * rates[toCurrency];
}