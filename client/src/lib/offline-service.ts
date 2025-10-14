/**
 * Offline Service - Data caching and sync queue
 * Enables offline bill viewing and queues uploads for when online
 */

interface QueuedAction {
  id: string;
  type: 'upload_bill' | 'send_message' | 'update_bill';
  data: any;
  timestamp: number;
  retries: number;
}

export class OfflineService {
  private static instance: OfflineService;
  private syncQueue: QueuedAction[] = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.loadQueue();
    this.setupListeners();
    this.registerServiceWorker(); // Register SW for offline caching
  }

  /**
   * Register service worker for offline support
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for offline support');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  /**
   * Setup online/offline listeners
   */
  private setupListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Check if device is online
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Cache bill data for offline access
   */
  async cacheBill(billId: string, billData: any): Promise<void> {
    try {
      const cache = await caches.open('goldrock-bills-v1');
      const response = new Response(JSON.stringify(billData));
      await cache.put(`/bill/${billId}`, response);
      console.log(`Bill ${billId} cached for offline access`);
    } catch (error) {
      console.error('Error caching bill:', error);
    }
  }

  /**
   * Get cached bill data
   */
  async getCachedBill(billId: string): Promise<any | null> {
    try {
      const cache = await caches.open('goldrock-bills-v1');
      const response = await cache.match(`/bill/${billId}`);
      if (response) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error retrieving cached bill:', error);
      return null;
    }
  }

  /**
   * Add action to sync queue (for offline operations)
   */
  async queueAction(type: QueuedAction['type'], data: any): Promise<void> {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.syncQueue.push(action);
    await this.saveQueue();

    // If online, process immediately
    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  /**
   * Process sync queue when online
   */
  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    console.log(`Processing ${this.syncQueue.length} queued actions...`);

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const action of queue) {
      try {
        await this.processAction(action);
        console.log(`Action ${action.id} processed successfully`);
      } catch (error) {
        console.error(`Action ${action.id} failed:`, error);
        
        // Retry logic
        if (action.retries < 3) {
          action.retries++;
          this.syncQueue.push(action);
        }
      }
    }

    await this.saveQueue();
  }

  /**
   * Process individual queued action
   */
  private async processAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'upload_bill':
        await fetch('/api/bills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data),
        });
        break;

      case 'send_message':
        await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data),
        });
        break;

      case 'update_bill':
        await fetch(`/api/bills/${action.data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data),
        });
        break;
    }
  }

  /**
   * Save queue to localStorage
   */
  private async saveQueue(): Promise<void> {
    try {
      localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const saved = localStorage.getItem('sync_queue');
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { pending: number; actions: QueuedAction[] } {
    return {
      pending: this.syncQueue.length,
      actions: this.syncQueue,
    };
  }

  /**
   * Clear queue (for testing)
   */
  clearQueue(): void {
    this.syncQueue = [];
    localStorage.removeItem('sync_queue');
  }

  /**
   * Prefetch critical data for offline use
   */
  async prefetchCriticalData(userId: string): Promise<void> {
    try {
      const cache = await caches.open('goldrock-critical-v1');
      
      // Fetch and cache user bills
      const billsResponse = await fetch('/api/bills');
      const bills = await billsResponse.json();
      await cache.put('/api/bills', new Response(JSON.stringify(bills)));

      // Cache each bill detail
      for (const bill of bills.slice(0, 10)) { // Only cache first 10
        await this.cacheBill(bill.id, bill);
      }

      // Cache user data
      const userResponse = await fetch('/api/auth/user');
      const user = await userResponse.json();
      await cache.put('/api/auth/user', new Response(JSON.stringify(user)));

      console.log('Critical data prefetched for offline use');
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  }

  /**
   * Get cache size estimate
   */
  async getCacheSize(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  /**
   * Clear all offline data
   */
  async clearOfflineData(): Promise<void> {
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      if (name.startsWith('goldrock-')) {
        await caches.delete(name);
      }
    }
    this.clearQueue();
    console.log('All offline data cleared');
  }
}

export const offlineService = OfflineService.getInstance();
