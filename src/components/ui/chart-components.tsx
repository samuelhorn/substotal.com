import { ReactNode } from "react";
import { TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/utils";

// Common tooltip styles as a reusable wrapper
interface ChartTooltipWrapperProps {
    children: ReactNode;
    className?: string;
}

export const ChartTooltipWrapper = ({
    children,
    className = ""
}: ChartTooltipWrapperProps) => (
    <div className={`bg-background p-4 rounded-lg shadow-lg border ${className}`}>
        {children}
    </div>
);

// Base tooltip formatter for currency values
export const formatTooltipCurrency = (
    value: number,
    currency: string,
    label?: string
) => [
        formatCurrency(value, currency, {
            showDecimals: true,
            currencyDisplay: "narrowSymbol"
        }),
        label || "Amount",
    ];

// Shared color palette
export const chartColors = [
    '#8B4513', // Saddle Brown
    '#A0522D', // Sienna
    '#6B4423', // Dark Brown
    '#8B7355', // Taupe
    '#CD853F', // Peru
    '#DEB887', // Burlywood
];

// Helper to get a color from the palette
export const getChartColor = (index: number) => chartColors[index % chartColors.length];