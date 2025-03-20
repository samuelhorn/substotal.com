'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Settings } from 'lucide-react';
import AnalyticsPreferences from './analytics/analytics-preferences';
import { BackupPreferences } from './backup-preferences';
import { AccountPreferences } from './account-preferences';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';

export function SettingsDialog() {
    const [isOpen, setIsOpen] = useState(false)

    const handleTriggerClick = (e: React.MouseEvent) => {
        // Prevent event from bubbling up to parent dropdown
        e.stopPropagation();
        setIsOpen(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center gap-2 w-full" onClick={handleTriggerClick}>
                <Settings className="w-5 h-5" />
                <span>Settings</span>
            </div>
            <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="account">
                            <AccordionTrigger>Account Settings</AccordionTrigger>
                            <AccordionContent>
                                <AccountPreferences />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="backup">
                            <AccordionTrigger>Backup &amp; Sync Settings</AccordionTrigger>
                            <AccordionContent>
                                <BackupPreferences />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="analytics">
                            <AccordionTrigger>Analytics Settings</AccordionTrigger>
                            <AccordionContent>
                                <AnalyticsPreferences />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog >
    )
}