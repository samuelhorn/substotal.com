'use client';
import { useEffect } from 'react';
import { checkAndScheduleNotifications, requestAndVerifyPermission } from '@/lib/notifications';

export function NotificationsInit() {
    useEffect(() => {
        // Initialize notifications when the component mounts
        const initNotifications = async () => {
            const permissionGranted = await requestAndVerifyPermission();
            if (permissionGranted) {
                // Check immediately
                checkAndScheduleNotifications();
                // Check every minute for new notifications that fall within the reminder period
                const interval = setInterval(checkAndScheduleNotifications, 60 * 1000);
                return () => clearInterval(interval);
            }
        };

        initNotifications();
    }, []);

    return null;
}