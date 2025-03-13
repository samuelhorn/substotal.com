'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

export function NotificationSettingsDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)} size="icon">
                <Bell className="w-4 h-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notification Settings</DialogTitle>
                        <DialogDescription>
                            Configure browser notifications for upcoming subscription payments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 items-center py-6">
                        <p className="text-muted-foreground text-center">
                            Notifications are coming soon! We're working on implementing this feature to help you stay on top of your subscriptions.
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                            Check back later for updates.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}