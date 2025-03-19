import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Use a more generic type that accommodates both local and Vercel environments
type SearchParamsType = Record<string, string | string[] | undefined>;

export default function Login({
    searchParams = {} as SearchParamsType
}: {
    searchParams?: SearchParamsType
}) {
    // Extract message data from searchParams in a serializable way
    // Since we provide a default value above, searchParams will never be undefined
    const message = 'message' in searchParams
        ? {
            type: searchParams.type === 'success' ? 'success' as const : 'error' as const,
            message: String(searchParams.message)
        }
        : undefined;

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
                        <FormMessage message={message} />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}