import { ReactNode } from "react";
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
