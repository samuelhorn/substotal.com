"use client"
import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { loadAppState, clearAppState } from '@/lib/storage'
import { SubscriptionFormDialog } from './subscription-form-dialog'
import { addSubscription } from '@/lib/subscriptions'
import { toast } from 'sonner'
import { useSubscriptions } from './app-provider'
import { createClient } from '@/lib/supabase/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { CloudIcon, CloudOffIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

// Track whether the user has previously logged in
const HAS_LOGGED_IN_BEFORE = 'subtrack_has_logged_in_before';

// Check if user has logged in before
function hasLoggedInBefore(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(HAS_LOGGED_IN_BEFORE) === 'true';
}

// Set flag that user has logged in before
function markUserHasLoggedInBefore(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true');
}

// Helper to track when a user has just signed in to prevent welcome modal flashing
const JUST_SIGNED_IN_KEY = 'subtrack_just_signed_in';
function setJustSignedIn() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(JUST_SIGNED_IN_KEY, 'true');
    // Clear this flag after 10 seconds
    setTimeout(() => {
        localStorage.removeItem(JUST_SIGNED_IN_KEY);
    }, 10000);
}

function hasJustSignedIn() {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(JUST_SIGNED_IN_KEY) === 'true';
}

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showCloudDialog, setShowCloudDialog] = useState(false)
    const { userId, subscriptions, refreshData, isLoading: isLoadingSubscriptions } = useSubscriptions()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Track if initial data check is complete
    const initialCheckComplete = useRef(false);
    const hasAttemptedDataLoad = useRef(false);

    // First check if we've just signed in - if so, force data refresh
    useEffect(() => {
        if (userId && !hasAttemptedDataLoad.current) {
            hasAttemptedDataLoad.current = true;

            // Check both localStorage flag and URL parameter for sign-in success
            const justSignedIn = hasJustSignedIn() || searchParams?.get('signed_in') === 'true';

            if (justSignedIn) {
                refreshData();

                // Remove the flag after use
                localStorage.removeItem(JUST_SIGNED_IN_KEY);
            }
        }
    }, [userId, refreshData, searchParams]);

    // Main effect for handling welcome modal visibility
    useEffect(() => {
        // If we're still loading subscriptions, don't do anything yet
        if (isLoadingSubscriptions) {
            return;
        }

        // Only run the first time loading is complete
        if (!initialCheckComplete.current) {
            initialCheckComplete.current = true;

            const checkUserData = async () => {
                setIsLoading(true);
                try {
                    // Check both localStorage flag and URL parameter for sign-in success
                    const justSignedIn = hasJustSignedIn() || searchParams?.get('signed_in') === 'true';

                    // If user is logged in
                    if (userId) {
                        markUserHasLoggedInBefore();

                        // If we already have subscriptions in the state or just signed in, 
                        // don't show any modals
                        if (subscriptions && subscriptions.length > 0 || justSignedIn) {
                            setIsOpen(false);
                            setShowCloudDialog(false);
                            return;
                        }

                        // If user is authenticated but no subscriptions found, check local data
                        const localData = loadAppState();
                        setIsOpen(localData.subscriptions.length === 0);
                        setShowCloudDialog(false);
                    } else {
                        // If not logged in, check local data and login history
                        const localData = loadAppState();
                        const hasLocalData = localData.subscriptions.length > 0;
                        const userLoggedInBefore = hasLoggedInBefore();

                        if (hasLocalData || justSignedIn) {
                            setIsOpen(false);
                            setShowCloudDialog(false);
                        } else {
                            // No local data - if they've logged in before, show cloud dialog
                            if (userLoggedInBefore) {
                                setShowCloudDialog(userLoggedInBefore);
                                return;
                            }
                            // New user with no data - show welcome modal
                            setIsOpen(true);
                            setShowCloudDialog(false);
                        }
                    }
                } catch (error) {
                    console.error('Error checking user data:', error);

                    // Fallback to local data check on error
                    const localData = loadAppState();
                    const hasLocalData = localData.subscriptions.length > 0;
                    setIsOpen(!hasLocalData);
                } finally {
                    setIsLoading(false);
                }
            };

            checkUserData();
        }
    }, [isLoadingSubscriptions, subscriptions, userId, searchParams]);

    // Handler for adding a new subscription
    const handleAddSubscription = async (subscription: any) => {
        try {
            addSubscription(subscription);
            toast.success(`Added ${subscription.name} subscription`);
            setShowSubscriptionForm(false);
            // Use refreshData instead of forcing a page reload
            await refreshData();
        } catch (error) {
            console.error("Error adding subscription:", error);
            toast.error("Failed to add subscription");
        }
    }

    // Handler for importing test data
    const handleAddTestData = async () => {
        try {
            const testData = [
                {
                    id: 'netflix',
                    url: 'https://www.netflix.com',
                    name: 'Netflix',
                    amount: 15.99,
                    frequency: 'monthly' as const,
                    category: 'entertainment',
                    // tomorrow
                    start_date: new Date(Date.now() + 86400000).toISOString(),
                    currency: 'USD',
                    hidden: false
                },
                {
                    id: 'spotify',
                    url: 'https://www.spotify.com',
                    name: 'Spotify',
                    amount: 9.99,
                    frequency: 'monthly' as const,
                    category: 'entertainment',
                    start_date: new Date(Date.now() + 172800000).toISOString(),
                    currency: 'USD',
                    hidden: false
                },
                {
                    id: 'icloud',
                    url: 'https://www.icloud.com',
                    name: 'iCloud',
                    amount: 0.99,
                    frequency: 'monthly' as const,
                    category: 'Software',
                    start_date: new Date(Date.now() + 259200000).toISOString(),
                    currency: 'USD',
                    hidden: false
                }
            ];

            const state = loadAppState();
            state.subscriptions = testData;
            localStorage.setItem('subtrack_app_state', JSON.stringify(state));
            toast.success('Added demo subscriptions to help you explore');
            setIsOpen(false);

            // Use refreshData instead of forcing a page reload
            await refreshData();
        } catch (error) {
            console.error("Error adding test data:", error);
            toast.error("Failed to add test data");
        }
    };

    // Don't show anything until we've completed the initial data check
    // This prevents the modal from briefly flashing during page load
    if (isLoading || isLoadingSubscriptions || !initialCheckComplete.current) {
        return null;
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-4xl">Welcome to Subtrack!</DialogTitle>
                        <DialogDescription className="text-lg pt-2">
                            Your personal subscription tracker to help you manage all your recurring payments in one place.
                        </DialogDescription>
                    </DialogHeader>
                    <p>We are not like other subscription trackers. We don&apos;t need your bank details or personal information. And we&apos;re completely free!</p>
                    <p>We believe in privacy and security. Get started by importing your existing subscriptions or adding a new one. The data is stored locally in your browser.</p>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center justify-end pt-4">
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={handleAddTestData}
                            >
                                Try with demo data
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowSubscriptionForm(true)
                                    setIsOpen(false)
                                }}
                            >
                                Add subscription
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {showSubscriptionForm && (
                <SubscriptionFormDialog
                    open={showSubscriptionForm}
                    onOpenChange={setShowSubscriptionForm}
                    onSubmit={handleAddSubscription}
                />
            )}
            <Dialog open={showCloudDialog} onOpenChange={setShowCloudDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            Welcome Back!
                        </DialogTitle>
                        <DialogDescription className="space-y-4 pt-2">
                            We noticed you've previously used cloud storage. If you would you like to
                            access your existing subscriptions and continue where you left off, you can sign in to below.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='mt-4'>
                        <Button size="sm" variant="outline" onClick={() => setShowCloudDialog(false)}>
                            <CloudOffIcon />
                            Continue Locally
                        </Button>
                        <Button size="sm" onClick={() => router.push('/sign-in')}>
                            <CloudIcon />
                            Sign in to Cloud Storage
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}

// Export the helper function for other components to use
export { setJustSignedIn };