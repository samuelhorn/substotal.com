import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CloudIcon, UserIcon } from "lucide-react";

export async function AuthButton() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return user ? (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 text-sm">
                    <CloudIcon className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Cloud storage</span>
                </div>
            </div>
            <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                    Sign out
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 opacity-50">
                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Local storage</span>
                </div>
            </div>
            <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                    <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            </div>
        </div>
    );
}