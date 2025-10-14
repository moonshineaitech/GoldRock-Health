/**
 * Notification Service - Web Push + iOS APNs ready
 * Handles push notifications for bill analysis completion, chat responses, etc.
 */

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.permission = Notification.permission;
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    
    if (permission === 'granted') {
      await this.registerServiceWorker();
      return true;
    }

    return false;
  }

  /**
   * Register service worker for push notifications
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Show local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    try {
      if (this.registration) {
        await this.registration.showNotification(payload.title, {
          body: payload.body,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          data: payload.data,
          tag: payload.data?.id || 'default',
          requireInteraction: false,
          vibrate: [200, 100, 200],
        });
      } else {
        // Fallback to browser notification
        new Notification(payload.title, {
          body: payload.body,
          icon: '/icon-192.png',
          data: payload.data,
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Schedule notification (for bill analysis completion)
   */
  async scheduleBillAnalysisNotification(billId: string, billName: string): Promise<void> {
    // Simulate async bill analysis (in real app, this would be triggered by backend)
    setTimeout(() => {
      this.showNotification({
        title: '💰 Bill Analysis Complete!',
        body: `We found potential savings on your ${billName}`,
        data: { billId, type: 'analysis_complete' },
      });
    }, 5000); // Show after 5 seconds
  }

  /**
   * Notify about chat response
   */
  async notifyChatResponse(message: string): Promise<void> {
    await this.showNotification({
      title: '💬 New AI Response',
      body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      data: { type: 'chat_response' },
    });
  }

  /**
   * Notify about payment reminder
   */
  async notifyPaymentReminder(billName: string, amount: number, dueDate: string): Promise<void> {
    await this.showNotification({
      title: '⏰ Bill Payment Reminder',
      body: `${billName} - $${amount.toFixed(2)} due ${dueDate}`,
      data: { type: 'payment_reminder' },
    });
  }

  /**
   * Get push notification token (for backend registration)
   * Web: Returns subscription endpoint
   * iOS: Would return APNs device token
   */
  async getPushToken(): Promise<string | null> {
    if (!this.registration) {
      await this.registerServiceWorker();
    }

    try {
      const subscription = await this.registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VAPID_PUBLIC_KEY || ''
        ),
      });

      return subscription ? JSON.stringify(subscription) : null;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Send token to backend for push notification registration
   */
  async registerPushToken(): Promise<void> {
    const token = await this.getPushToken();
    if (token) {
      try {
        await fetch('/api/push-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        console.log('Push token registered with backend');
      } catch (error) {
        console.error('Error registering push token:', error);
      }
    }
  }

  /**
   * Helper to convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }
}

export const notificationService = NotificationService.getInstance();
