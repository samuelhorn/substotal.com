import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { loadAppState } from '@/lib/storage'
import { ImportExport } from './import-export'
import { SubscriptionFormDialog } from './subscription-form-dialog'
import { addSubscription } from '@/lib/subscriptions'
import { toast } from 'sonner'

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)

    // Check if this is a new user
    useEffect(() => {
        // If localStorage has no data, this is a new user
        const appState = loadAppState()
        const isNewUser = appState.subscriptions.length === 0
        setIsOpen(isNewUser)
    }, [])

    // Handler for adding a new subscription
    const handleAddSubscription = (subscription: any) => {
        addSubscription(subscription)
        toast.success(`Added ${subscription.name} subscription`)
        setShowSubscriptionForm(false)
        // Force page reload to update the UI with the new subscription
        window.location.reload()
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
                    <DialogFooter className="flex flex-row gap-2 items-center justify-end pt-4">
                        <ImportExport
                            onImportComplete={() => setIsOpen(false)}
                            buttonProps={{
                                variant: "outline",
                                size: "default",
                            }}
                            buttonLabel="Import data"
                        />
                        <Button
                            onClick={() => {
                                setShowSubscriptionForm(true)
                                setIsOpen(false)
                            }}
                        >
                            Add subscription
                        </Button>
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
        </>
    )
}