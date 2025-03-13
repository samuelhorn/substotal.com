'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

// Default consent state - all set to 'denied' initially
const DEFAULT_CONSENT_STATE = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted', // Security is typically granted by default
};

interface Props {
    measurementId: string; // Your GA4 measurement ID
}

// Define the gtag function type properly
type GTagFunction = (...args: any[]) => void;

// Add proper types for window object
declare global {
    interface Window {
        // Use the correct type that matches the existing declaration
        gtag?: GTagFunction;
        // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
        dataLayer?: Object[]; // Using Object[] to match existing type declaration
        grantAnalyticsConsent: () => void;
        denyAnalyticsConsent: () => void;
    }
}

export default function GoogleAnalyticsProvider({ measurementId }: Props) {
    // Track consent status to conditionally render GA
    const [consentGranted, setConsentGranted] = useState(false);

    useEffect(() => {
        // Initialize dataLayer and gtag function even before consent
        // so we can set up the consent mode properly
        if (typeof window !== 'undefined') {
            // Initialize dataLayer if it doesn't exist
            window.dataLayer = window.dataLayer || [];

            // Define gtag function safely - needed for consent management
            window.gtag = function (...args: any[]) {
                window.dataLayer?.push(args);
            };

            // Check if user has previously given consent
            const hasConsent = localStorage.getItem('analytics_consent') === 'granted';
            setConsentGranted(hasConsent);

            // Set up consent handlers regardless of current consent state
            window.grantAnalyticsConsent = () => {
                if (window.gtag) {
                    window.gtag('consent', 'update', {
                        analytics_storage: 'granted',
                    });

                    // Mark as consented so the component renders GA
                    setConsentGranted(true);
                }
                localStorage.setItem('analytics_consent', 'granted');
            };

            window.denyAnalyticsConsent = () => {
                if (window.gtag) {
                    window.gtag('consent', 'update', {
                        analytics_storage: 'denied',
                    });
                }
                localStorage.setItem('analytics_consent', 'denied');
                setConsentGranted(false);
            };
        }
    }, []);

    // Only render the GoogleAnalytics component if consent has been granted
    // This prevents the GA script from loading until consent is given
    if (!consentGranted) {
        return null;
    }

    return <GoogleAnalytics gaId={measurementId} />;
}