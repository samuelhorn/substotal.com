"use client"

import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { CurrencySelect } from "@/components/currency-select";
import { useCurrency } from "@/components/currency-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

interface HeaderProps {
    showCurrencySelect?: boolean;
}

export function Header({
    showCurrencySelect = true
}: HeaderProps) {
    const { primaryCurrency, setPrimaryCurrency } = useCurrency();
    const pathname = usePathname();
    const isSubscriptionsPage = pathname === "/subscriptions";

    return (
        <header className="flex justify-between items-center container py-6">
            <Link href="/" className="text-2xl sm:text-3xl font-semibold tracking-tight">
                substotal
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <SettingsDialog />
                {showCurrencySelect && (
                    <CurrencySelect
                        value={primaryCurrency}
                        onValueChange={setPrimaryCurrency}
                    />
                )}
                {!isSubscriptionsPage && (
                    <Button variant="outline" asChild>
                        <Link href="/subscriptions" className="block">
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="sr-only sm:not-sr-only">Dashboard</span>
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    );
}