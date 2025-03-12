"use client";

import { format, addDays } from "date-fns";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
    ZAxis,
    Cell,
    CartesianGrid
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";
import { formatCurrency } from "@/lib/utils";
import {
    ChartTooltipWrapper,
    chartColors,
    getChartColor
} from "@/components/ui/chart-components";

interface UpcomingPaymentsChartProps {
    subscriptions: Subscription[];
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
}

export function UpcomingPaymentsChart({
    subscriptions,
    primaryCurrency,
    exchangeRates
}: UpcomingPaymentsChartProps) {
    // Function to convert an amount to primary currency
    const convertToPrimary = (amount: number, fromCurrency: string) => {
        if (fromCurrency === primaryCurrency) return amount;
        return convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
    };

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

                const dayIndex = Math.floor((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (dayIndex < nextTwoMonths.length) {
                    const convertedAmount = convertToPrimary(sub.amount, sub.currency);
                    nextTwoMonths[dayIndex].value += convertedAmount;
                    nextTwoMonths[dayIndex].subscriptions.push(sub);
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

            const dayIndex = Math.floor((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex < nextTwoMonths.length) {
                const convertedAmount = convertToPrimary(sub.amount, sub.currency);
                nextTwoMonths[dayIndex].value += convertedAmount;
                nextTwoMonths[dayIndex].subscriptions.push(sub);
            }
        }
    });

    // Filter out days with no payments to only show actual payment days
    const paymentsData = nextTwoMonths.filter(day => day.value > 0);

    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <ChartTooltipWrapper>
                    <p className="font-semibold">{format(data.date, "MMMM d, yyyy")}</p>
                    <p className="text-lg font-bold">{formatCurrency(data.value, primaryCurrency, {
                        showDecimals: true,
                        currencyDisplay: "narrowSymbol"
                    })}</p>
                    <div className="mt-2">
                        {data.subscriptions.map((sub: Subscription) => (
                            <div key={sub.id} className="text-sm">
                                {sub.name} - {formatCurrency(convertToPrimary(sub.amount, sub.currency), primaryCurrency, {
                                    showDecimals: true,
                                    currencyDisplay: "narrowSymbol"
                                })}
                            </div>
                        ))}
                    </div>
                </ChartTooltipWrapper>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>
                    Your subscription payments for the next 60 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="2 2"
                                stroke="#6f665c"
                                strokeOpacity={0.5}
                            />
                            <XAxis
                                dataKey="dateString"
                                name="Date"
                                stroke="#6f665c"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Date', position: 'insideBottom', offset: -20, style: { fill: "#6f665c" } }}
                            />
                            <YAxis
                                dataKey="value"
                                name="Amount"
                                stroke="#6f665c"
                                label={{
                                    value: `Amount (${primaryCurrency})`,
                                    angle: -90,
                                    offset: 0,
                                    position: 'insideLeft',
                                    style: { fill: "#6f665c" }
                                }}
                            />
                            <ZAxis range={[100, 400]} />
                            <Tooltip content={<CustomTooltip />} cursor={{
                                stroke: 'rgba(255, 255, 255, 0.15)',
                            }} />
                            <Scatter
                                name="Payments"
                                data={paymentsData}
                                fill={chartColors[0]}
                            >
                                {
                                    paymentsData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getChartColor(index)}
                                        />
                                    ))
                                }
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}