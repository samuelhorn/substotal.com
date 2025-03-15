import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <Card className="mx-auto min-w-xs max-w-sm mt-12">
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl font-medium">Sign up</h1>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="text-foreground font-medium underline" href="/sign-in">
                            Sign in
                        </Link>
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col">
                    <div className="flex flex-col gap-2 [&>input]:mb-3">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" placeholder="you@example.com" required />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            minLength={6}
                            required
                        />
                        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
                            Sign up
                        </SubmitButton>
                        <FormMessage message={searchParams} />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}