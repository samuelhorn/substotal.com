import { z } from "zod";
import { convertAmount } from "./currency";

// Define the subscription schema
export const subscriptionSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    amount: z.number().positive("Amount must be positive"),
    frequency: z.enum(["monthly", "yearly"]),
    startDate: z.string(),
    commitmentEndDate: z.string().optional(),
    category: z.string(),
    currency: z.string().default("USD"),
    url: z.string().url("Invalid URL").optional(),
    hidden: z.boolean().default(false),
});

// Define the Subscription type
export type Subscription = z.infer<typeof subscriptionSchema>;

// Key for localStorage
const STORAGE_KEY = "subscription_tracker_data";

// Function to load subscriptions from localStorage
export function loadSubscriptions(): Subscription[] {
    if (typeof window === "undefined") return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        const subscriptions = JSON.parse(data);
        return Array.isArray(subscriptions) ? subscriptions : [];
    } catch (error) {
        console.error("Failed to load subscriptions from localStorage:", error);
        return [];
    }
}

// Function to save subscriptions to localStorage
export function saveSubscriptions(subscriptions: Subscription[]): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch (error) {
        console.error("Failed to save subscriptions to localStorage:", error);
    }
}

// Function to add a new subscription
export function addSubscription(subscription: Subscription): Subscription[] {
    const subscriptions = loadSubscriptions();
    const updatedSubscriptions = [...subscriptions, subscription];
    saveSubscriptions(updatedSubscriptions);
    return updatedSubscriptions;
}

// Function to update an existing subscription
export function updateSubscription(updatedSubscription: Subscription): Subscription[] {
    const subscriptions = loadSubscriptions();
    const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
    );
    saveSubscriptions(updatedSubscriptions);
    return updatedSubscriptions;
}

// Function to delete a subscription
export function deleteSubscription(id: string): Subscription[] {
    const subscriptions = loadSubscriptions();
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    saveSubscriptions(updatedSubscriptions);
    return updatedSubscriptions;
}

// Function to get a subscription by ID
export function getSubscriptionById(id: string): Subscription | undefined {
    const subscriptions = loadSubscriptions();
    return subscriptions.find(sub => sub.id === id);
}

// Helper function to calculate monthly cost with currency conversion
export function calculateMonthlyCost(subscription: Subscription, targetCurrency?: string, rates?: Record<string, number>): number {
    const baseAmount = subscription.frequency === "monthly"
        ? subscription.amount
        : subscription.amount / 12;

    if (targetCurrency && rates && targetCurrency !== subscription.currency) {
        return convertAmount(baseAmount, subscription.currency, targetCurrency, rates);
    }
    return baseAmount;
}

// Helper function to calculate yearly cost with currency conversion
export function calculateYearlyCost(subscription: Subscription, targetCurrency?: string, rates?: Record<string, number>): number {
    const baseAmount = subscription.frequency === "yearly"
        ? subscription.amount
        : subscription.amount * 12;

    if (targetCurrency && rates && targetCurrency !== subscription.currency) {
        return convertAmount(baseAmount, subscription.currency, targetCurrency, rates);
    }
    return baseAmount;
}

// Helper function to filter out hidden subscriptions
function filterHiddenSubscriptions(subscriptions: Subscription[]): Subscription[] {
    return subscriptions.filter(sub => !sub.hidden);
}

// Calculate total monthly cost in target currency
export function calculateTotalMonthlyCost(subscriptions: Subscription[], targetCurrency?: string, rates?: Record<string, number>): number {
    return filterHiddenSubscriptions(subscriptions).reduce(
        (total, sub) => total + calculateMonthlyCost(sub, targetCurrency, rates),
        0
    );
}

// Calculate total yearly cost in target currency
export function calculateTotalYearlyCost(subscriptions: Subscription[], targetCurrency?: string, rates?: Record<string, number>): number {
    return filterHiddenSubscriptions(subscriptions).reduce(
        (total, sub) => total + calculateYearlyCost(sub, targetCurrency, rates),
        0
    );
}

// Calculate locked-in costs in target currency
export function calculateLockedInCost(subscriptions: Subscription[], targetCurrency?: string, rates?: Record<string, number>): number {
    const today = new Date();

    return filterHiddenSubscriptions(subscriptions)
        .filter(sub => {
            if (!sub.commitmentEndDate) return false;
            const endDate = new Date(sub.commitmentEndDate);
            return endDate > today;
        })
        .reduce((total, sub) => {
            const endDate = new Date(sub.commitmentEndDate!);
            const monthsLeft = (endDate.getFullYear() - today.getFullYear()) * 12 +
                (endDate.getMonth() - today.getMonth());

            let amount;
            if (sub.frequency === "monthly") {
                amount = sub.amount * Math.max(0, monthsLeft);
            } else {
                // For yearly, calculate the remaining amount
                const monthlyAmount = sub.amount / 12;
                amount = monthlyAmount * Math.max(0, monthsLeft);
            }

            if (targetCurrency && rates && targetCurrency !== sub.currency) {
                amount = convertAmount(amount, sub.currency, targetCurrency, rates);
            }
            return total + amount;
        }, 0);
}

// Get categories from subscriptions
export function getCategories(subscriptions: Subscription[]): string[] {
    const categories = new Set<string>();
    subscriptions.forEach(sub => {
        if (sub.category) categories.add(sub.category);
    });
    return Array.from(categories);
}

// Get subscriptions by category
export function getSubscriptionsByCategory(subscriptions: Subscription[]): Record<string, Subscription[]> {
    return filterHiddenSubscriptions(subscriptions).reduce((acc, sub) => {
        const category = sub.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(sub);
        return acc;
    }, {} as Record<string, Subscription[]>);
}

// Get upcoming payments in the next 30 days
export function getUpcomingPayments(subscriptions: Subscription[], days: number = 30): { date: Date; subscription: Subscription; amount: number }[] {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    const payments: { date: Date; subscription: Subscription; amount: number }[] = [];

    filterHiddenSubscriptions(subscriptions).forEach(sub => {
        const startDate = new Date(sub.startDate);
        let nextPayment = new Date(startDate);

        // Find the next payment date after today
        while (nextPayment < today) {
            if (sub.frequency === "monthly") {
                nextPayment.setMonth(nextPayment.getMonth() + 1);
            } else {
                nextPayment.setFullYear(nextPayment.getFullYear() + 1);
            }
        }

        // Add all payments within the time window
        while (nextPayment <= endDate) {
            payments.push({
                date: new Date(nextPayment),
                subscription: sub,
                amount: sub.amount
            });

            if (sub.frequency === "monthly") {
                nextPayment.setMonth(nextPayment.getMonth() + 1);
            } else {
                nextPayment.setFullYear(nextPayment.getFullYear() + 1);
            }
        }
    });

    return payments.sort((a, b) => a.date.getTime() - b.date.getTime());
}