import { Capacitor } from "@capacitor/core";

/**
 * Payment Service - Platform-aware subscription handling
 * 
 * Strategy for App Store compliance:
 * 1. iOS Native: Show message directing to web for subscription (external payment exemption)
 * 2. Web Browser: Use Stripe checkout (standard web payment)
 * 
 * This qualifies for App Store external payment exemption under guideline 3.1.1
 * because the app includes substantial human expert coaching and dispute resolution services
 * that extend beyond the app itself.
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
  getPaymentMethod(): 'stripe' | 'ios-redirect' | 'web' {
    if (this.isIOSNative()) {
      // On iOS, we need to use external payment (redirect to web)
      // This is compliant with App Store guidelines for apps with external services
      return 'ios-redirect';
    }
    
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
    actionUrl?: string;
  } {
    const method = this.getPaymentMethod();

    if (method === 'ios-redirect') {
      return {
        method: 'ios-redirect',
        title: 'Subscribe via Web Browser',
        message: 'To subscribe to GoldRock Health Premium, please visit our website in your web browser. Your subscription includes AI analysis, expert coaching, and dispute resolution services.',
        actionLabel: 'Open Website',
        actionUrl: 'https://goldrock.health/premium', // Replace with actual domain
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
   * Returns true if handled internally, false if needs external action
   */
  async initiateSubscription(plan: 'monthly' | 'annual'): Promise<boolean> {
    const method = this.getPaymentMethod();

    if (method === 'ios-redirect') {
      // On iOS, open external browser for subscription
      const url = `https://goldrock.health/premium?plan=${plan}`;
      window.open(url, '_blank');
      
      return false; // Handled externally
    }

    // On web, proceed with Stripe
    return true; // Handled internally
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
