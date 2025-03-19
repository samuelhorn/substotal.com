'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import AnalyticsPreferences from './analytics/analytics-preferences';
import { createClient } from '@/lib/supabase/supabase';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { BackupPreferences } from './backup-preferences';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setIsAuthenticated(!!user)
        }
        checkAuth()
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/'
    }

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
            <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <AnalyticsPreferences />
                    <BackupPreferences />
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-medium">
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex gap-2 justify-between items-start">
                            {isAuthenticated ? (
                                <>
                                    <p className="text-sm text-muted-foreground">Sign in to sync your data across devices</p>
                                    <Button onClick={handleSignOut} variant="destructive">
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-muted-foreground">Sign in to sync your data across devices</p>
                                    <Link href="/sign-in" className={buttonVariants()}>
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </DialogContent>
        </Dialog >
    )
}