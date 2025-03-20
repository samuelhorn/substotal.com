"use client";

import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function DashboardButton() {
    const pathname = usePathname();
    const isSubscriptionsPage = pathname === "/subscriptions";

    if (isSubscriptionsPage) {
        return null;
    }

    return (
        <DropdownMenuItem asChild>
            <Link href="/subscriptions" className="block gap-2 flex items-center w-full">
                <LayoutDashboard className="w-5 h-5" />
                <span className="sr-only sm:not-sr-only">Dashboard</span>
            </Link>
        </DropdownMenuItem>
    );
}