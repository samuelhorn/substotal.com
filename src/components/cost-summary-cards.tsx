"use client";

import {
    CalendarClock,
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

interface CostSummaryCardsProps {
    subscriptions: Subscription[];
    primaryCurrency?: string;
}

export function CostSummaryCards({
    subscriptions,
    primaryCurrency = "USD"
}: CostSummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: primaryCurrency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const monthlyCost = calculateTotalMonthlyCost(subscriptions);
    const yearlyCost = calculateTotalYearlyCost(subscriptions);
    const lockedInCost = calculateLockedInCost(subscriptions);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-bold">{formatCurrency(monthlyCost)}</div>
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Total monthly subscription expenses
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Yearly Cost</CardTitle>
                    <CalendarRange className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-bold">{formatCurrency(yearlyCost)}</div>
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Total annual subscription expenses
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Locked-In Cost</CardTitle>
                    <LockIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-bold">{formatCurrency(lockedInCost)}</div>
                    <p className="text-sm mt-4 font-thin text-muted-foreground mt-1">
                        Committed expenses you can't cancel yet
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}