import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { CurrencySelect } from "@/components/currency-select";
import { DashboardButton } from "@/components/dashboard-button";
import Link from "next/link";

import { AuthButton } from "@/components/header-auth";

interface HeaderProps {
    showCurrencySelect?: boolean;
}

export function Header({
    showCurrencySelect = true
}: HeaderProps) {

    return (
        <header className="flex justify-between items-center container py-6">
            <Link href="/" className="text-2xl sm:text-3xl font-semibold tracking-tight">
                substotal
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <SettingsDialog />
                {showCurrencySelect && (
                    <CurrencySelect />
                )}
                <DashboardButton />
                <AuthButton />
            </div>
        </header>
    );
}