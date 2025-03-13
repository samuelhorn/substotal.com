/**
 * Utility functions for safely working with the Notification API
 * This wrapper ensures all Notification access is safely guarded for mobile devices
 */

// Safe check if Notifications are supported
export const isNotificationSupported = (): boolean => {
    return typeof window !== 'undefined' && 'Notification' in window;
};

// Safe way to check notification permission
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }
    return Notification.permission;
};

// Safe way to request permission
export const requestPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }

    try {
        return await Notification.requestPermission();
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
};

// Safely create a notification
export const createNotification = (
    title: string,
    options?: NotificationOptions
): Notification | null => {
    if (!isNotificationSupported()) {
        return null;
    }

    try {
        if (getNotificationPermission() !== 'granted') {
            return null;
        }
        return new Notification(title, options);
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};