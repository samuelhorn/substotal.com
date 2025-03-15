import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;

    return (
        <Card className="mx-auto min-w-xs max-w-sm mt-12">
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl font-medium">Sign in</h1>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link className="text-foreground font-medium underline" href="/sign-up">
                            Sign up
                        </Link>
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col">
                    <div className="flex flex-col gap-2 [&>input]:mb-3">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" placeholder="you@example.com" required />
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                className="text-xs text-foreground underline leading-none"
                                href="/forgot-password"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            required
                        />
                        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                            Sign in
                        </SubmitButton>
                        <FormMessage message={searchParams} />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}