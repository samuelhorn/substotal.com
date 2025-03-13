'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { CloudDownload, CloudUpload, Cog } from 'lucide-react';
import AnalyticsPreferences from './analytics/analytics-preferences';
import { exportAppState, importAppState } from "@/lib/storage";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function SettingsDialog() {
    const [open, setOpen] = useState(false);
    const [importData, setImportData] = useState('');

    const handleExport = () => {
        const jsonData = exportAppState();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'subtrack-backup.json';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Settings exported successfully');
    };

    const handleImport = () => {
        if (!importData) {
            toast.error('Please paste your backup data');
            return;
        }

        try {
            if (importAppState(importData)) {
                toast.success('Settings imported successfully');
                // Reload the page to reflect changes
                window.location.reload();
            } else {
                toast.error('Invalid backup data');
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            toast.error('Failed to import settings');
        }
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)} size="icon">
                <Cog className="w-4 h-4" />
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
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="data-management">
                                <AccordionTrigger>Data Management</AccordionTrigger>
                                <AccordionContent className="space-y-4 CollapsibleContent">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-medium">
                                                Export Subscription Data
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex gap-4 items-center">
                                            <p className="text-sm text-muted-foreground">
                                                Export your subscription data to a JSON file for backup or restore purposes.
                                            </p>
                                            <Button size="sm" onClick={handleExport}>
                                                <CloudDownload className="w-4 h-4" />
                                                Export
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-medium">
                                                Import Subscription Data
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Textarea
                                                placeholder="Paste your backup data here to import..."
                                                value={importData}
                                                onChange={(e) => setImportData(e.target.value)}
                                                className="w-full min-h-[100px]"
                                            />
                                            <div className="flex gap-4 items-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Import your subscription data by pasting JSON above and click import.
                                                </p>
                                                <Button onClick={handleImport}>
                                                    <CloudUpload className="w-4 h-4" />
                                                    Import
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="notifications">
                                <AccordionTrigger>Notification Settings</AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-medium">
                                                Configure Push Notifications
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Notifications are coming soon! We&apos;re working on implementing this feature to help you stay on top of your subscriptions.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="privacy">
                                <AccordionTrigger>Privacy Settings</AccordionTrigger>
                                <AccordionContent>
                                    <AnalyticsPreferences />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
}