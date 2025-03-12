"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    TooltipProps
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Subscription,
    calculateMonthlyCost,
    getSubscriptionsByCategory,
} from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";
import { formatCurrency } from "@/lib/utils";

interface CategoryBreakdownChartProps {
    subscriptions: Subscription[];
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
}

export function CategoryBreakdownChart({
    subscriptions,
    primaryCurrency,
    exchangeRates
}: CategoryBreakdownChartProps) {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

    // Function to convert an amount to primary currency
    const convertToPrimary = (amount: number, fromCurrency: string) => {
        if (fromCurrency === primaryCurrency) return amount;
        return convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
    };

    // Prepare data for category breakdown chart
    const categoryData = Object.entries(getSubscriptionsByCategory(subscriptions))
        .map(([category, subs]) => ({
            category,
            value: subs.reduce((acc, sub) => {
                const monthlyCost = calculateMonthlyCost(sub);
                const convertedCost = convertToPrimary(monthlyCost, sub.currency);
                return acc + (viewMode === 'monthly' ? convertedCost : convertedCost * 12);
            }, 0),
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle>Category Breakdown</CardTitle>
                        <CardDescription>
                            Your {viewMode === 'yearly' ? 'yearly' : 'monthly'} expenses by category
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="view-mode">Yearly View</Label>
                        <Switch
                            id="view-mode"
                            checked={viewMode === 'yearly'}
                            onCheckedChange={(checked) =>
                                setViewMode(checked ? 'yearly' : 'monthly')
                            }
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="category"
                                label={{ value: 'Categories', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis
                                label={{
                                    value: `Cost (${primaryCurrency})`,
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />
                            <Tooltip
                                formatter={(value: number) => [
                                    formatCurrency(value, primaryCurrency, {
                                        showDecimals: true,
                                        currencyDisplay: "narrowSymbol"
                                    }),
                                    `${viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Cost`,
                                ]}
                            />
                            <Bar
                                dataKey="value"
                                fill="#8B4513"  // Saddle Brown
                            >
                                {
                                    categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={[
                                                '#8B4513',  // Saddle Brown
                                                '#A0522D',  // Sienna
                                                '#6B4423',  // Dark Brown
                                                '#8B7355',  // Taupe
                                                '#CD853F',  // Peru
                                                '#DEB887',  // Burlywood
                                            ][index % 6]}
                                        />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}