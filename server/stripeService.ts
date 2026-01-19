import { stripeStorage } from './stripeStorage';
import { getUncachableStripeClient } from './stripeClient';

export class StripeService {
  async createCustomer(email: string, userId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    mode: 'subscription' | 'payment' = 'subscription'
  ) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card', 'link'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async cancelSubscription(subscriptionId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  async getProduct(productId: string) {
    return await stripeStorage.getProduct(productId);
  }

  async getSubscription(subscriptionId: string) {
    return await stripeStorage.getSubscription(subscriptionId);
  }

  async listProducts() {
    return await stripeStorage.listProducts();
  }

  async listProductsWithPrices() {
    return await stripeStorage.listProductsWithPrices();
  }

  async getPricesForProduct(productId: string) {
    return await stripeStorage.getPricesForProduct(productId);
  }

  async getCustomer(customerId: string) {
    return await stripeStorage.getCustomer(customerId);
  }
}

export const stripeService = new StripeService();
