/**
 * Notification Service - Capacitor Push Notifications with web fallback
 * Handles push notifications for bill analysis completion, chat responses, etc.
 * iOS (Capacitor): Uses native Push Notifications + Local Notifications
 * Web: Uses Service Worker + Web Push API
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

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
  private isNative: boolean;
  private nativePermissionGranted: boolean = false;
  private notificationIdCounter: number = 1; // Counter for native notification IDs

  private constructor() {
    this.isNative = Capacitor.isNativePlatform();
    if (!this.isNative && typeof Notification !== 'undefined') {
      this.permission = Notification.permission;
    }
  }

  /**
   * Get next valid notification ID for iOS (1 to 999999999)
   */
  private getNextNotificationId(): number {
    const id = this.notificationIdCounter;
    this.notificationIdCounter = (this.notificationIdCounter % 999999999) + 1;
    return id;
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
    if (this.isNative) {
      try {
        // Request both push and local notification permissions
        const [pushPermStatus, localPermStatus] = await Promise.all([
          PushNotifications.checkPermissions(),
          LocalNotifications.checkPermissions()
        ]);
        
        if (pushPermStatus.receive === 'granted' && localPermStatus.display === 'granted') {
          this.nativePermissionGranted = true;
          await this.registerPushNotifications();
          return true;
        }

        const [pushResult, localResult] = await Promise.all([
          PushNotifications.requestPermissions(),
          LocalNotifications.requestPermissions()
        ]);
        
        if (pushResult.receive === 'granted' && localResult.display === 'granted') {
          this.nativePermissionGranted = true;
          await this.registerPushNotifications();
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error requesting push permission:', error);
        return false;
      }
    }

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
   * Register native push notifications (iOS/Android)
   */
  private async registerPushNotifications(): Promise<void> {
    if (!this.isNative) return;

    try {
      await PushNotifications.register();

      // Add listeners for push notification events
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        // Send token to backend
        this.sendTokenToBackend(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });
    } catch (error) {
      console.error('Error registering push notifications:', error);
    }
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
        this.registration = null;
        // Gracefully degrade - notifications will still work via browser API
      }
    }
  }

  /**
   * Check if service worker is registered
   */
  isServiceWorkerRegistered(): boolean {
    return this.registration !== null;
  }

  /**
   * Show local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    // Check permission based on platform
    const hasPermission = this.isNative ? this.nativePermissionGranted : this.permission === 'granted';
    
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return;
    }

    try {
      if (this.isNative) {
        // Use Capacitor Local Notifications on native platforms
        await LocalNotifications.schedule({
          notifications: [{
            title: payload.title,
            body: payload.body,
            id: this.getNextNotificationId(),
            schedule: { at: new Date(Date.now() + 100) }, // Show immediately
            sound: payload.sound,
            extra: payload.data,
          }]
        });
      } else if (this.registration) {
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
   * iOS: Returns APNs device token (handled in registerPushNotifications)
   */
  async getPushToken(): Promise<string | null> {
    // On native platforms, token is handled via PushNotifications listener
    if (this.isNative) {
      console.log('Native platform - token sent via registration listener');
      return null;
    }

    // Web platform - use service worker push
    if (!this.registration) {
      await this.registerServiceWorker();
    }

    // If still no registration, return null (will use fallback notifications)
    if (!this.registration) {
      console.log('Service Worker not available, using fallback notifications');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
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
      await this.sendTokenToBackend(token);
    }
  }

  /**
   * Send token to backend
   */
  private async sendTokenToBackend(token: string): Promise<void> {
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
