"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mx-auto p-4 max-w-md">
                    <Card>
                        <CardHeader>
                            <CardTitle>Something went wrong</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-red-500">
                                {this.state.error?.message || "An unknown error occurred"}
                            </p>
                            <p className="mb-4 text-sm text-muted-foreground">
                                This could be related to browser storage restrictions or compatibility issues.
                            </p>
                            <Button onClick={() => window.location.reload()}>
                                Refresh the page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}