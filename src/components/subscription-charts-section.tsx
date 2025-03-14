"use client";

import { CategoryBreakdownChart } from "@/components/category-breakdown-chart";
import { UpcomingPaymentsChart } from "@/components/upcoming-payments-chart";
import { useSubscriptions } from "@/components/subscription-context";
import { useCurrency } from "@/components/currency-context";

export function SubscriptionChartsSection() {
    const { subscriptions } = useSubscriptions();
    const { primaryCurrency, exchangeRates } = useCurrency();

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