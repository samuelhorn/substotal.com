'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { AnimatePresence, motion } from 'motion/react';

export default function ConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Only show banner if consent hasn't been set yet
        const hasConsentChoice = localStorage.getItem('analytics_consent') !== null;
        setShowBanner(!hasConsentChoice);

        // Check for changes to consent status from other components/tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'analytics_consent' && e.newValue !== null) {
                setShowBanner(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleAccept = () => {
        if (typeof window.grantAnalyticsConsent === 'function') {
            window.grantAnalyticsConsent();
        }
        setShowBanner(false);
    };

    const handleDecline = () => {
        if (typeof window.denyAnalyticsConsent === 'function') {
            window.denyAnalyticsConsent();
        }
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15, ease: "easeIn" } }}
                    className="fixed bottom-0 left-0 right-0 flex flex-col justify-end z-50 bg-gradient-to-t from-background to-transparent p-4 pt-12 md:p-6 md:pt-16"
                >
                    {showBanner && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.5, type: "spring" } }}
                            exit={{ y: 100, opacity: 0, transition: { duration: 0.15, } }}
                        >
                            <Card className="mx-auto max-w-xl py-4 px-6 shadow-lg relative z-10">
                                <div>
                                    <h3 className="text-2xl font-medium">👋🏼 Hey there!</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        We use analytics cookies to understand how you use our website and to improve your experience.
                                        You can choose to <button className='cursor-pointer text-foreground underline underline-offset-2' onClick={handleAccept}>accept</button> or <button className='cursor-pointer text-foreground underline underline-offset-2' onClick={handleDecline}>decline</button> these cookies.
                                    </p>
                                    <div className="flex justify-end mt-6 -mx-2">
                                        <Button onClick={handleAccept} size="lg" className="cursor-pointer text-lg">
                                            Accept
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}