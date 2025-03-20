"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const handleThemeChange = (newTheme: string, e: React.MouseEvent) => {
        // Prevent event propagation to parent dropdown
        e.stopPropagation();
        setTheme(newTheme);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute top-0 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    <span>Toggle theme</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40">
                <DropdownMenuItem onClick={(e) => handleThemeChange("light", e)} className={cn("flex justify-between items-center", {
                    "bg-accent": theme === "light"
                })}>
                    Light
                    {theme === "light" && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleThemeChange("dark", e)} className={cn("flex justify-between items-center", {
                    "bg-accent": theme === "dark"
                })}>
                    Dark
                    {theme === "dark" && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleThemeChange("system", e)} className={cn("flex justify-between items-center", {
                    "bg-accent": theme === "system"
                })}>
                    System
                    {theme === "system" && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}
