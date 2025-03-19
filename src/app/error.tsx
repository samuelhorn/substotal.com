"use client";

import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-2xl font-bold mb-1">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        An error occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container max-w-lg py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Error</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent error={error} reset={reset} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}