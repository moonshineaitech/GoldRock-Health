import { Capacitor } from '@capacitor/core';
import { 
  Purchases, 
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PURCHASES_ERROR_CODE
} from '@revenuecat/purchases-capacitor';

export type SubscriptionPlan = 'monthly' | 'annual';

export interface RevenueCatProduct {
  identifier: string;
  price: string;
  priceString: string;
  currencyCode: string;
  title: string;
  description: string;
  planType: SubscriptionPlan;
}

class RevenueCatService {
  private initialized = false;
  private isNative = false;

  async initialize(userId?: string): Promise<void> {
    this.isNative = Capacitor.isNativePlatform();
    
    if (!this.isNative) {
      console.log('RevenueCat: Not on native platform, skipping initialization');
      return;
    }

    if (this.initialized) {
      console.log('RevenueCat: Already initialized');
      return;
    }

    const apiKey = import.meta.env.VITE_REVENUECAT_IOS_API_KEY;
    if (!apiKey) {
      console.error('RevenueCat: API key not found');
      throw new Error('RevenueCat API key is required for iOS IAP');
    }

    try {
      // Enable debug logging in development
      if (import.meta.env.DEV) {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      }

      // Configure RevenueCat with user ID
      await Purchases.configure({
        apiKey,
        appUserID: userId || undefined, // Optional - RevenueCat will generate anonymous ID if not provided
      });

      this.initialized = true;
      console.log('RevenueCat: Initialized successfully', userId ? `for user ${userId}` : '');

      // Set user attributes for analytics
      if (userId) {
        await Purchases.setAttributes({
          "$appUserId": userId,
        });
      }
    } catch (error) {
      console.error('RevenueCat: Initialization failed', error);
      throw error;
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    if (!this.isNative || !this.initialized) {
      console.log('RevenueCat: Cannot get offerings - not initialized or not native');
      return null;
    }

    try {
      const offerings = await Purchases.getOfferings();
      console.log('RevenueCat: Offerings fetched', offerings);
      return offerings.current;
    } catch (error) {
      console.error('RevenueCat: Failed to fetch offerings', error);
      throw error;
    }
  }

  async getProducts(): Promise<RevenueCatProduct[]> {
    const offering = await this.getOfferings();
    if (!offering) return [];

    const products: RevenueCatProduct[] = [];

    for (const pkg of offering.availablePackages) {
      const product = pkg.product;
      
      // Map package identifier to plan type
      let planType: SubscriptionPlan = 'monthly';
      if (pkg.identifier.toLowerCase().includes('annual') || pkg.identifier.toLowerCase().includes('yearly')) {
        planType = 'annual';
      } else if (pkg.identifier.toLowerCase().includes('monthly')) {
        planType = 'monthly';
      }

      products.push({
        identifier: product.identifier,
        price: product.price.toString(),
        priceString: product.priceString,
        currencyCode: product.currencyCode,
        title: product.title,
        description: product.description,
        planType,
      });
    }

    console.log('RevenueCat: Parsed products', products);
    return products;
  }

  async purchasePackage(packageIdentifier: string): Promise<CustomerInfo> {
    if (!this.isNative || !this.initialized) {
      throw new Error('RevenueCat not available on this platform');
    }

    try {
      const offering = await this.getOfferings();
      if (!offering) {
        throw new Error('No offerings available');
      }

      // Find the package by identifier
      const pkg = offering.availablePackages.find(
        (p) => p.identifier === packageIdentifier || 
               p.product.identifier === packageIdentifier
      );

      if (!pkg) {
        throw new Error(`Package not found: ${packageIdentifier}`);
      }

      console.log('RevenueCat: Purchasing package', pkg.identifier);
      
      const purchaseResult = await Purchases.purchasePackage({ 
        aPackage: pkg 
      });

      console.log('RevenueCat: Purchase successful', purchaseResult.customerInfo);
      return purchaseResult.customerInfo;
    } catch (error: any) {
      // Handle user cancellation gracefully
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        console.log('RevenueCat: Purchase cancelled by user');
        throw new Error('Purchase cancelled');
      }
      
      console.error('RevenueCat: Purchase failed', error);
      throw error;
    }
  }

  async purchaseByPlanType(planType: SubscriptionPlan): Promise<CustomerInfo> {
    const products = await this.getProducts();
    const product = products.find(p => p.planType === planType);
    
    if (!product) {
      throw new Error(`No product found for plan: ${planType}`);
    }

    return this.purchasePackage(product.identifier);
  }

  async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    plan: SubscriptionPlan | null;
    expirationDate: string | null;
  }> {
    if (!this.isNative || !this.initialized) {
      return { isSubscribed: false, plan: null, expirationDate: null };
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Check if user has any active entitlement (you'll configure this in RevenueCat dashboard)
      const hasPremium = customerInfo.customerInfo.entitlements.active['premium'] !== undefined;
      
      if (!hasPremium) {
        return { isSubscribed: false, plan: null, expirationDate: null };
      }

      const premiumEntitlement = customerInfo.customerInfo.entitlements.active['premium'];
      const expirationDate = premiumEntitlement.expirationDate || null;
      
      // Determine plan type based on product identifier
      const productId = premiumEntitlement.productIdentifier.toLowerCase();
      let plan: SubscriptionPlan = 'monthly';
      
      if (productId.includes('annual') || productId.includes('yearly') || productId.includes('year')) {
        plan = 'annual';
      }

      console.log('RevenueCat: Subscription status', { hasPremium, plan, expirationDate });
      
      return {
        isSubscribed: hasPremium,
        plan,
        expirationDate,
      };
    } catch (error) {
      console.error('RevenueCat: Failed to get subscription status', error);
      return { isSubscribed: false, plan: null, expirationDate: null };
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.isNative || !this.initialized) {
      throw new Error('RevenueCat not available on this platform');
    }

    try {
      console.log('RevenueCat: Restoring purchases');
      const result = await Purchases.restorePurchases();
      console.log('RevenueCat: Purchases restored', result.customerInfo);
      return result.customerInfo;
    } catch (error) {
      console.error('RevenueCat: Failed to restore purchases', error);
      throw error;
    }
  }

  async syncWithBackend(userId: string): Promise<void> {
    if (!this.isNative || !this.initialized) {
      return;
    }

    try {
      const status = await this.getSubscriptionStatus();
      
      // Sync subscription status with backend
      const response = await fetch('/api/subscriptions/sync-revenuecat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          isSubscribed: status.isSubscribed,
          plan: status.plan,
          expirationDate: status.expirationDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync with backend');
      }

      console.log('RevenueCat: Synced with backend successfully');
    } catch (error) {
      console.error('RevenueCat: Failed to sync with backend', error);
    }
  }

  isAvailable(): boolean {
    return this.isNative && this.initialized;
  }
}

export const revenueCatService = new RevenueCatService();
