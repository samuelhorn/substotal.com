"use client";

import { useState, useEffect } from "react";
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
import { ChartTooltipWrapper } from "@/components/ui/chart-components";
import { cn } from "@/lib/utils";
import { useChartView } from '@/components/app-provider';
import { useSubscriptions } from "./app-provider";
import { Skeleton } from "./ui/skeleton";

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
    const { isLoading } = useSubscriptions();
    const [isClient, setIsClient] = useState(false);
    const { setChartViewMode, chartViewMode } = useChartView();

    // Set isClient to true when component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Function to convert an amount to primary currency
    const convertToPrimary = (amount: number, fromCurrency: string) => {
        if (fromCurrency === primaryCurrency) return amount;
        return convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
    };

    // Calculate category costs based on viewMode
    const categoryData = Object.entries(getSubscriptionsByCategory(subscriptions)).map(([category, subs]) => ({
        category,
        value: subs.reduce((acc, sub) => {
            const monthlyCost = calculateMonthlyCost(sub);
            const convertedCost = convertToPrimary(monthlyCost, sub.currency);
            return acc + (chartViewMode === 'monthly' ? convertedCost : convertedCost * 12);
        }, 0)
    })).sort((a, b) => b.value - a.value);

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
                        {chartViewMode === 'monthly' ? 'Monthly' : 'Yearly'} Cost
                    </p>
                </ChartTooltipWrapper>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle>Category Breakdown</CardTitle>
                        <CardDescription className="mt-1">
                            {isClient && (
                                <>
                                    Your {chartViewMode === 'yearly' ? 'yearly' : 'monthly'} expenses by category
                                </>
                            )}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Label htmlFor="view-mode">Yearly View</Label>
                        {isLoading ? (
                            <Skeleton className="w-9 h-5 rounded-full" />
                        ) : (
                            <>
                                {isClient && (
                                    <Switch
                                        id="view-mode"
                                        checked={chartViewMode === 'yearly'}
                                        onCheckedChange={(checked) =>
                                            setChartViewMode(checked ? 'yearly' : 'monthly')
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {isLoading ? (
                            <div className="p-5">
                                <Skeleton className="h-[260px] w-full" />
                            </div>
                        ) : (
                            <BarChart data={categoryData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6f665c"
                                    strokeOpacity={0.4}
                                />
                                <XAxis
                                    dataKey="category"
                                    stroke="#6f665c"
                                    tick={{ fontSize: 14 }}
                                />
                                <YAxis
                                    stroke="#6f665c"
                                    label={{
                                        value: `Cost (${primaryCurrency})`,
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { fill: "#6f665c" },
                                        offset: 0,
                                        fontSize: 14,
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{
                                    fill: 'rgba(255, 255, 255, 0.05)',
                                }} />
                                <Bar dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            className={cn({
                                                "text-chart-1": index % 5 === 0,
                                                "text-chart-2": index % 5 === 1,
                                                "text-chart-3": index % 5 === 2,
                                                "text-chart-4": index % 5 === 3,
                                                "text-chart-5": index % 5 === 4,
                                            })}
                                            key={`cell-${index}`}
                                            fill="currentColor"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card >
    );
}