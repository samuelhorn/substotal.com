"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloudIcon, CloudOffIcon, UserIcon, LogOut, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function AuthMenu({ user, profile }: { user: any; profile: any }) {
    const pathname = usePathname();
    const isSubscriptionsPage = pathname === "/subscriptions";

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer">
                            {user && profile && profile.avatar_url && (
                                <AvatarImage src={profile.avatar_url} alt={profile?.full_name || user.email || ""} />
                            )}
                            {user && !profile?.avatar_url && (
                                <AvatarFallback className="w-10 h-10">
                                    {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                </AvatarFallback>
                            )}
                            {!user && (
                                <AvatarFallback className="w-10 h-10"><UserIcon className="h-5 w-5" /></AvatarFallback>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-64">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2 justify-between">
                                {user ? (
                                    <>
                                        <div>
                                            <div className="text-sm">{profile?.full_name || user.email}</div>
                                            <div className="text-muted-foreground">Using cloud storage</div>
                                        </div>
                                        <CloudIcon className="h-7 w-7 text-muted-foreground" />
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <div>Not signed in</div>
                                            <div className="text-muted-foreground">Using local storage</div>
                                        </div>
                                        <CloudOffIcon className="h-7 w-7 text-muted-foreground  " />
                                    </>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {!isSubscriptionsPage && (
                                <DropdownMenuItem asChild>
                                    <Link href="/subscriptions" className="block gap-2 flex items-center w-full">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <SettingsDialog />
                            <ThemeToggle />
                        </DropdownMenuGroup >
                        <DropdownMenuSeparator />
                        {user ? (
                            <DropdownMenuItem asChild>
                                <form action={signOutAction} className="w-full">
                                    <button type="submit" className="flex w-full items-center">
                                        <LogOut className="mr-2 h-5 w-5" />
                                        <span>Sign out</span>
                                    </button>
                                </form>
                            </DropdownMenuItem>
                        ) : (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href="/sign-in" className="flex gap-2 items-center">
                                        <LogIn className="h-4 w-4" />
                                        <span>Sign in</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/sign-up" className="flex gap-2 items-center">
                                        <UserPlus className="h-4 w-4" />
                                        <span>Sign up</span>
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="absolute -top-2 -right-2">
                    <Tooltip>
                        <TooltipTrigger>
                            {user ? (
                                <div className="rounded-full p-0.5 bg-green-500 border shadow-md">
                                    <CloudIcon className="h-3 w-3 text-green-900" />
                                </div>
                            ) : (
                                <div className="rounded-full p-0.5 bg-red-500 border shadow-md">
                                    <CloudOffIcon className="h-3 w-3 text-red-900" />
                                </div>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            {user ? "You are using Cloud storage" : "You are using Local storage"}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}