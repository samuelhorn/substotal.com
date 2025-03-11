"use client";

import { format, addDays } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    TooltipProps
} from "recharts";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Subscription,
    calculateMonthlyCost,
    getSubscriptionsByCategory,
} from "@/lib/subscriptions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SubscriptionChartsProps {
    subscriptions: Subscription[];
    primaryCurrency?: string;
}

export function SubscriptionCharts({
    subscriptions,
    primaryCurrency = "USD"
}: SubscriptionChartsProps) {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: primaryCurrency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Prepare data for category breakdown chart
    const categoryData = Object.entries(getSubscriptionsByCategory(subscriptions))
        .map(([category, subs]) => ({
            category,
            value: subs.reduce((acc, sub) => {
                const monthlyCost = calculateMonthlyCost(sub);
                return acc + (viewMode === 'monthly' ? monthlyCost : monthlyCost * 12);
            }, 0),
        }))
        .sort((a, b) => b.value - a.value);

    // Create data for upcoming payments timeline
    const today = new Date();
    const nextTwoMonths = Array.from({ length: 60 }, (_, i) => {
        const date = addDays(today, i);
        return {
            date,
            dateString: format(date, "MMM dd"),
            value: 0,
            subscriptions: [] as Subscription[],
        };
    });

    // Calculate upcoming payments for timeline
    subscriptions.forEach(sub => {
        const startDate = new Date(sub.startDate);

        // For monthly subscriptions
        if (sub.frequency === "monthly") {
            let nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate = new Date(nextPaymentDate);
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }

            // Add the next 3 payments
            for (let i = 0; i < 3; i++) {
                const paymentDate = new Date(nextPaymentDate);
                paymentDate.setMonth(paymentDate.getMonth() + i);

                const dayDiff = Math.floor((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (dayDiff >= 0 && dayDiff < 60) {
                    nextTwoMonths[dayDiff].value += sub.amount;
                    nextTwoMonths[dayDiff].subscriptions.push(sub);
                }
            }
        }

        // For yearly subscriptions
        if (sub.frequency === "yearly") {
            let nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate = new Date(nextPaymentDate);
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            }

            const dayDiff = Math.floor((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 0 && dayDiff < 60) {
                nextTwoMonths[dayDiff].value += sub.amount;
                nextTwoMonths[dayDiff].subscriptions.push(sub);
            }
        }
    });

    // Filter out days with no payments
    const filteredTimelineData = nextTwoMonths.filter(day => day.value > 0);

    // Custom tooltip for the timeline chart
    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border shadow-sm rounded-lg">
                    <p className="font-semibold">{data.dateString}</p>
                    <p className="text-sm">{formatCurrency(data.value)}</p>
                    <div className="mt-2">
                        {data.subscriptions.map((sub: Subscription) => (
                            <div key={sub.id} className="text-xs">
                                <span className="font-medium">{sub.name}</span>:{" "}
                                {formatCurrency(sub.amount)}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle>Category Breakdown</CardTitle>
                        <CardDescription>
                            {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} cost by category
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label
                            htmlFor={viewMode === 'yearly' ? "view-mode" : undefined}
                            className={cn("text-sm", {
                                "text-muted-foreground": viewMode === 'yearly'
                            })}
                        >
                            Monthly
                        </Label>
                        <Switch
                            id="view-mode"
                            checked={viewMode === 'yearly'}
                            onCheckedChange={(checked) => setViewMode(checked ? 'yearly' : 'monthly')}
                        />
                        <Label
                            htmlFor={viewMode === 'monthly' ? "view-mode" : undefined}
                            className={cn("text-sm", {
                                "text-muted-foreground": viewMode === 'monthly'
                            })}
                        >
                            Yearly
                        </Label>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={categoryData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value: number) => [
                                        formatCurrency(value),
                                        viewMode === 'monthly' ? "Monthly Cost" : "Yearly Cost"
                                    ]}
                                />
                                <Bar dataKey="value" fill="#F7EBAF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Payments</CardTitle>
                    <CardDescription>Next 60 days payment timeline</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={filteredTimelineData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#6f665c" />
                                <XAxis
                                    dataKey="dateString"
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#F7EBAF"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}