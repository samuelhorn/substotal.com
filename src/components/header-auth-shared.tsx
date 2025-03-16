"use client";

import { DashboardButton } from "@/components/dashboard-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function HeaderAuthShared() {
    return (
        <DropdownMenuGroup>
            <DashboardButton />
            <DropdownMenuItem asChild>
                <button className="flex w-full items-center px-2 py-1.5 text-sm cursor-default" onClick={(e) => {
                    // Prevent dropdown from closing
                    e.stopPropagation();
                }}>
                    <SettingsDialog />
                </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <button className="flex w-full items-center px-2 py-1.5 text-sm cursor-default" onClick={(e) => {
                    // Prevent dropdown from closing
                    e.stopPropagation();
                }}>
                    <ThemeToggle />
                </button>
            </DropdownMenuItem>
        </DropdownMenuGroup>
    );
}