'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect } from 'react';

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
    // We don't need to track consent status as state since we're not using it in the UI
    // Removed isConsentGranted useState

    useEffect(() => {
        // Check if user has previously given consent
        const hasConsent = localStorage.getItem('analytics_consent') === 'granted';

        // Initialize dataLayer and gtag function
        if (typeof window !== 'undefined') {
            // Initialize dataLayer if it doesn't exist
            window.dataLayer = window.dataLayer || [];

            // Define gtag function safely
            window.gtag = function (...args: any[]) {
                // Make sure dataLayer exists before pushing to it
                window.dataLayer?.push(args);
            };

            const gtag = window.gtag;

            // Initialize Google's consent mode
            gtag('consent', 'default', DEFAULT_CONSENT_STATE);

            // Update consent state if previously granted
            if (hasConsent) {
                gtag('consent', 'update', {
                    analytics_storage: 'granted',
                });
            }

            // Handle consent banner interaction
            window.grantAnalyticsConsent = () => {
                if (window.gtag) {
                    window.gtag('consent', 'update', {
                        analytics_storage: 'granted',
                    });
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
            };
        }
    }, []);

    return <GoogleAnalytics gaId={measurementId} />;
}