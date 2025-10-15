import { Capacitor } from "@capacitor/core";
import { revenueCatService } from "./revenuecat-service";

/**
 * Payment Service - Platform-aware subscription handling
 * 
 * UPDATED Strategy for App Store compliance:
 * 1. iOS Native: Use RevenueCat/StoreKit for in-app purchases (PRIMARY)
 * 2. Web Browser: Use Stripe checkout (FALLBACK)
 * 
 * RevenueCat handles:
 * - StoreKit 2 integration on iOS
 * - Receipt validation via RevenueCat servers
 * - Subscription status syncing
 * - Cross-platform customer management
 */

export const paymentService = {
  /**
   * Check if we're running on iOS native (Capacitor)
   */
  isIOSNative(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
  },

  /**
   * Get the appropriate payment method for the current platform
   */
  getPaymentMethod(): 'revenuecat' | 'stripe' {
    if (this.isIOSNative() && revenueCatService.isAvailable()) {
      // Use RevenueCat/StoreKit on iOS native
      return 'revenuecat';
    }
    
    // Fallback to Stripe on web or if RevenueCat not available
    return 'stripe';
  },

  /**
   * Get payment instructions for the current platform
   */
  getPaymentInstructions(): {
    method: string;
    title: string;
    message: string;
    actionLabel: string;
  } {
    const method = this.getPaymentMethod();

    if (method === 'revenuecat') {
      return {
        method: 'revenuecat',
        title: 'Subscribe via App Store',
        message: 'Your subscription will be managed through the Apple App Store and charged to your Apple ID.',
        actionLabel: 'Continue to Subscribe',
      };
    }

    return {
      method: 'stripe',
      title: 'Subscribe to Premium',
      message: 'Get instant access to AI bill analysis, expert coaching, and unlimited dispute support.',
      actionLabel: 'Continue to Payment',
    };
  },

  /**
   * Handle subscription flow based on platform
   * Throws error if purchase fails, returns CustomerInfo if successful
   */
  async initiateSubscription(plan: 'monthly' | 'annual'): Promise<{
    method: 'revenuecat' | 'stripe';
    success: boolean;
    customerInfo?: any;
  }> {
    const method = this.getPaymentMethod();

    if (method === 'revenuecat') {
      try {
        // Use RevenueCat to purchase via StoreKit
        const customerInfo = await revenueCatService.purchaseByPlanType(plan);
        
        return {
          method: 'revenuecat',
          success: true,
          customerInfo,
        };
      } catch (error: any) {
        console.error('RevenueCat purchase failed:', error);
        throw error;
      }
    }

    // On web, Stripe flow will be handled by the calling code
    return {
      method: 'stripe',
      success: false, // Stripe requires additional UI flow
    };
  },

  /**
   * Platform-specific pricing display
   */
  getPricingDisplay(plan: 'monthly' | 'annual'): {
    amount: string;
    period: string;
    savings?: string;
  } {
    if (plan === 'monthly') {
      return {
        amount: '$29.99',
        period: 'per month',
      };
    }

    return {
      amount: '$299.99',
      period: 'per year',
      savings: 'Save $60 vs monthly',
    };
  },
};
