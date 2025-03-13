'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { Separator } from './ui/separator';
import AnalyticsPreferences from './analytics/analytics-preferences';

export function NotificationSettingsDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)} size="icon">
                <Bell className="w-4 h-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>
                            Configure your preferences for notifications and privacy.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Notifications</h3>
                            <div className="bg-muted/50 p-4 rounded-md">
                                <p className="text-muted-foreground text-sm">
                                    Notifications are coming soon! We&apos;re working on implementing this feature to help you stay on top of your subscriptions.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2">Privacy Settings</h3>
                            <AnalyticsPreferences />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}