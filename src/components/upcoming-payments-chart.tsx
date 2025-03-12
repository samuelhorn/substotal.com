"use client";

import { format, addDays } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";

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
    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: primaryCurrency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

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

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-semibold">{format(data.date, "MMMM d, yyyy")}</p>
                    <p className="text-lg font-bold">{formatCurrency(data.value)}</p>
                    <div className="mt-2">
                        {data.subscriptions.map((sub: Subscription) => (
                            <div key={sub.id} className="text-sm">
                                {sub.name} - {formatCurrency(convertToPrimary(sub.amount, sub.currency))}
                            </div>
                        ))}
                    </div>
                </div>
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
                        <LineChart data={nextTwoMonths}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="dateString"
                                label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis
                                label={{
                                    value: `Amount (${primaryCurrency})`,
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="none"
                                dot={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}