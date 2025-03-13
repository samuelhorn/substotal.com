import { z } from "zod";
import { convertAmount } from "./currency";
import { loadAppState, saveAppState } from "./storage";

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
    url: z.string().url("Invalid URL").optional().nullable(),
    hidden: z.boolean().default(false),
});

// Define the Subscription type
export type Subscription = z.infer<typeof subscriptionSchema>;

// Function to load subscriptions from storage
export function loadSubscriptions(): Subscription[] {
    const state = loadAppState();
    return state.subscriptions;
}

// Function to save subscriptions to storage
function saveSubscriptions(subscriptions: Subscription[]): void {
    const state = loadAppState();
    state.subscriptions = subscriptions;
    saveAppState(state);
}

// Function to add a new subscription
export function addSubscription(subscription: Subscription): Subscription[] {
    const subscriptions = loadSubscriptions();
    const updatedSubscriptions = [...subscriptions, subscription];
    saveSubscriptions(updatedSubscriptions);
    return updatedSubscriptions;
}

// Function to generate test subscription data
export function generateTestData(): Subscription[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inTwoDays = new Date();
    inTwoDays.setDate(inTwoDays.getDate() + 2);
    const inFiveDays = new Date();
    inFiveDays.setDate(inFiveDays.getDate() + 5);

    // Create three subscriptions in different categories
    const testSubscriptions: Subscription[] = [
        {
            id: `test-${Date.now()}-1`,
            name: "PlayStation Plus Extra",
            amount: 14.99,
            frequency: "monthly",
            startDate: tomorrow.toISOString(),
            category: "Gaming",
            currency: "USD",
            url: "https://playstation.com",
            hidden: false
        },
        {
            id: `test-${Date.now()}-2`,
            name: "Spotify Premium",
            amount: 9.99,
            frequency: "monthly",
            startDate: inTwoDays.toISOString(),
            category: "Music",
            currency: "USD",
            url: "https://spotify.com",
            hidden: false
        },
        {
            id: `test-${Date.now()}-3`,
            name: "Slack Pro",
            amount: 150,
            frequency: "yearly",
            startDate: inFiveDays.toISOString(),
            category: "Productivity",
            currency: "USD",
            url: "https://slack.com",
            hidden: false
        }
    ];

    return testSubscriptions;
}

// Function to import test data
export function importTestData(): Subscription[] {
    const testSubscriptions = generateTestData();
    const currentSubscriptions = loadSubscriptions();
    const updatedSubscriptions = [...currentSubscriptions, ...testSubscriptions];
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
        const nextPayment = new Date(startDate);

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