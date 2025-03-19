import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CloudIcon, CloudOffIcon, UserIcon, Settings, LogOut, LogIn, UserPlus, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderAuthShared } from "@/components/header-auth-shared";


export async function AuthButton() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return user ? (
        <div className="flex items-center gap-4">
            <div className="relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-64">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2 justify-between">
                                <div>
                                    <div>{user.email}</div>
                                    <div className="text-muted-foreground">Using cloud storage</div>
                                </div>
                                <CloudIcon className="h-7 w-7 text-muted-foreground" />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <HeaderAuthShared />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <form action={signOutAction} className="w-full">
                                <button type="submit" className="flex w-full items-center">
                                    <LogOut className="mr-2 h-5 w-5" />
                                    <span>Sign out</span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="absolute -top-2 -right-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="rounded-full p-0.5 bg-green-500 border shadow-md">
                                <CloudIcon className="h-3 w-3 text-green-900" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            You are using Cloud storage
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex items-center gap-4">
            <div className="relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 opacity-50 cursor-pointer">
                            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-64">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2 justify-between">
                                <div>
                                    <div>Not signed in</div>
                                    <div className="text-muted-foreground">Using local storage</div>
                                </div>
                                <CloudOffIcon className="h-7 w-7 text-muted-foreground  " />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <HeaderAuthShared />
                        <DropdownMenuSeparator />
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
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="absolute -top-2 -right-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="rounded-full p-0.5 bg-red-500 border shadow-md">
                                <CloudOffIcon className="h-3 w-3 text-red-900" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            You are using Local storage
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}