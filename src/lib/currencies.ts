// Common currency codes ordered by global trading volume and popularity
export const CURRENCIES = [
    'USD', // US Dollar (most traded globally)
    'EUR', // Euro (2nd most traded)
    'JPY', // Japanese Yen (3rd most traded)
    'GBP', // British Pound (4th most traded)
    'CNY', // Chinese Yuan (increasingly important)
    'AUD', // Australian Dollar
    'CAD', // Canadian Dollar
    'CHF', // Swiss Franc
    'HKD', // Hong Kong Dollar
    'SEK', // Swedish Krona
    'SGD', // Singapore Dollar
    'KRW', // South Korean Won
    'NZD', // New Zealand Dollar
    'INR', // Indian Rupee
    'BRL', // Brazilian Real
    'MXN', // Mexican Peso
    'NOK', // Norwegian Krone
    'DKK', // Danish Krone
    'PLN', // Polish Złoty
    'ZAR'  // South African Rand
] as const;

export const CURRENCY_COUNTRY_CODES: Record<Currency, string> = {
    USD: 'US',
    EUR: 'EU',
    JPY: 'JP',
    GBP: 'GB',
    CNY: 'CN',
    AUD: 'AU',
    CAD: 'CA',
    CHF: 'CH',
    HKD: 'HK',
    SEK: 'SE',
    SGD: 'SG',
    KRW: 'KR',
    NZD: 'NZ',
    INR: 'IN',
    BRL: 'BR',
    MXN: 'MX',
    NOK: 'NO',
    DKK: 'DK',
    PLN: 'PL',
    ZAR: 'ZA'
};

export type Currency = typeof CURRENCIES[number];