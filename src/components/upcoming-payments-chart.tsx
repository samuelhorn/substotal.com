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
    CartesianGrid,
    LabelList
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";
import { formatCurrency } from "@/lib/utils";
import { ChartTooltipWrapper } from "@/components/ui/chart-components";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useSubscriptions } from "./subscription-context";
import { Skeleton } from "@/components/ui/skeleton";

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
    const { isLoading } = useSubscriptions();

    // Function to convert an amount to primary currency
    const convertToPrimary = (amount: number, fromCurrency: string) => {
        if (fromCurrency === primaryCurrency) return amount;
        return convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
    };

    // Create data for upcoming payments timeline
    const today = new Date();
    const nextTwoMonths = Array.from({ length: 30 }, (_, i) => {
        const date = addDays(today, i);
        return {
            date,
            dateString: format(date, "MMM dd"),
            value: 0,
            subscriptions: [] as Subscription[],
        };
    });

    // Filter out hidden subscriptions and calculate upcoming payments for timeline
    subscriptions.filter(sub => !sub.hidden).forEach(sub => {
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
                    <div className="text-sm text-gray-500">
                        {data.subscriptions.map((sub: Subscription) => (
                            <div key={sub.id}>
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

    const renderCustomizedLabel = (props: any) => {
        const { x, y, value } = props;

        console.log(value);

        return (
            <AnimatePresence mode="popLayout">
                {value > 0 && (
                    <motion.text
                        initial={{
                            opacity: 0,
                            scale: 1,
                            y: y + 10,
                            x: x + 28
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: y + 10,
                            x: x + 18
                        }}
                        exit={{
                            opacity: 0,
                            scale: 1,
                            y: y + 10,
                            x: x + 18
                        }}
                        transition={{ duration: 0.25, ease: [0, 0.6, 1.2, 1] }}
                        fill="currentColor"
                        fontSize={18}
                        fontWeight="bold"
                        textAnchor="right"
                    >
                        {formatCurrency(value, primaryCurrency, {
                            showDecimals: false,
                            currencyDisplay: "narrowSymbol"
                        })}
                    </motion.text>
                )}
            </AnimatePresence>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription className="mt-1">
                    Your subscription payments for the next 30 days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {isLoading ? (
                            <div className="p-5">
                                <Skeleton className="h-[260px] w-full" />
                            </div>
                        ) : (
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#6f665c"
                                    strokeOpacity={0.4}
                                />
                                <XAxis
                                    dataKey="dateString"
                                    name="Date"
                                    stroke="#6f665c"
                                    tick={{ fontSize: 14 }}
                                />
                                <YAxis
                                    dataKey="value"
                                    name="Amount"
                                    stroke="#6f665c"
                                    label={{
                                        value: `Amount (${primaryCurrency})`,
                                        angle: -90,
                                        position: "insideLeft",
                                        style: { fill: "#6f665c" },
                                        fontSize: 14,
                                        offset: 0,
                                    }}
                                />
                                <ZAxis dataKey="value" range={[80, 80]} />
                                <Tooltip content={<CustomTooltip />} cursor={{
                                    stroke: 'rgba(255, 255, 255, 0.15)',
                                }} />
                                <Scatter
                                    name="Payments"
                                    data={paymentsData}
                                >
                                    <LabelList
                                        content={renderCustomizedLabel}
                                        dataKey="value"
                                        fontSize={18}
                                        fontWeight="bold"
                                        position="right"
                                        offset={8}
                                        formatter={(value: number) => formatCurrency(value, primaryCurrency, {
                                            showDecimals: false,
                                            currencyDisplay: "narrowSymbol"
                                        })}
                                    />
                                    {
                                        paymentsData.map((entry, index) => (
                                            <Cell
                                                width={10}
                                                height={10}
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
                                        ))
                                    }
                                </Scatter>
                            </ScatterChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}