'use client';

import { useEffect, useState } from 'react';
import { Switch } from '../ui/switch';

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
        <div className="space-y-4 p-4 border rounded-md">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                        Allow us to analyze usage so we can measure and improve the performance of our site
                    </p>
                </div>
                <Switch
                    checked={analyticsEnabled}
                    onCheckedChange={handleToggle}
                    aria-label="Toggle analytics"
                />
            </div>
            <p className="text-xs text-muted-foreground">
                These cookies help us understand how visitors interact with our website by collecting
                and reporting information anonymously.
            </p>
        </div>
    );
}