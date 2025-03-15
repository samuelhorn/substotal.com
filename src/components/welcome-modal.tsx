"use client"
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { loadAppState, clearAppState } from '@/lib/storage'
import { SubscriptionFormDialog } from './subscription-form-dialog'
import { addSubscription } from '@/lib/subscriptions'
import { toast } from 'sonner'
import { useSubscriptions } from './app-provider'
import { createClient } from '@/lib/supabase/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloudIcon, CloudOff } from 'lucide-react'
import { url } from 'inspector'

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

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showCloudDialog, setShowCloudDialog] = useState(false)
    const { userId } = useSubscriptions()
    const router = useRouter()

    // Check if this is a new user
    useEffect(() => {
        async function checkUserData() {
            setIsLoading(true)
            try {
                // If user is logged in, mark as logged in before
                if (userId) {
                    markUserHasLoggedInBefore();

                    // Check if user has data in Supabase
                    const supabase = createClient();
                    const { data: existingData } = await supabase
                        .from('user_subscriptions')
                        .select('id')
                        .eq('user_id', userId)
                        .limit(1);

                    const hasSupabaseData = existingData && existingData.length > 0;

                    // If user has Supabase data, never show welcome modal or sign in banner
                    if (hasSupabaseData) {
                        setIsOpen(false);
                        setShowCloudDialog(false);
                        return;
                    }

                    // If logged in but no Supabase data, only show welcome if no local data
                    const localData = loadAppState();
                    setIsOpen(localData.subscriptions.length === 0);
                    setShowCloudDialog(false);
                } else {
                    // If not logged in, check local data and login history
                    const localData = loadAppState();
                    const hasLocalData = localData.subscriptions.length > 0;
                    const userLoggedInBefore = hasLoggedInBefore();

                    if (hasLocalData) {
                        setIsOpen(false);
                        // Show cloud dialog if they've logged in before
                        setShowCloudDialog(userLoggedInBefore);
                    } else {
                        // No local data - if they've logged in before, redirect to sign-in
                        if (userLoggedInBefore) {
                            router.push('/sign-in');
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
                if (!hasLocalData && hasLoggedInBefore()) {
                    router.push('/sign-in');
                    return;
                }
                setIsOpen(!hasLocalData);
            } finally {
                setIsLoading(false);
            }
        }
        checkUserData();
    }, [userId, router]);

    // Handler for adding a new subscription
    const handleAddSubscription = async (subscription: any) => {
        addSubscription(subscription)
        toast.success(`Added ${subscription.name} subscription`)
        setShowSubscriptionForm(false)
        // Force page reload to update the UI with the new subscription
        window.location.reload()
    }

    // Handler for importing test data
    const handleAddTestData = () => {
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
        // Force page reload to update the UI with the test subscriptions
        window.location.reload();
    };

    // Handler for removing local data and redirecting to sign-in
    const handleRemoveLocalData = () => {
        clearAppState();
        toast.success('Local data removed. Redirecting to sign-in...');
        // Short timeout to allow the toast to be visible
        setTimeout(() => {
            router.push('/sign-in');
        }, 1500);
    }

    if (isLoading) {
        return null // Don't show anything while checking data
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <CloudIcon className="h-6 w-6 text-primary" />
                            Welcome Back!
                        </DialogTitle>
                        <DialogDescription className="space-y-4 pt-2">

                        </DialogDescription>
                    </DialogHeader>
                    <DialogContent>
                        <div className="text-lg">
                            We noticed you've previously used cloud storage. Would you like to:
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <CloudIcon className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Sign in to access your cloud data</h3>
                                    <p className="text-muted-foreground text-sm">Access your existing subscriptions and continue where you left off.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <CloudOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Continue with local storage</h3>
                                    <p className="text-muted-foreground text-sm">Start fresh with local-only storage. You can always sign in later to move to cloud storage.</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <div className="flex flex-col gap-3">
                        <Button size="lg" onClick={() => router.push('/sign-in')}>
                            Sign in to Cloud Storage
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => setShowCloudDialog(false)}>
                            Continue Locally
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}