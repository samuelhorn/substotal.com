import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default async function ForgotPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <Card className="mx-auto min-w-xs max-w-sm mt-12">
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl font-medium">Reset Password</h1>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="text-foreground underline" href="/sign-in">
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
                        <SubmitButton formAction={forgotPasswordAction}>
                            Reset Password
                        </SubmitButton>
                        <FormMessage message={searchParams} />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}