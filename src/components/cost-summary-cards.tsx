"use client";

import {
    CalendarDays,
    CalendarRange,
    LockIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    calculateTotalMonthlyCost,
    calculateTotalYearlyCost,
    calculateLockedInCost,
    Subscription
} from "@/lib/subscriptions";
import { formatCurrency } from "@/lib/utils";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

// Animated counter component
function AnimatedCounter({ value, formatter }: { value: number; formatter: (value: number) => string }) {
    // Increased stiffness and reduced damping even more for ~50% faster animation
    const springValue = useSpring(0, { stiffness: 800, damping: 50 });
    const displayValue = useMotionValue(0);

    // Transform the animated value to formatted string, ensuring it never goes below zero
    const formattedValue = useTransform(displayValue, (latest) => {
        // Clamp the value to prevent it from going below zero
        const clampedValue = Math.max(0, latest);
        return formatter(clampedValue);
    });

    useEffect(() => {
        springValue.set(value);
    }, [springValue, value]);

    useEffect(() => {
        const unsubscribe = springValue.onChange((latest) => {
            displayValue.set(latest);
        });
        return unsubscribe;
    }, [springValue, displayValue]);

    return <motion.div className="text-6xl xl:text-7xl 2xl:text-8xl font-bold">{formattedValue}</motion.div>;
}

interface CostSummaryCardsProps {
    subscriptions: Subscription[];
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
}

export function CostSummaryCards({
    subscriptions,
    primaryCurrency = "USD",
    exchangeRates
}: CostSummaryCardsProps) {
    const formatCurrencyForDisplay = (amount: number) => {
        // Force to whole numbers for summary cards by rounding
        const roundedAmount = Math.round(amount);

        // Use consistent formatting with our utility
        return formatCurrency(roundedAmount, primaryCurrency, {
            showDecimals: false, // Don't show decimals in the cards
            currencyDisplay: "narrowSymbol" // Use narrow symbol format for consistency
        });
    };

    const monthlyCost = calculateTotalMonthlyCost(subscriptions, primaryCurrency, exchangeRates);
    const yearlyCost = calculateTotalYearlyCost(subscriptions, primaryCurrency, exchangeRates);
    const lockedInCost = calculateLockedInCost(subscriptions, primaryCurrency, exchangeRates);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Monthly Cost</CardTitle>
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <AnimatedCounter value={monthlyCost} formatter={formatCurrencyForDisplay} />
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Total monthly subscription expenses
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Yearly Cost</CardTitle>
                    <CalendarRange className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <AnimatedCounter value={yearlyCost} formatter={formatCurrencyForDisplay} />
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Total annual subscription expenses
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Locked-In Cost</CardTitle>
                    <LockIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <AnimatedCounter value={lockedInCost} formatter={formatCurrencyForDisplay} />
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Committed expenses you can&apos;t cancel yet
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}