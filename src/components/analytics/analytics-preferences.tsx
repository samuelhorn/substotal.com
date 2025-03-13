'use client';

import { useEffect, useState } from 'react';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function AnalyticsPreferences() {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

    useEffect(() => {
        // Load current consent state
        const storedConsent = localStorage.getItem('analytics_consent');
        setAnalyticsEnabled(storedConsent === 'granted');
    }, []);

    const handleToggle = (checked: boolean) => {
        if (checked) {
            if (typeof window.grantAnalyticsConsent === 'function') {
                window.grantAnalyticsConsent();
            }
        } else {
            if (typeof window.denyAnalyticsConsent === 'function') {
                window.denyAnalyticsConsent();
            }
        }
        setAnalyticsEnabled(checked);
    };

    return (
        <Card>

            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">Analytics Cookies</CardTitle>
                <Switch
                    checked={analyticsEnabled}
                    onCheckedChange={handleToggle}
                    aria-label="Toggle analytics"
                />
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Allow us to analyze usage so we can measure and improve the performance of our site
                </p>
                <p className="text-sm text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting
                    and reporting information anonymously.
                </p>

            </CardContent>
        </Card>
    );
}