"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardButton() {
    const pathname = usePathname();
    const isSubscriptionsPage = pathname === "/subscriptions";

    if (isSubscriptionsPage) {
        return null;
    }

    return (
        <Button variant="outline" asChild>
            <Link href="/subscriptions" className="block">
                <LayoutDashboard className="w-5 h-5" />
                <span className="sr-only sm:not-sr-only">Dashboard</span>
            </Link>
        </Button>
    );
}