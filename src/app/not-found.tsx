"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This component will handle the useSearchParams if needed
function NotFoundContent() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-6 mx-auto max-w-[260px]">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
                <Link href="/">Return to home</Link>
            </Button>
        </div>
    );
}

export default function NotFound() {
    return (
        <div className="container max-w-lg py-2 px-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-9xl font-bold">404</CardTitle>
                    <CardDescription className="text-2xl">Page not found</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                    <Suspense fallback={<div>Loading...</div>}>
                        <NotFoundContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}