import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format options for currency display
 */
export type CurrencyFormatOptions = {
  /** Whether to show decimals (defaults to true) */
  showDecimals?: boolean;
  /** The locale to use for formatting (defaults to "en-US") */
  locale?: string;
  /** How to display the currency (symbol, code, or name) */
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
};

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  options?: CurrencyFormatOptions
): string {
  const {
    showDecimals = true,
    locale = "en-US",
    currencyDisplay = "narrowSymbol"
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    currencyDisplay: currencyDisplay,
  }).format(amount);
}

/**
 * Format a date as a readable string
 * @param dateString Date string to format
 * @param format Format type
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  format: "short" | "medium" | "long" = "medium"
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
  };

  return new Intl.DateTimeFormat("en-US", formatOptions[format]).format(date);
}

/**
 * Capitalize the first letter of each word in a string
 */
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Calculate percentage difference between two numbers
 */
export function calculatePercentageDifference(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Truncate string with ellipsis if longer than maxLength
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Check if client-side code is running
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
