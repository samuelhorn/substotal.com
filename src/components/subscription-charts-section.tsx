"use client";

import { CategoryBreakdownChart } from "@/components/category-breakdown-chart";
import { UpcomingPaymentsChart } from "@/components/upcoming-payments-chart";
import { useSubscriptions, useCurrency } from "@/components/app-provider";

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