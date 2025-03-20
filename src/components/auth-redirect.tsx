'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasMigrationCompleted } from '@/lib/storage';

export function AuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Only redirect to sign in if user has completed migration before
        // This means they had previously logged in and synced their data
        if (hasMigrationCompleted()) {
            // router.push('/sign-in');
        }
    }, [router]);

    return null; // This component doesn't render anything
}