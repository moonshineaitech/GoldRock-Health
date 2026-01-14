import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    
    let event: any;
    try {
      event = await sync.processWebhook(payload, signature);
    } catch (err) {
      console.error('Error processing webhook with stripeSync:', err);
      return;
    }
    
    if (event && event.type && event.data) {
      await WebhookHandlers.handleApplicationLogic(event);
    }
  }

  static async handleApplicationLogic(event: any): Promise<void> {
    console.log('Processing Stripe webhook for application:', event.type);

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          const customerId = invoice.customer;
          
          if (!customerId) {
            console.log('invoice.payment_succeeded: No customer ID, skipping');
            break;
          }
          
          if (invoice.subscription) {
            const stripeClient = await getUncachableStripeClient();
            const subscription = await stripeClient.subscriptions.retrieve(invoice.subscription as string);
            
            const user = await storage.getUserByStripeCustomerId(customerId);
            
            if (user) {
              console.log(`Payment succeeded for user ${user.id}, activating subscription`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'active',
                subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000)
              });
            } else {
              console.log(`invoice.payment_succeeded: No user found for customer ${customerId}`);
            }
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          const customerId = subscription.customer;
          
          if (!customerId) {
            console.log('customer.subscription.updated: No customer ID, skipping');
            break;
          }
          
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            console.log(`Subscription updated for user ${user.id}, status: ${subscription.status}`);
            await storage.upsertUser({
              ...user,
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
              subscriptionEndsAt: subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000) 
                : user.subscriptionEndsAt
            });
          } else {
            console.log(`customer.subscription.updated: No user found for customer ${customerId}`);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          const customerId = subscription.customer;
          
          if (!customerId) {
            console.log('customer.subscription.deleted: No customer ID, skipping');
            break;
          }
          
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            console.log(`Subscription cancelled for user ${user.id}`);
            await storage.upsertUser({
              ...user,
              subscriptionStatus: 'cancelled',
              subscriptionEndsAt: subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000)
                : user.subscriptionEndsAt
            });
          } else {
            console.log(`customer.subscription.deleted: No user found for customer ${customerId}`);
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          const customerId = invoice.customer;
          
          if (!customerId) {
            console.log('invoice.payment_failed: No customer ID, skipping');
            break;
          }
          
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            console.log(`Payment failed for user ${user.id}, marking subscription as past_due`);
            await storage.upsertUser({
              ...user,
              subscriptionStatus: 'past_due'
            });
          } else {
            console.log(`invoice.payment_failed: No user found for customer ${customerId}`);
          }
          break;
        }

        case 'checkout.session.completed': {
          const session = event.data.object as any;
          
          if (session.metadata?.planType === 'lifetime' && session.client_reference_id) {
            const user = await storage.getUser(session.client_reference_id);
            
            if (user) {
              console.log(`Lifetime purchase completed for user ${user.id}`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'active',
                subscriptionPlan: 'lifetime',
                subscriptionEndsAt: null
              });
            } else {
              console.log(`checkout.session.completed: No user found for client_reference_id ${session.client_reference_id}`);
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error in application webhook handler:', error);
    }
  }
}
