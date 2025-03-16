'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Settings, Download, Upload } from 'lucide-react';
import AnalyticsPreferences from './analytics/analytics-preferences';
import { createClient } from '@/lib/supabase/supabase';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { toast } from 'sonner';
import { exportAppState, importAppState } from '@/lib/storage';

export function SettingsDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [importData, setImportData] = useState('')

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setIsAuthenticated(!!user)
            if (user) {
                setUserId(user.id)
            }
        }
        checkAuth()
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/'
    }

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
    }

    const handleImport = () => {
        if (!importData) {
            return;
        }

        try {
            if (importAppState(importData)) {
                toast.success('Settings imported successfully');
                window.location.reload();
            } else {
                toast.error('Invalid backup data');
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            toast.error('Failed to import settings');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 w-full">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <AnalyticsPreferences />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Export Subscription Data</h4>
                            <p className="text-sm text-muted-foreground">
                                Export your subscription data to a JSON file for backup or restore purposes.
                            </p>
                            <Button onClick={handleExport} size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Import Subscription Data</h4>
                            <p className="text-sm text-muted-foreground">
                                Import your subscription data by pasting JSON below and click import.
                            </p>
                            <textarea
                                placeholder="Paste your backup data here to import..."
                                value={importData}
                                onChange={(e) => setImportData(e.target.value)}
                                className="w-full min-h-[70px] p-2 rounded-md border"
                            />
                            <Button onClick={handleImport} size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </Button>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted-foreground">
                                You are signed in
                            </span>
                            <Button onClick={handleSignOut} variant="destructive">
                                Sign out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted-foreground">
                                Sign in to sync your data across devices
                            </span>
                            <Link href="/sign-in" className={buttonVariants()}>
                                Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    )
}