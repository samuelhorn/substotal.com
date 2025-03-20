'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { setJustSignedIn } from './welcome-modal';

/**
 * This component checks for sign-in success via URL parameters
 * and sets the appropriate flag.
 */
export function SignInSuccessHandler() {
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check for sign-in success parameter
        if (searchParams?.get('signed_in') === 'true') {
            // Set the just signed in flag
            setJustSignedIn();
        }
    }, [searchParams]);

    return null;
}