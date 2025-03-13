"use client"

import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationSettingsDialog } from "@/components/notification-settings-dialog";
import { ImportExportDialog } from "@/components/import-export";
import { CurrencySelect } from "@/components/currency-select";
import { useCurrency } from "@/components/currency-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <Link href="/" className="text-3xl font-semibold tracking-tight">
                substotal
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <NotificationSettingsDialog />
                <ImportExportDialog />
                {showCurrencySelect && (
                    <CurrencySelect
                        value={primaryCurrency}
                        onValueChange={setPrimaryCurrency}
                    />
                )}
                {!isSubscriptionsPage && (
                    <Button variant="secondary" asChild>
                        <Link href="/subscriptions" className="block">Dashboard</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}