"use client";

import { CategoryBreakdownChart } from "@/components/category-breakdown-chart";
import { UpcomingPaymentsChart } from "@/components/upcoming-payments-chart";
import { Subscription } from "@/lib/subscriptions";

interface SubscriptionChartsProps {
    subscriptions: Subscription[];
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
}

export function SubscriptionCharts({
    subscriptions,
    primaryCurrency = "USD",
    exchangeRates
}: SubscriptionChartsProps) {
    return (
        <>
            <CategoryBreakdownChart
                subscriptions={subscriptions}
                primaryCurrency={primaryCurrency}
                exchangeRates={exchangeRates}
            />
            <UpcomingPaymentsChart
                subscriptions={subscriptions}
                primaryCurrency={primaryCurrency}
                exchangeRates={exchangeRates}
            />
        </>
    );
}