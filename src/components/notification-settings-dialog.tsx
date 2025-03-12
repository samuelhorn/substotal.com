'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Bell } from 'lucide-react';
import { loadNotificationSettings, saveNotificationSettings } from '@/lib/settings';
import { requestAndVerifyPermission } from '@/lib/notifications';
import { toast } from 'sonner';

export function NotificationSettingsDialog() {
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [reminderDays, setReminderDays] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const settings = loadNotificationSettings();
            setEnabled(settings.enabled);
            setReminderDays(settings.reminderDays);
            setPermissionGranted(Notification.permission === 'granted');
        }
    }, []);

    const handleEnableChange = async (checked: boolean) => {
        if (checked && !permissionGranted) {
            const granted = await requestAndVerifyPermission();
            if (!granted) {
                toast.error('Notification permission denied. Please enable notifications in your browser settings to receive reminders.');
                return;
            }
            setPermissionGranted(true);
        }
        setEnabled(checked);
        saveNotificationSettings({ enabled: checked, reminderDays });
    };

    const handleReminderDaysChange = (days: number) => {
        if (days >= 0 && days <= 30) {
            setReminderDays(days);
            saveNotificationSettings({ enabled, reminderDays: days });
        }
    };

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
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications" className="flex flex-col items-start gap-1">
                                <span>Enable Notifications</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    Get notified before payments are due
                                </span>
                            </Label>
                            <Switch
                                id="notifications"
                                checked={enabled}
                                onCheckedChange={handleEnableChange}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="reminderDays" className="flex flex-col items-start gap-1">
                                <span>Reminder Days</span>
                                <span className="font-normal text-sm text-muted-foreground">
                                    Days before payment to send reminder
                                </span>
                            </Label>
                            <Input
                                id="reminderDays"
                                className="w-20"
                                type="number"
                                min={0}
                                max={30}
                                value={reminderDays}
                                onChange={(e) => handleReminderDaysChange(parseInt(e.target.value) || 0)}
                                disabled={!enabled}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}