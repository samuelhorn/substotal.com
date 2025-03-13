import { getUpcomingPayments } from './subscriptions';
import { loadNotificationSettings } from './settings';
import { loadAppState } from './storage';

const SENT_NOTIFICATIONS_KEY = 'sent_notifications';

interface SentNotification {
    subscriptionId: string;
    paymentDate: string;
    sentAt: string;
}

function getSentNotifications(): SentNotification[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(SENT_NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveSentNotification(notification: SentNotification) {
    if (typeof window === 'undefined') return;
    const notifications = getSentNotifications();
    // Remove notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = notifications.filter(n =>
        new Date(n.sentAt) > thirtyDaysAgo
    );
    filtered.push(notification);
    localStorage.setItem(SENT_NOTIFICATIONS_KEY, JSON.stringify(filtered));
}

function hasNotificationBeenSent(subscriptionId: string, paymentDate: Date): boolean {
    const notifications = getSentNotifications();
    return notifications.some(n =>
        n.subscriptionId === subscriptionId &&
        n.paymentDate === paymentDate.toISOString()
    );
}

export async function requestAndVerifyPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
        return false;
    }
    
    // Safe access to Notification permission
    const permission = Notification.permission;
    
    if (permission === "granted") {
        return true;
    }
    
    if (permission === "denied") {
        return false;
    }
    
    try {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

export function checkAndScheduleNotifications() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return;
    }
    
    // Double check permissions each time
    if (!("Notification" in window)) {
        return;
    }
    
    // Safe access to Notification API
    try {
        if (Notification.permission !== "granted") {
            return;
        }
        
        const { enabled, reminderDays } = loadNotificationSettings();
        if (!enabled) {
            return;
        }
        
        const state = loadAppState();
        const upcomingPayments = getUpcomingPayments(state.subscriptions, reminderDays);
        const today = new Date();
        
        upcomingPayments.forEach(payment => {
            const daysUntilPayment = Math.floor(
                (payment.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            // Notify if payment is within the reminder period and hasn't been notified
            if (daysUntilPayment <= reminderDays && !hasNotificationBeenSent(payment.subscription.id, payment.date)) {
                const amount = new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: payment.subscription.currency
                }).format(payment.amount);
                
                let message: string;
                if (daysUntilPayment === 0) {
                    message = `${payment.subscription.name} payment of ${amount} is due today`;
                } else if (daysUntilPayment === 1) {
                    message = `${payment.subscription.name} payment of ${amount} is due tomorrow`;
                } else {
                    message = `${payment.subscription.name} payment of ${amount} is due in ${daysUntilPayment} days`;
                }
                
                try {
                    if ("Notification" in window) {
                        new Notification("Upcoming Subscription Payment", {
                            body: message,
                            icon: payment.subscription.url ?
                                `https://www.google.com/s2/favicons?domain=${new URL(payment.subscription.url).hostname}&sz=64` :
                                undefined,
                            requireInteraction: true // Make notification persist until user interacts with it
                        });
                        
                        // Record that we've sent this notification
                        saveSentNotification({
                            subscriptionId: payment.subscription.id,
                            paymentDate: payment.date.toISOString(),
                            sentAt: new Date().toISOString()
                        });
                    }
                } catch (error) {
                    console.error('Failed to send notification:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error in notification processing:', error);
    }
}

// Start checking for notifications when the window loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', async () => {
        try {
            const permissionGranted = await requestAndVerifyPermission();
            if (permissionGranted) {
                // Check immediately and then every hour
                checkAndScheduleNotifications();
                setInterval(checkAndScheduleNotifications, 60 * 60 * 1000);
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    });
}