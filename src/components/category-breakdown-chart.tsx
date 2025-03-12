"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    TooltipProps,
    CartesianGrid,
    Legend
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
import {
    ChartTooltipWrapper,
    formatTooltipCurrency,
    chartColors,
    getChartColor
} from "@/components/ui/chart-components";

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

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const { value, category } = payload[0].payload;
            return (
                <ChartTooltipWrapper>
                    <p className="font-semibold">{category}</p>
                    <p className="text-lg font-bold">
                        {formatCurrency(value, primaryCurrency, {
                            showDecimals: true,
                            currencyDisplay: "narrowSymbol"
                        })}
                    </p>
                    <p className="text-sm text-gray-500">
                        {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Cost
                    </p>
                </ChartTooltipWrapper>
            );
        }
        return null;
    };

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
                        <BarChart data={categoryData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                            <CartesianGrid
                                strokeDasharray="2 2"
                                stroke="#6f665c"
                                strokeOpacity={0.5}
                            />
                            <XAxis
                                dataKey="category"
                                stroke="#6f665c"
                                label={{
                                    value: 'Categories',
                                    position: 'insideBottom',
                                    offset: -20,
                                    style: { fill: "#6f665c" }
                                }}
                            />
                            <YAxis
                                stroke="#6f665c"
                                label={{
                                    value: `Cost (${primaryCurrency})`,
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { fill: "#6f665c" },
                                    offset: 0
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{
                                fill: 'rgba(255, 255, 255, 0.05)',
                            }} />
                            <Bar dataKey="value" fill={chartColors[0]}>
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getChartColor(index)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}