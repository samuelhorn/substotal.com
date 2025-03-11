import { z } from "zod";

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

// Helper function to calculate monthly cost
export function calculateMonthlyCost(subscription: Subscription): number {
    return subscription.frequency === "monthly"
        ? subscription.amount
        : subscription.amount / 12;
}

// Helper function to calculate yearly cost
export function calculateYearlyCost(subscription: Subscription): number {
    return subscription.frequency === "yearly"
        ? subscription.amount
        : subscription.amount * 12;
}

// Calculate total monthly cost
export function calculateTotalMonthlyCost(subscriptions: Subscription[]): number {
    return subscriptions.reduce(
        (total, sub) => total + calculateMonthlyCost(sub),
        0
    );
}

// Calculate total yearly cost
export function calculateTotalYearlyCost(subscriptions: Subscription[]): number {
    return subscriptions.reduce(
        (total, sub) => total + calculateYearlyCost(sub),
        0
    );
}

// Calculate locked-in costs (subscriptions that can't be canceled yet)
export function calculateLockedInCost(subscriptions: Subscription[]): number {
    const today = new Date();

    return subscriptions
        .filter(sub => {
            if (!sub.commitmentEndDate) return false;
            const endDate = new Date(sub.commitmentEndDate);
            return endDate > today;
        })
        .reduce((total, sub) => {
            const endDate = new Date(sub.commitmentEndDate!);
            const monthsLeft = (endDate.getFullYear() - today.getFullYear()) * 12 +
                (endDate.getMonth() - today.getMonth());

            if (sub.frequency === "monthly") {
                return total + (sub.amount * Math.max(0, monthsLeft));
            } else {
                // For yearly, calculate the remaining amount
                const monthlyAmount = sub.amount / 12;
                return total + (monthlyAmount * Math.max(0, monthsLeft));
            }
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
    return subscriptions.reduce((acc, sub) => {
        const category = sub.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(sub);
        return acc;
    }, {} as Record<string, Subscription[]>);
}

// Get upcoming payments in the next 30 days
export function getUpcomingPayments(subscriptions: Subscription[], days: number = 30): Subscription[] {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return subscriptions.filter(sub => {
        const startDate = new Date(sub.startDate);

        // For monthly subscriptions
        if (sub.frequency === "monthly") {
            const nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
            return nextPaymentDate <= futureDate;
        }

        // For yearly subscriptions
        if (sub.frequency === "yearly") {
            const nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            }
            return nextPaymentDate <= futureDate;
        }

        return false;
    });
}