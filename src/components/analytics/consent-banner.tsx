'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function ConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Only show banner if consent hasn't been set yet
        const hasConsentChoice = localStorage.getItem('analytics_consent') !== null;
        setShowBanner(!hasConsentChoice);

        // Check for changes to consent status from other components/tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'analytics_consent' && e.newValue !== null) {
                setShowBanner(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleAccept = () => {
        if (typeof window.grantAnalyticsConsent === 'function') {
            window.grantAnalyticsConsent();
        }
        setShowBanner(false);
    };

    const handleDecline = () => {
        if (typeof window.denyAnalyticsConsent === 'function') {
            window.denyAnalyticsConsent();
        }
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <Card className="mx-auto max-w-2xl p-4 shadow-lg">
                <div className="space-y-3">
                    <h3 className="text-lg font-medium">Cookie Consent</h3>
                    <p className="text-sm text-muted-foreground">
                        We use analytics cookies to understand how you use our website and to improve your experience.
                        You can choose to accept or decline these cookies.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleAccept} variant="default">
                            Accept
                        </Button>
                        <Button onClick={handleDecline} variant="outline">
                            Decline
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}