import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { elevenLabsService } from "./services/elevenlabs";
import { medicalCasesService } from "./services/medicalCases";
// OpenAI service is accessed via aiProvider for automatic Gemini 3 Flash fallback
import { aiProvider } from "./services/aiProvider";
import { diagnosticEngine } from "./services/diagnosticEngine";
import { voiceCacheService } from "./services/voiceCache";
import { aiCaseGenerator, type CaseGenerationRequest } from "./services/aiCaseGenerator";
import { insertUserProgressSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, requiresSubscription, requiresAiAgreement } from "./replitAuth";
import { AchievementService } from "./services/achievementService";
import Stripe from "stripe";
import { z } from "zod";
import multer from "multer";
// We'll import pdfParse dynamically when needed to avoid loading issues

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Store Stripe price IDs
let MONTHLY_PRICE_ID: string;
let ANNUAL_PRICE_ID: string;
let LIFETIME_PRICE_ID: string;

// Setup Stripe prices on startup
async function setupStripe() {
  try {
    console.log('Setting up Stripe prices...');
    
    // Create or retrieve monthly price ($25)
    const existingPrices = await stripe.prices.list({ limit: 100 });
    
    let monthlyPrice = existingPrices.data.find(
      price => price.metadata?.plan === 'monthly' && price.unit_amount === 2500
    );
    
    if (!monthlyPrice) {
      console.log('Creating monthly price...');
      const product = await stripe.products.create({
        name: 'GoldRock AI Premium Monthly',
        description: 'Monthly subscription for GoldRock AI Premium features including medical bill AI analysis and unlimited medical training',
      });
      
      monthlyPrice = await stripe.prices.create({
        unit_amount: 2500, // $25.00
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
        metadata: {
          plan: 'monthly',
        },
      });
    }
    
    let annualPrice = existingPrices.data.find(
      price => price.metadata?.plan === 'annual' && price.unit_amount === 24900
    );
    
    if (!annualPrice) {
      console.log('Creating annual price...');
      const product = await stripe.products.create({
        name: 'GoldRock AI Premium Annual',
        description: 'Annual subscription for GoldRock AI Premium features including medical bill AI analysis and unlimited medical training (Save 17%)',
      });
      
      annualPrice = await stripe.prices.create({
        unit_amount: 24900, // $249.00
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        product: product.id,
        metadata: {
          plan: 'annual',
        },
      });
    }
    
    // Create or retrieve lifetime price ($747)
    let lifetimePrice = existingPrices.data.find(
      price => price.metadata?.plan === 'lifetime' && price.unit_amount === 74700
    );
    
    if (!lifetimePrice) {
      console.log('Creating lifetime price...');
      const product = await stripe.products.create({
        name: 'GoldRock AI Premium Lifetime',
        description: 'Lifetime access to GoldRock AI Premium features - pay once, use forever',
      });
      
      lifetimePrice = await stripe.prices.create({
        unit_amount: 74700, // $747.00
        currency: 'usd',
        product: product.id,
        metadata: {
          plan: 'lifetime',
        },
      });
    }
    
    MONTHLY_PRICE_ID = monthlyPrice.id;
    ANNUAL_PRICE_ID = annualPrice.id;
    LIFETIME_PRICE_ID = lifetimePrice.id;
    
    console.log(`Stripe setup complete:
    - Monthly Price ID: ${MONTHLY_PRICE_ID}
    - Annual Price ID: ${ANNUAL_PRICE_ID}
    - Lifetime Price ID: ${LIFETIME_PRICE_ID}`);
    
  } catch (error) {
    console.error('Failed to setup Stripe prices:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit per file
      files: 5, // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, WebP images and PDF files are allowed."));
      }
    },
  });

  // Initialize Stripe prices first
  await setupStripe();
  
  // Initialize medical cases on startup
  await medicalCasesService.initializeCases();
  
  // Initialize medical images on startup
  const { MedicalImageService } = await import("./services/medicalImageData");
  await MedicalImageService.initializeImages();
  
  // Initialize demo account for App Store reviewers
  const { seedDemoAccount } = await import("./seed-demo-account");
  await seedDemoAccount().catch(err => {
    console.log("Demo account seeding skipped (may already exist):", err.message);
  });
  
  // Initialize board exams on startup
  const { BoardExamService } = await import("./services/boardExamData");
  await BoardExamService.initializeExams();
  
  // Initialize clinical decision trees on startup
  const { ClinicalDecisionTreeService } = await import("./services/clinicalDecisionTreeData");
  await ClinicalDecisionTreeService.initializeTrees();

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // AI Terms acceptance endpoint
  app.post('/api/accept-ai-terms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { version } = req.body;

      if (!version) {
        return res.status(400).json({ message: 'AI terms version is required' });
      }

      const user = await storage.acceptAiTerms(userId, version);
      res.json({ 
        message: 'AI terms accepted successfully',
        user: {
          id: user.id,
          acceptedAiTerms: user.acceptedAiTerms,
          aiTermsAcceptedAt: user.aiTermsAcceptedAt,
          aiTermsVersion: user.aiTermsVersion
        }
      });
    } catch (error) {
      console.error('Error accepting AI terms:', error);
      res.status(500).json({ message: 'Failed to record AI terms acceptance' });
    }
  });

  // Account Deletion endpoint (Apple App Store requirement)
  app.delete('/api/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Cancel active Stripe subscription if exists
      if (user.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          console.log(`Cancelled Stripe subscription: ${user.stripeSubscriptionId}`);
        } catch (stripeError) {
          console.error('Error canceling Stripe subscription:', stripeError);
          // Continue with deletion even if subscription cancellation fails
        }
      }

      // Delete all user data
      await storage.deleteUser(userId);

      // Log out user (revoke session)
      req.logout(() => {
        res.json({ 
          message: 'Account successfully deleted',
          success: true
        });
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ message: 'Failed to delete account. Please try again or contact support.' });
    }
  });

  // User Data Rights (GDPR/Privacy Compliance)
  app.post('/api/user/delete-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await storage.deleteAllUserData(userId);
      
      if (result.success) {
        res.json({ 
          message: 'User data deletion completed successfully', 
          deletedCount: result.deletedCount 
        });
      } else {
        res.status(500).json({ message: 'Failed to delete user data' });
      }
    } catch (error) {
      console.error('Error deleting user data:', error);
      res.status(500).json({ message: 'Failed to delete user data' });
    }
  });

  app.get('/api/user/export-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userData = await storage.exportUserData(userId);
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-export-${new Date().toISOString().split('T')[0]}.json"`);
      
      res.json(userData);
    } catch (error) {
      console.error('Error exporting user data:', error);
      res.status(500).json({ message: 'Failed to export user data' });
    }
  });

  // Data retention cleanup endpoint (admin use)
  app.post('/api/admin/cleanup-old-data', async (req, res) => {
    try {
      const { retentionDays = 30, adminKey } = req.body;
      
      // Simple admin key check for cleanup operations
      if (adminKey !== process.env.ADMIN_CLEANUP_KEY) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const result = await storage.cleanupOldData(retentionDays);
      res.json({ 
        message: 'Data cleanup completed',
        ...result
      });
    } catch (error) {
      console.error('Error during data cleanup:', error);
      res.status(500).json({ message: 'Failed to cleanup old data' });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Donation checkout session
  app.post("/api/create-donation-session", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 100) {
        return res.status(400).json({ message: "Minimum donation is $1" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Support GoldRock AI',
                description: 'Your donation helps keep the platform free and accessible',
              },
              unit_amount: amount, // Amount already in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}/auth-landing?donation=success`,
        cancel_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}/auth-landing?donation=cancelled`,
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error('Error creating donation session:', error);
      res.status(500).json({ message: "Error creating donation session: " + error.message });
    }
  });

  // REBUILT SUBSCRIPTION SYSTEM - SetupIntent approach for reliable payment flow
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { planType } = req.body;
      
      // Validate planType against allowlist
      if (!planType || !['monthly', 'annual', 'lifetime'].includes(planType)) {
        return res.status(400).json({ message: 'Invalid plan type. Must be "monthly", "annual", or "lifetime"' });
      }
      
      // Handle lifetime plan differently - it's a one-time payment, not a subscription
      if (planType === 'lifetime') {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: LIFETIME_PRICE_ID,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}/premium?success=true&plan=lifetime`,
          cancel_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}/premium?cancelled=true`,
          client_reference_id: userId,
          metadata: {
            userId,
            planType: 'lifetime',
          },
        });
        
        return res.json({
          sessionId: session.id,
          sessionUrl: session.url,
        });
      }
      
      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      // Create Stripe customer if doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.upsertUser({
          ...user,
          stripeCustomerId: customerId,
        });
        user = { ...user, stripeCustomerId: customerId };
      }

      // Handle existing subscription case
      if (user.stripeSubscriptionId) {
        try {
          const existingSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

          // If subscription is active, return success
          if (existingSubscription.status === 'active') {
            return res.json({
              subscriptionId: existingSubscription.id,
              clientSecret: null,
              status: 'active'
            });
          }

          // Clean up any incomplete subscriptions
          if (['incomplete', 'incomplete_expired', 'past_due', 'canceled'].includes(existingSubscription.status)) {
            console.log(`Cleaning up existing ${existingSubscription.status} subscription ${existingSubscription.id}`);
            try {
              await stripe.subscriptions.cancel(existingSubscription.id);
            } catch (cancelError) {
              console.warn('Error cancelling existing subscription:', cancelError);
            }
            
            // Clear subscription from user record
            await storage.upsertUser({
              ...user,
              stripeSubscriptionId: null,
              subscriptionStatus: 'inactive',
            });
            user = { ...user, stripeSubscriptionId: null, subscriptionStatus: 'inactive' };
          }
        } catch (error: any) {
          console.error('Error checking existing subscription:', error);
          // Continue with creating new subscription
        }
      }

      // Get the correct price ID based on plan type
      const selectedPriceId = planType === 'annual' ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID;
      
      console.log(`Creating subscription for user ${userId} with plan ${planType}, priceId: ${selectedPriceId}`);
      
      // RELIABLE APPROACH: Use SetupIntent for guaranteed payment flow
      // Step 1: Create SetupIntent for payment method collection
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session', // For future payments
        metadata: {
          userId: userId,
          planType: planType,
          priceId: selectedPriceId,
        },
      });

      console.log('SetupIntent created:', {
        setupIntentId: setupIntent.id,
        clientSecret: setupIntent.client_secret,
        status: setupIntent.status,
      });

      // Return SetupIntent client secret for payment method collection
      // The frontend will confirm this, then call our confirm-subscription endpoint
      res.json({
        setupIntentId: setupIntent.id,
        clientSecret: setupIntent.client_secret,
        status: 'requires_payment_method',
        planType: planType,
        priceId: selectedPriceId,
      });

    } catch (error: any) {
      console.error('Error creating subscription setup:', error);
      res.status(500).json({ 
        message: 'Failed to setup subscription. Please try again.',
        error: error.message 
      });
    }
  });

  // NEW: Confirm subscription after payment method is set up
  app.post('/api/confirm-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { setupIntentId } = req.body;
      
      if (!setupIntentId) {
        return res.status(400).json({ message: 'SetupIntent ID is required' });
      }

      // Retrieve the SetupIntent to get metadata and payment method
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
      
      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          message: 'Payment method setup not completed yet',
          status: setupIntent.status 
        });
      }

      if (!setupIntent.payment_method) {
        return res.status(400).json({ message: 'No payment method found' });
      }

      // Get metadata from SetupIntent
      const planType = setupIntent.metadata?.planType;
      const priceId = setupIntent.metadata?.priceId;
      
      if (!planType || !priceId) {
        return res.status(400).json({ message: 'Invalid setup intent metadata' });
      }

      let user = await storage.getUser(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ message: 'User or customer not found' });
      }

      console.log(`Confirming subscription for user ${userId} with payment method ${setupIntent.payment_method}`);

      // Create subscription with the confirmed payment method
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{
          price: priceId,
        }],
        default_payment_method: setupIntent.payment_method as string,
        expand: ['latest_invoice.payment_intent'],
      });

      console.log('Subscription created with payment method:', {
        subscriptionId: subscription.id,
        status: subscription.status,
        defaultPaymentMethod: subscription.default_payment_method,
      });

      // Update user with subscription details
      await storage.upsertUser({
        ...user,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: planType,
      });

      // If subscription requires additional payment confirmation (3D Secure, etc.)
      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent;

      if (paymentIntent && paymentIntent.status === 'requires_action') {
        console.log('Subscription requires additional payment confirmation');
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
          status: 'requires_action'
        });
      }

      // Success case
      if (subscription.status === 'active') {
        console.log('Subscription successfully activated');
        return res.json({
          subscriptionId: subscription.id,
          status: 'active',
          message: 'Subscription activated successfully'
        });
      }

      // Handle other statuses
      return res.json({
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: paymentIntent?.client_secret || null,
      });

    } catch (error: any) {
      console.error('Error confirming subscription:', error);
      res.status(500).json({ 
        message: 'Failed to confirm subscription. Please try again.',
        error: error.message 
      });
    }
  });

  // Check subscription status
  app.get('/api/subscription-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const subscriptionStatus = {
        isSubscribed: user.subscriptionStatus === 'active',
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        endsAt: user.subscriptionEndsAt,
      };

      res.json(subscriptionStatus);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({ message: 'Failed to check subscription status' });
    }
  });

  // Stripe webhook endpoint - needs raw body for signature verification
  app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received Stripe webhook:', event.type);

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            
            // Find user by stripe customer ID
            const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
            
            if (user) {
              console.log(`Payment succeeded for user ${user.id}, activating subscription`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'active',
                subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000)
              });
            }
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          
          // Find user by stripe customer ID
          const users = await storage.getAllUsers();
          const user = users.find(u => u.stripeCustomerId === subscription.customer);
          
          if (user) {
            console.log(`Subscription updated for user ${user.id}, status: ${subscription.status}`);
            await storage.upsertUser({
              ...user,
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
              subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000)
            });
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          
          // Find user by stripe customer ID
          const users = await storage.getAllUsers();
          const user = users.find(u => u.stripeCustomerId === subscription.customer);
          
          if (user) {
            console.log(`Subscription cancelled for user ${user.id}`);
            await storage.upsertUser({
              ...user,
              subscriptionStatus: 'cancelled',
              subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000)
            });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            
            // Find user by stripe customer ID
            const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
            
            if (user) {
              console.log(`Payment failed for user ${user.id}, marking subscription as past_due`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'past_due'
              });
            }
          }
          break;
        }

        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // RevenueCat webhook endpoint for iOS subscription events
  app.post('/api/webhooks/revenuecat', express.json(), async (req, res) => {
    try {
      const event = req.body;
      console.log('Received RevenueCat webhook:', event.type);

      // RevenueCat sends different event types
      // Documentation: https://www.revenuecat.com/docs/webhooks
      
      const eventType = event.type;
      const appUserId = event.event?.app_user_id; // This is our user ID
      const productId = event.event?.product_id;
      const expirationDate = event.event?.expiration_at_ms;

      switch (eventType) {
        case 'INITIAL_PURCHASE':
        case 'RENEWAL':
        case 'NON_RENEWING_PURCHASE': {
          // User purchased or renewed subscription
          if (appUserId) {
            const user = await storage.getUser(appUserId);
            
            if (user) {
              console.log(`RevenueCat: ${eventType} for user ${user.id}`);
              
              // Determine plan type from product ID
              let plan: 'monthly' | 'annual' = 'monthly';
              if (productId?.toLowerCase().includes('annual') || productId?.toLowerCase().includes('yearly')) {
                plan = 'annual';
              }

              await storage.upsertUser({
                ...user,
                revenuecatCustomerId: event.event?.original_app_user_id || appUserId,
                subscriptionStatus: 'active',
                subscriptionPlan: plan,
                subscriptionEndsAt: expirationDate ? new Date(expirationDate) : null,
              });
            }
          }
          break;
        }

        case 'CANCELLATION':
        case 'EXPIRATION': {
          // Subscription cancelled or expired
          if (appUserId) {
            const user = await storage.getUser(appUserId);
            
            if (user) {
              console.log(`RevenueCat: ${eventType} for user ${user.id}`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'inactive',
                subscriptionEndsAt: expirationDate ? new Date(expirationDate) : null,
              });
            }
          }
          break;
        }

        case 'UNCANCELLATION': {
          // User re-enabled subscription
          if (appUserId) {
            const user = await storage.getUser(appUserId);
            
            if (user) {
              console.log(`RevenueCat: Subscription reactivated for user ${user.id}`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'active',
                subscriptionEndsAt: expirationDate ? new Date(expirationDate) : null,
              });
            }
          }
          break;
        }

        case 'BILLING_ISSUE': {
          // Payment failed
          if (appUserId) {
            const user = await storage.getUser(appUserId);
            
            if (user) {
              console.log(`RevenueCat: Billing issue for user ${user.id}`);
              await storage.upsertUser({
                ...user,
                subscriptionStatus: 'past_due',
              });
            }
          }
          break;
        }

        default:
          console.log(`Unhandled RevenueCat webhook event type: ${eventType}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing RevenueCat webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Medical Cases Routes
  app.get('/api/cases', async (req, res) => {
    try {
      const { specialty, difficulty, search } = req.query;
      const filters = {
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        search: search as string,
      };
      
      const cases = await storage.getMedicalCases(filters);
      res.json(cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({ message: 'Failed to fetch medical cases' });
    }
  });

  app.get('/api/cases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const medicalCase = await storage.getMedicalCase(id);
      
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }
      
      res.json(medicalCase);
    } catch (error) {
      console.error('Error fetching case:', error);
      res.status(500).json({ message: 'Failed to fetch medical case' });
    }
  });

  // User Progress Routes
  app.get('/api/progress/:caseId', async (req, res) => {
    try {
      const { caseId } = req.params;
      const progress = await storage.getUserProgress(caseId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const progress = await storage.createUserProgress(progressData);
      
      // If the case was completed, update stats and check achievements
      if (progress.completed && progress.accuracy && progress.timeElapsed) {
        await AchievementService.updateStatsAfterCaseCompletion(
          userId,
          progress.caseId,
          parseFloat(progress.accuracy),
          progress.timeElapsed
        );
        
        // Check for newly unlocked achievements
        const newAchievements = await AchievementService.checkAndUnlockAchievements(userId);
        
        // Return progress along with any new achievements
        res.status(201).json({
          progress,
          newAchievements: newAchievements.map(na => ({
            achievement: na.achievement,
            points: na.achievement.points
          }))
        });
      } else {
        res.status(201).json({ progress, newAchievements: [] });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid progress data', errors: error.errors });
      }
      console.error('Error creating progress:', error);
      res.status(500).json({ message: 'Failed to create progress record' });
    }
  });

  app.patch('/api/progress/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const progress = await storage.updateUserProgress(id, updates);
      
      if (!progress) {
        return res.status(404).json({ message: 'Progress record not found' });
      }
      
      res.json(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Failed to update progress' });
    }
  });

  // Voice Synthesis Routes
  app.post('/api/voice/synthesize', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { text, patientProfile } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: 'Text is required for synthesis' });
      }

      let result;
      if (patientProfile) {
        result = await elevenLabsService.synthesizePatientResponse(text, patientProfile);
      } else {
        result = await elevenLabsService.synthesizeText({ text });
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error synthesizing voice:', error);
      res.status(500).json({ message: 'Failed to synthesize voice' });
    }
  });

  app.get('/api/voice/voices', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const voices = await elevenLabsService.getAvailableVoices();
      res.json(voices);
    } catch (error) {
      console.error('Error fetching voices:', error);
      res.status(500).json({ message: 'Failed to fetch available voices' });
    }
  });

  // Serve cached voice files
  app.get('/api/voice-cache/:filename', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename.endsWith('.mp3')) {
        return res.status(400).json({ message: 'Invalid file format' });
      }

      const audioBuffer = await voiceCacheService.getCachedAudioFile(filename);
      
      if (!audioBuffer) {
        return res.status(404).json({ message: 'Audio file not found' });
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      });
      
      res.send(audioBuffer);
    } catch (error) {
      console.error('Error serving cached audio:', error);
      res.status(500).json({ message: 'Failed to serve audio file' });
    }
  });

  // Platform Statistics Route
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      if (!stats) {
        // Create initial stats if none exist
        const newStats = await storage.updatePlatformStats();
        return res.json(newStats);
      }
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch platform statistics' });
    }
  });

  // Achievements Routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Failed to fetch achievements' });
    }
  });

  app.get('/api/user-achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ message: 'Failed to fetch user achievements' });
    }
  });

  app.post('/api/achievements/:id/unlock', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.claims?.sub;
      const achievement = await storage.unlockAchievement(id, userId);
      res.status(201).json(achievement);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      res.status(500).json({ message: 'Failed to unlock achievement' });
    }
  });

  // Update achievement progress
  app.post('/api/achievements/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userId = req.user?.claims?.sub;
      const achievement = await storage.updateAchievementProgress(userId, id, progress);
      res.json(achievement);
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      res.status(500).json({ message: 'Failed to update achievement progress' });
    }
  });

  // Check and unlock achievements automatically
  app.post('/api/achievements/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const unlockedAchievements = await AchievementService.checkAndUnlockAchievements(userId);
      res.json(unlockedAchievements);
    } catch (error) {
      console.error('Error checking achievements:', error);
      res.status(500).json({ message: 'Failed to check achievements' });
    }
  });

  // User Statistics Routes
  app.get('/api/user-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let userStats = await storage.getUserStats(userId);
      
      if (!userStats) {
        userStats = await storage.initializeUserStats(userId);
      }
      
      res.json(userStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Failed to fetch user statistics' });
    }
  });

  app.put('/api/user-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const updates = req.body;
      const userStats = await storage.updateUserStats(userId, updates);
      res.json(userStats);
    } catch (error) {
      console.error('Error updating user stats:', error);
      res.status(500).json({ message: 'Failed to update user statistics' });
    }
  });

  app.get('/api/user-progress-summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      // Get user basic info
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get all user progress records
      const allProgress = await storage.getUserProgress('', userId);
      
      // Get user achievements
      const userAchievements = await storage.getUserAchievements(userId);
      
      // Calculate summary statistics
      const completedCases = allProgress.filter(p => p.completed).length;
      const totalAccuracy = allProgress.length > 0 
        ? allProgress.reduce((sum, p) => sum + (parseFloat(p.accuracy || '0')), 0) / allProgress.length 
        : 0;
      const totalScore = allProgress.reduce((sum, p) => sum + (p.score || 0), 0);
      const totalPoints = userAchievements.reduce((sum: number, ua: any) => sum + (ua.points || 0), 0);
      
      // Calculate specialty progress
      const specialtyProgress: Record<string, { completed: number; accuracy: number }> = {};
      for (const progress of allProgress.filter(p => p.completed)) {
        // This would ideally get specialty from the medical case
        // For now, we'll use a placeholder approach
        const specialty = 'General'; // You'd need to join with medical cases to get actual specialty
        if (!specialtyProgress[specialty]) {
          specialtyProgress[specialty] = { completed: 0, accuracy: 0 };
        }
        specialtyProgress[specialty].completed++;
        specialtyProgress[specialty].accuracy += parseFloat(progress.accuracy || '0');
      }
      
      // Calculate average accuracy per specialty
      Object.keys(specialtyProgress).forEach(specialty => {
        if (specialtyProgress[specialty].completed > 0) {
          specialtyProgress[specialty].accuracy /= specialtyProgress[specialty].completed;
        }
      });

      const summary = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl
        },
        stats: {
          casesCompleted: completedCases,
          accuracy: Math.round(totalAccuracy * 100) / 100,
          totalScore,
          totalPoints,
          achievementsUnlocked: userAchievements.length,
          currentStreak: 0, // Would need additional logic to calculate streaks
          timeSpent: allProgress.reduce((sum, p) => sum + (p.timeElapsed || 0), 0)
        },
        specialtyProgress,
        recentAchievements: userAchievements.slice(0, 5),
        recentActivity: allProgress.slice(0, 10)
      };

      res.json(summary);
    } catch (error) {
      console.error('Error fetching user progress summary:', error);
      res.status(500).json({ message: 'Failed to fetch user progress summary' });
    }
  });

  // Case Question/Response System with AI Integration
  app.post('/api/cases/:id/ask', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      const { question, conversationHistory = [] } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      let response = "I'm not sure I understand that question. Could you ask it differently?";
      let medicalAccuracy = 5;
      let suggestionForDoctor = undefined;

      // Use AI provider (Gemini 3 Flash primary, OpenAI fallback) for intelligent responses
      try {
        const patientPrompt = `You are a patient in a medical training simulation. Based on the following case, respond to the doctor's question as the patient would.

Case Information:
- Chief Complaint: ${medicalCase.chiefComplaint}
- Symptoms: ${(medicalCase.symptoms || []).join(', ')}
- Medical History: ${medicalCase.medicalHistory || 'None provided'}
- Physical Exam: ${JSON.stringify(medicalCase.physicalExam || {})}

Previous conversation: ${conversationHistory.map((h: any) => `${h.role}: ${h.content}`).join('\n')}

Doctor's question: "${question}"

Respond as the patient would, staying in character. Rate the medical relevance of the question (1-10).

Respond in JSON format:
{
  "response": "Patient's natural response",
  "medicalAccuracy": 5,
  "suggestionForDoctor": "Optional hint if the question is off-track"
}`;

        const aiResult = await aiProvider.generateJSON<{
          response: string;
          medicalAccuracy: number;
          suggestionForDoctor?: string;
        }>(patientPrompt, 'You are a patient simulator for medical training. Stay in character.', { temperature: 0.7 });
        
        response = aiResult.response;
        medicalAccuracy = aiResult.medicalAccuracy;
        suggestionForDoctor = aiResult.suggestionForDoctor;
      } catch (aiError) {
        console.warn('AI response failed, falling back to predefined responses:', aiError);
        
        // Fallback to predefined responses
        const responses = medicalCase.responses || {};
        const questionLower = question.toLowerCase();
        
        for (const [key, value] of Object.entries(responses)) {
          if (questionLower.includes(key.toLowerCase()) || 
              key.toLowerCase().includes(questionLower)) {
            response = value;
            break;
          }
        }
      }

      // Synthesize voice response if ElevenLabs is available
      let audioUrl = null;
      try {
        const voiceResult = await elevenLabsService.synthesizePatientResponse(response, {
          age: medicalCase.age,
          gender: medicalCase.gender,
        });
        audioUrl = voiceResult.audioUrl;
      } catch (voiceError) {
        console.warn('Voice synthesis failed, continuing without audio:', voiceError);
      }

      res.json({
        question,
        response,
        audioUrl,
        medicalAccuracy,
        suggestionForDoctor,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error processing question:', error);
      res.status(500).json({ message: 'Failed to process question' });
    }
  });

  // Diagnosis Submission with AI Feedback
  app.post('/api/cases/:id/diagnose', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      const { diagnosis, confidence, questionsAsked = [], timeElapsed } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      let accuracy = 0;
      let feedback = "";
      let recommendations: string[] = [];
      let missedFindings: string[] = [];

      // Use AI provider (Gemini 3 Flash primary, OpenAI fallback) for intelligent feedback
      try {
        const feedbackPrompt = `You are a medical education AI providing feedback on a student's diagnosis.

Student's Diagnosis: "${diagnosis}"
Correct Diagnosis: "${medicalCase.correctDiagnosis}"

Case Details:
- Chief Complaint: ${medicalCase.chiefComplaint}
- Symptoms: ${(medicalCase.symptoms || []).join(', ')}
- Physical Exam: ${JSON.stringify(medicalCase.physicalExam || {})}
- Questions Asked: ${questionsAsked.length} questions
- Time Elapsed: ${timeElapsed} seconds

Evaluate the diagnosis and provide constructive feedback.

Respond in JSON format:
{
  "accuracy": 0-100,
  "feedback": "Constructive feedback message",
  "recommendations": ["Study recommendation 1", "Study recommendation 2"],
  "missedFindings": ["Finding they should have caught", "Another missed clue"]
}`;

        const aiFeedback = await aiProvider.generateJSON<{
          accuracy: number;
          feedback: string;
          recommendations?: string[];
          missedFindings?: string[];
        }>(feedbackPrompt, 'You are an expert medical educator providing constructive feedback.', { temperature: 0.3 });
        
        accuracy = aiFeedback.accuracy;
        feedback = aiFeedback.feedback;
        recommendations = aiFeedback.recommendations || [];
        missedFindings = aiFeedback.missedFindings || [];
      } catch (aiError) {
        console.warn('AI feedback failed, using fallback logic:', aiError);
        
        // Fallback logic
        const isCorrect = diagnosis.toLowerCase().includes(medicalCase.correctDiagnosis.toLowerCase()) ||
                         medicalCase.correctDiagnosis.toLowerCase().includes(diagnosis.toLowerCase());
        accuracy = isCorrect ? 85 : 25;
        feedback = isCorrect ? 
          "Excellent diagnosis! You correctly identified the condition." :
          `The correct diagnosis is ${medicalCase.correctDiagnosis}. Review the key symptoms and clinical findings.`;
      }

      const score = Math.round((accuracy + (confidence * 10) - (questionsAsked.length * 2) - (timeElapsed * 0.1)) * 10) / 10;

      // Create progress record
      const progress = await storage.createUserProgress({
        caseId: id,
        questionsAsked: questionsAsked.length,
        timeElapsed,
        diagnosis,
        confidence,
        accuracy: accuracy.toString(),
        completed: true,
        score: Math.max(0, score),
        feedback
      });

      res.json({
        correct: accuracy >= 70,
        correctDiagnosis: medicalCase.correctDiagnosis,
        accuracy,
        score: progress.score,
        feedback,
        recommendations,
        missedFindings,
        learningObjectives: medicalCase.learningObjectives,
        treatment: medicalCase.correctTreatment,
      });
    } catch (error) {
      console.error('Error processing diagnosis:', error);
      res.status(500).json({ message: 'Failed to process diagnosis' });
    }
  });

  // Simple AI Diagnosis Checking for Pixel Game
  app.post('/api/cases/check-diagnosis', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { userDiagnosis, correctDiagnosis, symptoms = [], questionsAsked = [], orderedTests = [] } = req.body;
      
      if (!userDiagnosis || !correctDiagnosis) {
        return res.status(400).json({ message: 'User diagnosis and correct diagnosis are required' });
      }

      let isCorrect = false;

      // Use AI provider (Gemini 3 Flash primary, OpenAI fallback) for intelligent diagnosis matching
      try {
        const prompt = `You are a medical education AI that needs to determine if a student's diagnosis is medically equivalent to the correct diagnosis.

Student's diagnosis: "${userDiagnosis}"
Correct diagnosis: "${correctDiagnosis}"
Patient symptoms: ${symptoms.join(', ')}
Questions asked: ${questionsAsked.join(', ')}
Tests ordered: ${orderedTests.join(', ')}

Determine if the student's diagnosis is medically equivalent, close enough, or refers to the same condition as the correct diagnosis. Consider:
- Synonyms (e.g., "heart attack" vs "myocardial infarction")
- Abbreviated forms (e.g., "MI" vs "myocardial infarction")
- Related conditions that would be clinically acceptable
- Different levels of specificity (e.g., "pneumonia" vs "bacterial pneumonia")

Respond with ONLY a JSON object:
{
  "isCorrect": true,
  "confidence": 0.95,
  "reasoning": "brief explanation"
}`;

        const result = await aiProvider.generateJSON<{
          isCorrect: boolean;
          confidence: number;
          reasoning: string;
        }>(prompt, 'You are an expert medical educator evaluating student diagnoses for accuracy.', { temperature: 0.1 });
        
        isCorrect = result.isCorrect || false;
        
        res.json({ 
          isCorrect, 
          confidence: result.confidence || 0.5,
          reasoning: result.reasoning || 'AI evaluation completed',
          method: 'ai'
        });
        return;
      } catch (aiError) {
        console.warn('AI diagnosis check failed, using fallback logic:', aiError);
      }

      // Fallback to simple text matching
      const userDiagLower = userDiagnosis.toLowerCase().trim();
      const correctDiagLower = correctDiagnosis.toLowerCase().trim();
      
      isCorrect = userDiagLower.includes(correctDiagLower) || 
                  correctDiagLower.includes(userDiagLower) ||
                  userDiagLower === correctDiagLower;

      res.json({ 
        isCorrect, 
        confidence: isCorrect ? 0.8 : 0.2,
        reasoning: isCorrect ? 'Text matching successful' : 'No text match found',
        method: 'fallback'
      });
    } catch (error) {
      console.error('Error checking diagnosis:', error);
      res.status(500).json({ message: 'Failed to check diagnosis' });
    }
  });

  // AI Learning Recommendations Route
  app.post('/api/learning-recommendations', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { userPerformance } = req.body;
      
      const prompt = `Based on the following medical student performance data, generate personalized learning recommendations:

Performance Data:
${JSON.stringify(userPerformance, null, 2)}

Provide recommendations in JSON format:
{
  "strengths": ["Area where student excels"],
  "weaknesses": ["Area needing improvement"],
  "recommendations": [
    {
      "topic": "Topic to study",
      "priority": "high|medium|low",
      "resources": ["Suggested resource"],
      "rationale": "Why this is recommended"
    }
  ],
  "nextSteps": ["Immediate action to take"]
}`;

      const recommendations = await aiProvider.generateJSON<{
        strengths: string[];
        weaknesses: string[];
        recommendations: Array<{
          topic: string;
          priority: string;
          resources: string[];
          rationale: string;
        }>;
        nextSteps: string[];
      }>(prompt, 'You are a medical education advisor providing personalized learning guidance.', { temperature: 0.5 });
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      res.status(500).json({ message: 'Failed to generate recommendations' });
    }
  });

  // Advanced Diagnostic Features
  app.post('/api/cases/:id/differential-diagnosis', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const differentials = await diagnosticEngine.generateDifferentialDiagnosis(
        medicalCase.chiefComplaint,
        medicalCase.symptoms || [],
        medicalCase.physicalExam,
        medicalCase.medicalHistory
      );

      res.json({ differentials });
    } catch (error) {
      console.error('Error generating differential diagnosis:', error);
      res.status(500).json({ message: 'Failed to generate differential diagnosis' });
    }
  });

  app.post('/api/cases/:id/clinical-reasoning', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      const { questionsAsked = [] } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const reasoning = await diagnosticEngine.generateClinicalReasoning(medicalCase, questionsAsked);
      res.json(reasoning);
    } catch (error) {
      console.error('Error generating clinical reasoning:', error);
      res.status(500).json({ message: 'Failed to generate clinical reasoning' });
    }
  });

  app.post('/api/cases/:id/physical-exam/:system', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id, system } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const findings = await diagnosticEngine.simulatePhysicalExam(system, medicalCase);
      res.json({ system, findings });
    } catch (error) {
      console.error('Error simulating physical exam:', error);
      res.status(500).json({ message: 'Failed to simulate physical exam' });
    }
  });

  app.post('/api/cases/:id/learning-objectives', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      const { userPerformance } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const objectives = await diagnosticEngine.generateLearningObjectives(medicalCase, userPerformance);
      res.json({ objectives });
    } catch (error) {
      console.error('Error generating learning objectives:', error);
      res.status(500).json({ message: 'Failed to generate learning objectives' });
    }
  });

  // Diagnostic Test Ordering Routes
  app.get('/api/cases/:id/available-tests', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      // If case doesn't have diagnostic tests, generate them on-demand
      let diagnosticTests = medicalCase.diagnosticTests?.available;
      if (!diagnosticTests || !diagnosticTests.laboratory || !diagnosticTests.imaging || !diagnosticTests.procedures) {
        console.log(`Generating diagnostic tests for case: ${medicalCase.name}`);
        const safeCase = {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          specialty: medicalCase.specialty,
          difficulty: medicalCase.difficulty,
          chiefComplaint: medicalCase.chiefComplaint,
          symptoms: medicalCase.symptoms || [],
          medicalHistory: medicalCase.medicalHistory || {},
          physicalExam: medicalCase.physicalExam || {},
          correctDiagnosis: medicalCase.correctDiagnosis,
          correctTreatment: medicalCase.correctTreatment || undefined,
          learningObjectives: medicalCase.learningObjectives || [],
          estimatedDuration: medicalCase.estimatedDuration,
          rating: medicalCase.rating || "0.00",
          responses: medicalCase.responses || {}
        };
        const comprehensiveCase = medicalCasesService.generateComprehensiveCase(safeCase);
        diagnosticTests = comprehensiveCase.diagnosticTests?.available || {
          laboratory: [] as any[],
          imaging: [] as any[],
          procedures: [] as any[]
        };
        
        // Update the case in storage with generated data
        await storage.updateMedicalCase(id, { 
          diagnosticTests: comprehensiveCase.diagnosticTests,
          physicalExam: comprehensiveCase.physicalExam
        });
      }

      res.json(diagnosticTests);
    } catch (error) {
      console.error('Error fetching available tests:', error);
      res.status(500).json({ message: 'Failed to fetch available tests' });
    }
  });

  app.post('/api/cases/:id/order-test', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { id } = req.params;
      const { testName, testType } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const diagnosticTests = medicalCase.diagnosticTests || { available: { laboratory: [], imaging: [], procedures: [] }, ordered: [], completed: [] };
      
      // Add test to ordered list if not already ordered
      if (!diagnosticTests.ordered.includes(testName)) {
        diagnosticTests.ordered.push(testName);
        diagnosticTests.completed.push(testName); // For simulation, tests complete immediately
      }

      // Update the case with ordered tests
      await storage.updateMedicalCase(id, { diagnosticTests });

      // Find the specific test results
      const allTests = [
        ...diagnosticTests.available.laboratory,
        ...diagnosticTests.available.imaging,
        ...diagnosticTests.available.procedures
      ];
      
      const orderedTest = allTests.find(test => test.name === testName);
      
      res.json({
        success: true,
        testName,
        testType,
        result: orderedTest,
        message: `${testName} has been ordered and results are available`
      });
    } catch (error) {
      console.error('Error ordering test:', error);
      res.status(500).json({ message: 'Failed to order test' });
    }
  });

  app.get('/api/cases/:id/test-results', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const diagnosticTests = medicalCase.diagnosticTests || { 
        available: { laboratory: [], imaging: [], procedures: [] }, 
        ordered: [], 
        completed: [] 
      };
      
      // Get results for completed tests - ensure available tests exist
      const allTests = [
        ...(diagnosticTests.available?.laboratory || []),
        ...(diagnosticTests.available?.imaging || []),
        ...(diagnosticTests.available?.procedures || [])
      ];
      
      const completedTests = (diagnosticTests.completed || []).map(testName => 
        allTests.find(test => test && test.name === testName)
      ).filter(Boolean);

      res.json({
        ordered: diagnosticTests.ordered || [],
        completed: diagnosticTests.completed || [],
        results: completedTests
      });
    } catch (error) {
      console.error('Error fetching test results:', error);
      res.status(500).json({ message: 'Failed to fetch test results' });
    }
  });

  // Enhanced Physical Exam Route (case-specific)
  app.get('/api/cases/:id/physical-exam-complete', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      // If case doesn't have physical exam data, generate it on-demand
      let physicalExam = medicalCase.physicalExam;
      if (!physicalExam || Object.keys(physicalExam).length === 0) {
        console.log(`Generating physical exam for case: ${medicalCase.name}`);
        const safeCase = {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          specialty: medicalCase.specialty,
          difficulty: medicalCase.difficulty,
          chiefComplaint: medicalCase.chiefComplaint,
          symptoms: medicalCase.symptoms || [],
          medicalHistory: medicalCase.medicalHistory || {},
          physicalExam: medicalCase.physicalExam || {},
          correctDiagnosis: medicalCase.correctDiagnosis,
          correctTreatment: medicalCase.correctTreatment || undefined,
          learningObjectives: medicalCase.learningObjectives || [],
          estimatedDuration: medicalCase.estimatedDuration,
          rating: medicalCase.rating || "0.00",
          responses: medicalCase.responses || {}
        };
        const comprehensiveCase = medicalCasesService.generateComprehensiveCase(safeCase);
        physicalExam = comprehensiveCase.physicalExam || {} as any;
        
        
        // Update the case in storage with generated data
        await storage.updateMedicalCase(id, { 
          diagnosticTests: comprehensiveCase.diagnosticTests,
          physicalExam: comprehensiveCase.physicalExam
        });
      }
      
      res.json({
        patientInfo: {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          chiefComplaint: medicalCase.chiefComplaint
        },
        physicalExam
      });
    } catch (error) {
      console.error('Error fetching complete physical exam:', error);
      res.status(500).json({ message: 'Failed to fetch physical exam' });
    }
  });

  // AI Case Generation Routes
  app.post('/api/ai/generate-case', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const request: CaseGenerationRequest = req.body;
      
      // Validate request
      if (!request.specialty || !request.difficulty) {
        return res.status(400).json({ 
          message: 'Specialty and difficulty are required' 
        });
      }

      console.log(`Generating AI case for ${request.specialty}, difficulty ${request.difficulty}`);
      const generatedCase = await aiCaseGenerator.generateMedicalCase(request);
      
      // Save the generated case to database
      const savedCase = await storage.createMedicalCase(generatedCase);
      
      res.json({
        success: true,
        case: savedCase,
        message: `Successfully generated ${request.specialty} case with AI`
      });
    } catch (error) {
      console.error('Error generating AI case:', error);
      res.status(500).json({ 
        message: 'Failed to generate AI case',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/ai/generate-multiple-cases', isAuthenticated, requiresAiAgreement, async (req, res) => {
    try {
      const { request, count = 3 }: { request: CaseGenerationRequest, count?: number } = req.body;
      
      if (!request.specialty || !request.difficulty) {
        return res.status(400).json({ 
          message: 'Specialty and difficulty are required' 
        });
      }

      if (count > 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 cases can be generated at once' 
        });
      }

      console.log(`Generating ${count} AI cases for ${request.specialty}`);
      const generatedCases = await aiCaseGenerator.generateMultipleCases(request, count);
      
      // Save all generated cases to database
      const savedCases = [];
      for (const caseData of generatedCases) {
        const savedCase = await storage.createMedicalCase(caseData);
        savedCases.push(savedCase);
      }
      
      res.json({
        success: true,
        cases: savedCases,
        count: savedCases.length,
        message: `Successfully generated ${savedCases.length} ${request.specialty} cases with AI`
      });
    } catch (error) {
      console.error('Error generating multiple AI cases:', error);
      res.status(500).json({ 
        message: 'Failed to generate AI cases',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/ai/specialties', async (req, res) => {
    try {
      const specialties = aiCaseGenerator.getAvailableSpecialties();
      res.json(specialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      res.status(500).json({ message: 'Failed to fetch specialties' });
    }
  });

  app.get('/api/ai/difficulty-levels', async (req, res) => {
    try {
      const levels = aiCaseGenerator.getDifficultyLevels();
      res.json(levels);
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
      res.status(500).json({ message: 'Failed to fetch difficulty levels' });
    }
  });

  // Medical Images routes
  app.get('/api/medical-images', async (req, res) => {
    try {
      const { imageType, difficulty, bodyRegion, search } = req.query;
      const filters = {
        imageType: imageType as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        bodyRegion: bodyRegion as string,
        search: search as string,
      };
      
      const images = await storage.getMedicalImages(filters);
      res.json(images);
    } catch (error) {
      console.error('Error fetching medical images:', error);
      res.status(500).json({ message: 'Failed to fetch medical images' });
    }
  });

  // Medical Images with path parameters (for frontend compatibility)
  app.get('/api/medical-images/:imageType/:difficulty', async (req, res) => {
    try {
      const { imageType, difficulty } = req.params;
      const { bodyRegion, search } = req.query;
      const filters = {
        imageType: imageType !== 'all' ? imageType : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
        bodyRegion: bodyRegion as string,
        search: search as string,
      };
      
      const images = await storage.getMedicalImages(filters);
      res.json(images);
    } catch (error) {
      console.error('Error fetching medical images:', error);
      res.status(500).json({ message: 'Failed to fetch medical images' });
    }
  });

  app.get('/api/medical-images/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const image = await storage.getMedicalImage(id);
      
      if (!image) {
        return res.status(404).json({ message: 'Medical image not found' });
      }
      
      res.json(image);
    } catch (error) {
      console.error('Error fetching medical image:', error);
      res.status(500).json({ message: 'Failed to fetch medical image' });
    }
  });

  // Image Analysis Progress routes
  app.get('/api/image-analysis-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getImageAnalysisProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching image analysis progress:', error);
      res.status(500).json({ message: 'Failed to fetch image analysis progress' });
    }
  });

  app.post('/api/image-analysis-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageId, findings, diagnosis, confidence } = req.body;

      // Calculate accuracy based on findings
      const image = await storage.getMedicalImage(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Medical image not found' });
      }

      const keyFindings = image.keyFindings || [];
      const correctFindings = findings.filter((f: any) => 
        keyFindings.some((kf: any) => 
          Math.abs(f.x - kf.x) < 10 && 
          Math.abs(f.y - kf.y) < 10
        )
      );
      
      const accuracy = keyFindings.length > 0 
        ? (correctFindings.length / keyFindings.length) * 100 
        : 0;

      // Calculate score based on accuracy, confidence, and findings
      const baseScore = Math.round(accuracy * 0.6 + confidence * 10 * 0.3 + findings.length * 5 * 0.1);
      const score = Math.min(100, Math.max(0, baseScore));

      const progressData = {
        userId,
        imageId,
        findingsIdentified: findings,
        diagnosis,
        confidence,
        accuracy: accuracy.toFixed(2),
        score,
        completed: true,
        completedAt: new Date(),
      };

      const progress = await storage.createImageAnalysisProgress(progressData);
      
      // Check for achievements
      await checkImageAnalysisAchievements(userId, progress, accuracy);
      
      res.json(progress);
    } catch (error) {
      console.error('Error creating image analysis progress:', error);
      res.status(500).json({ message: 'Failed to save image analysis progress' });
    }
  });

  // Study Groups routes
  app.get('/api/study-groups', isAuthenticated, async (req: any, res) => {
    try {
      const { specialty, search } = req.query;
      const filters = {
        specialty: specialty as string,
        search: search as string,
      };
      
      const groups = await storage.getStudyGroups(filters);
      res.json(groups);
    } catch (error) {
      console.error('Error fetching study groups:', error);
      res.status(500).json({ message: 'Failed to fetch study groups' });
    }
  });

  app.post('/api/study-groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupData = { ...req.body, creatorId: userId };
      
      const group = await storage.createStudyGroup(groupData);
      
      // Add creator as admin member
      await storage.addStudyGroupMember({
        groupId: group.id,
        userId,
        role: 'admin',
      });
      
      res.json(group);
    } catch (error) {
      console.error('Error creating study group:', error);
      res.status(500).json({ message: 'Failed to create study group' });
    }
  });

  app.post('/api/study-groups/:groupId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { groupId } = req.params;
      const { inviteCode } = req.body;
      
      const group = await storage.getStudyGroup(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Check if group is private and requires invite code
      if (group.isPrivate && group.inviteCode !== inviteCode) {
        return res.status(403).json({ message: 'Invalid invite code' });
      }
      
      // Check if group is full
      if ((group.currentMembers || 0) >= (group.maxMembers || 0)) {
        return res.status(400).json({ message: 'Study group is full' });
      }
      
      const member = await storage.addStudyGroupMember({
        groupId,
        userId,
        role: 'member',
      });
      
      res.json(member);
    } catch (error) {
      console.error('Error joining study group:', error);
      res.status(500).json({ message: 'Failed to join study group' });
    }
  });

  // Board Exams routes
  app.get('/api/board-exams', async (req, res) => {
    try {
      const { examType, specialty, difficulty } = req.query;
      const filters = {
        examType: examType as string,
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
      };
      
      const exams = await storage.getBoardExams(filters);
      res.json(exams);
    } catch (error) {
      console.error('Error fetching board exams:', error);
      res.status(500).json({ message: 'Failed to fetch board exams' });
    }
  });

  // Board Exams with path parameters (for frontend compatibility)
  app.get('/api/board-exams/:examType/:specialty/:difficulty', async (req, res) => {
    try {
      const { examType, specialty, difficulty } = req.params;
      const filters = {
        examType: examType !== 'all' ? examType : undefined,
        specialty: specialty !== 'all' ? specialty : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
      };
      
      const exams = await storage.getBoardExams(filters);
      res.json(exams);
    } catch (error) {
      console.error('Error fetching board exams:', error);
      res.status(500).json({ message: 'Failed to fetch board exams' });
    }
  });

  app.get('/api/board-exams/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const exam = await storage.getBoardExam(id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Board exam not found' });
      }
      
      res.json(exam);
    } catch (error) {
      console.error('Error fetching board exam:', error);
      res.status(500).json({ message: 'Failed to fetch board exam' });
    }
  });

  app.post('/api/board-exam-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = { ...req.body, userId };
      
      const attempt = await storage.createBoardExamAttempt(attemptData);
      res.json(attempt);
    } catch (error) {
      console.error('Error creating board exam attempt:', error);
      res.status(500).json({ message: 'Failed to create board exam attempt' });
    }
  });

  // Clinical Decision Trees routes
  app.get('/api/clinical-decision-trees', async (req, res) => {
    try {
      const { specialty, difficulty, category } = req.query;
      const filters = {
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        category: category as string,
      };
      
      const trees = await storage.getClinicalDecisionTrees(filters);
      res.json(trees);
    } catch (error) {
      console.error('Error fetching clinical decision trees:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision trees' });
    }
  });

  // Clinical Decision Trees with path parameters (for frontend compatibility)
  app.get('/api/clinical-decision-trees/:specialty/:difficulty/:category', async (req, res) => {
    try {
      const { specialty, difficulty, category } = req.params;
      const filters = {
        specialty: specialty !== 'all' ? specialty : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
        category: category !== 'all' ? category : undefined,
      };
      
      const trees = await storage.getClinicalDecisionTrees(filters);
      res.json(trees);
    } catch (error) {
      console.error('Error fetching clinical decision trees:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision trees' });
    }
  });

  app.get('/api/clinical-decision-trees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const tree = await storage.getClinicalDecisionTree(id);
      
      if (!tree) {
        return res.status(404).json({ message: 'Clinical decision tree not found' });
      }
      
      res.json(tree);
    } catch (error) {
      console.error('Error fetching clinical decision tree:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision tree' });
    }
  });

  app.get('/api/decision-tree-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getDecisionTreeProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching decision tree progress:', error);
      res.status(500).json({ message: 'Failed to fetch decision tree progress' });
    }
  });

  app.post('/api/decision-tree-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = { ...req.body, userId };
      
      const progress = await storage.createDecisionTreeProgress(progressData);
      
      // Check for achievements
      await checkDecisionTreeAchievements(userId, progress);
      
      res.json(progress);
    } catch (error) {
      console.error('Error creating decision tree progress:', error);
      res.status(500).json({ message: 'Failed to save decision tree progress' });
    }
  });

  // Helper function to check for achievements
  async function checkImageAnalysisAchievements(userId: string, progress: any, accuracy: number) {
    try {
      const userProgress = await storage.getImageAnalysisProgress(userId);
      const completedCount = userProgress.filter((p: any) => p.completed).length;
      
      // Check for various achievement criteria
      const achievementChecks = [
        { id: 'first_image_analysis', criteria: () => completedCount === 1 },
        { id: 'image_analysis_streak_5', criteria: () => completedCount === 5 },
        { id: 'image_analysis_streak_10', criteria: () => completedCount === 10 },
        { id: 'radiology_expert', criteria: () => completedCount === 25 },
        { id: 'perfect_image_analysis', criteria: () => accuracy === 100 },
        { id: 'image_analysis_master', criteria: () => {
          const recentProgress = userProgress.slice(-10);
          return recentProgress.length === 10 && 
                 recentProgress.every((p: any) => (p.accuracy || 0) >= 90);
        }},
      ];
      
      for (const check of achievementChecks) {
        if (check.criteria()) {
          await storage.unlockAchievement(userId, check.id);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Helper function to check for decision tree achievements
  async function checkDecisionTreeAchievements(userId: string, progress: any) {
    try {
      const userProgress = await storage.getDecisionTreeProgress(userId);
      const completedCount = userProgress.filter((p: any) => p.completed).length;
      const optimalPaths = userProgress.filter((p: any) => p.isOptimalPath).length;
      
      // Check for various achievement criteria
      const achievementChecks = [
        { id: 'first_decision_tree', criteria: () => completedCount === 1 },
        { id: 'decision_tree_streak_5', criteria: () => completedCount === 5 },
        { id: 'clinical_reasoning_expert', criteria: () => completedCount === 15 },
        { id: 'optimal_path_master', criteria: () => optimalPaths >= 10 },
        { id: 'perfect_clinical_reasoning', criteria: () => progress.isOptimalPath && progress.score >= 90 },
        { id: 'emergency_protocols_master', criteria: () => {
          const emergencyTrees = userProgress.filter((p: any) => 
            p.specialty === 'Emergency Medicine' && p.isOptimalPath
          );
          return emergencyTrees.length >= 3;
        }},
      ];
      
      for (const check of achievementChecks) {
        if (check.criteria()) {
          await storage.unlockAchievement(userId, check.id);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Chat Sessions API
  app.get('/api/chat-sessions/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Try to find existing session first
      let session = await storage.getCurrentChatSession(userId);
      
      // If no session exists, create a new one
      if (!session) {
        session = await storage.createChatSession({
          userId,
          title: "Medical Bill Analysis",
          sessionType: "bill_analysis"
        });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Error getting current chat session:', error);
      res.status(500).json({ message: 'Failed to get chat session' });
    }
  });

  // Chat Messages API
  app.get('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = req.query.sessionId;
      const userId = req.user.claims.sub;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'sessionId query parameter is required' });
      }
      
      // Verify session belongs to user
      const session = await storage.getChatSession(sessionId as string);
      if (!session || session.userId !== userId) {
        return res.json([]); // Return empty array instead of error
      }
      
      const messages = await storage.getChatMessages(sessionId as string);
      res.json(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      res.json([]); // Return empty array on error instead of error response
    }
  });

  app.post('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, content, role, messageType = 'text' } = req.body;
      
      if (!sessionId || !content || !role) {
        return res.status(400).json({ message: 'sessionId, content, and role are required' });
      }
      
      // Verify session belongs to user
      const session = await storage.getChatSession(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      
      const message = await storage.createChatMessage({
        sessionId,
        role,
        content,
        messageType
      });
      
      res.json(message);
    } catch (error) {
      console.error('Error creating chat message:', error);
      res.status(500).json({ message: 'Failed to create chat message' });
    }
  });

  // Bill AI Chat API - OpenAI powered medical bill reduction expert
  app.post('/api/bill-ai-chat', isAuthenticated, requiresAiAgreement, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.claims.sub;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      try {
        const systemPrompt = `You are a friendly medical bill expert who helps people save money. You have 20+ years of experience with billing errors, hospital negotiations, charity care programs, and dispute letters.

FORMATTING RULES (ALWAYS FOLLOW):
1. Write in plain, conversational English like you're talking to a friend
2. Never use markdown formatting (no ** asterisks, ## headers, or --- dashes)
3. Use simple numbered lists (1. 2. 3.) when listing steps or options
4. Use CAPS for section headers, followed by a colon
5. Keep sentences short and easy to scan
6. Always give specific dollar amounts ($1,234 not "significant savings")
7. Write phone scripts in natural, conversational tone
8. Be warm and reassuring, not clinical or intimidating

RESPONSE STRUCTURE:
Start with the most important thing they should do first. Then provide details if needed. End with a helpful follow-up question to learn more about their situation.

When providing scripts, write them the way a real person would actually speak:
Good: "Hi, I'm calling about my account. I got my itemized bill and noticed some charges I'd like to ask about."
Bad: "Hello, I am [PATIENT NAME] calling regarding account number [ACCOUNT] to dispute charges pursuant to..."

You help patients save thousands through expert guidance. Be their advocate and ally.`;

        const aiResponse = await aiProvider.generateText(message, systemPrompt, {
          maxTokens: 1000
        });

        res.json({ response: aiResponse || "I apologize, but I'm having trouble processing your request right now. Please try asking your question again." });
      } catch (aiError) {
        console.error('AI provider error:', aiError);
        res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.' });
      }
    } catch (error) {
      console.error('Error in bill AI chat:', error);
      res.status(500).json({ message: 'Failed to process your message' });
    }
  });

  // Bill Upload and Analysis API - AI-powered bill analysis for specific errors and opportunities
  app.post('/api/upload-bill', isAuthenticated, requiresAiAgreement, upload.single('bill'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      const sessionId = req.body.sessionId;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      let billText = '';
      let analysisData: any = {};

      // Only process image files - PDFs are not supported
      if (file.mimetype === 'application/pdf') {
        return res.status(400).json({ 
          message: 'PDF files are not supported. Please convert your bill to an image format (JPG, PNG, WebP) and upload that instead for accurate analysis.' 
        });
      }
      
      // Process image files with AI Vision (Gemini 3 Flash with OpenAI fallback)
      else if (file.mimetype.startsWith('image/')) {
        try {
          const base64Image = file.buffer.toString('base64');
          billText = await aiProvider.generateWithImage(
            'Extract all text from this medical bill image. Provide the complete text content, including all charges, dates, procedure codes, patient information, and billing details. Be thorough and accurate.',
            base64Image,
            file.mimetype
          );
        } catch (visionError) {
          console.error('Vision API error:', visionError);
          return res.status(500).json({ message: 'Unable to analyze image. Please try again or upload a clearer image.' });
        }
      }

      // Analyze the bill with expert AI prompting (Gemini 3 Flash with OpenAI fallback)
      if (billText) {
        try {
          const analysisPrompt = `You are a medical bill reduction expert with 25+ years of experience. Analyze this bill to find errors and savings.

BILL CONTENT:
${billText}

FORMATTING RULES (IMPORTANT):
- Write in plain, conversational English
- Use simple numbered lists (1. 2. 3.) not bullet points with dashes
- No markdown formatting (no **, ##, or ---)
- Use clear section headers in CAPS followed by a colon
- Keep sentences short and actionable
- Dollar amounts should be specific ($1,234 not "$X,XXX")

PROVIDE THIS ANALYSIS:

BILLING ERRORS FOUND
For each error, state: what it is, the code/charge involved, estimated overcharge amount, and how to dispute it.

POTENTIAL SAVINGS SUMMARY
List total savings by category: error corrections, charity care eligibility, negotiation opportunities.

WHAT TO DO FIRST
Your top 3 priority actions ranked by potential savings. Include specific account numbers and codes from the bill.

PHONE SCRIPT
A natural, conversational script to call the billing department. Make it sound human, not robotic.

Example: "Hi, I'm calling about my account ending in [last 4 digits]. I reviewed my itemized bill and found some charges that look incorrect. Specifically, [describe error]. Can you help me understand these charges?"

DOCUMENTS TO REQUEST
A simple list of what to ask for in writing.

30-DAY ACTION PLAN
Week 1: [specific actions]
Week 2: [specific actions]  
Week 3: [specific actions]
Week 4: [specific actions]

FINANCIAL ASSISTANCE
If applicable, explain charity care options and how to apply.

Write everything in a friendly, empowering tone. The reader may be stressed about their bill, so be reassuring while being direct about what they can do.`;

          analysisData.aiAnalysis = await aiProvider.generateText(
            analysisPrompt,
            'You are a friendly medical bill expert who helps people save money. Write in plain English without markdown formatting. No asterisks, em dashes, or special characters. Use simple numbered lists and clear section headers in CAPS. Be specific with dollar amounts and keep your tone warm and empowering.',
            { maxTokens: 4000, temperature: 0.3 }
          );
        } catch (analysisError) {
          console.error('Bill analysis error:', analysisError);
          analysisData.aiAnalysis = 'Basic analysis completed. Advanced AI analysis temporarily unavailable.';
        }
      }

      // Create a medical bill record in the database
      const billAmount = extractBillAmount(billText);
      const providerName = extractProvider(billText);
      const newBill = {
        title: `${providerName} - ${new Date().toLocaleDateString()}`, // Required field
        providerName: providerName, // Match schema field name
        totalAmount: billAmount.toString(),
        patientResponsibility: billAmount.toString(), // Required field
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'uploaded' as const, // Match schema values
        analysisStatus: 'completed' as const, // Match schema values
        originalText: billText,
        fileUrl: file.originalname // Store filename for reference
      };

      // Use the correct createMedicalBill function signature (userId, billData)
      const savedBill = await storage.createMedicalBill(userId, newBill);

      res.json({
        success: true,
        bill: savedBill,
        analysis: analysisData.aiAnalysis,
        extractedText: billText.substring(0, 500) + '...', // First 500 chars for preview
        message: `Bill uploaded successfully. ${billAmount > 0 ? `Found $${billAmount} in charges to review.` : 'Ready for analysis.'}`
      });

    } catch (error) {
      console.error('Error uploading bill:', error);
      res.status(500).json({ message: 'Failed to upload and analyze bill. Please try again.' });
    }
  });

  // Multiple Bill Images Upload Route - Up to 5 images for comprehensive analysis
  app.post('/api/upload-bills', isAuthenticated, requiresAiAgreement, upload.array('bills', 5), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as Express.Multer.File[];
      
      console.log('Upload request received:', {
        hasFiles: !!files,
        fileCount: files?.length || 0,
        fieldNames: Object.keys(req.body || {}),
        contentType: req.headers['content-type']
      });
      
      if (!files || files.length === 0) {
        console.log('No files in request:', { files, body: req.body });
        return res.status(400).json({ message: 'No files uploaded. Please select at least one image.' });
      }

      // Validate all files are images (PDF support removed)
      for (const file of files) {
        if (file.mimetype === 'application/pdf') {
          return res.status(400).json({ 
            message: 'PDF files are not supported. Please convert your bills to image format (JPG, PNG, WebP) for accurate analysis.' 
          });
        }
        
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({ 
            message: 'Only image files are supported. Please upload JPG, PNG, or WebP images.' 
          });
        }
      }

      let combinedBillText = '';
      let analysisData: any = {};

      // Process each image file with AI Vision (Gemini 3 Flash with OpenAI fallback)
      const imageAnalyses: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          console.log(`Processing image ${i + 1}/${files.length}: ${file.originalname}`);
          
          const base64Image = file.buffer.toString('base64');
          const extractedText = await aiProvider.generateWithImage(
            `Extract all text and billing information from this medical bill image (Page ${i + 1} of ${files.length}). Include all charges, CPT codes, dates, account numbers, patient information, provider details, and any other billing-related text. Be extremely thorough and accurate.`,
            base64Image,
            file.mimetype
          );
          
          imageAnalyses.push(`\n\n=== PAGE ${i + 1} (${file.originalname}) ===\n${extractedText}`);
          
        } catch (visionError) {
          console.error(`Vision API error for file ${i + 1}:`, visionError);
          imageAnalyses.push(`\n\n=== PAGE ${i + 1} (${file.originalname}) ===\nError extracting text from this image. Please ensure the image is clear and try again.`);
        }
      }

      // Combine all extracted text
      combinedBillText = `COMPLETE MEDICAL BILL ANALYSIS - ${files.length} PAGE${files.length > 1 ? 'S' : ''}:\n\n${imageAnalyses.join('')}`;

      // Comprehensive analysis of all pages together (Gemini 3 Flash with OpenAI fallback)
      try {
        const comprehensiveAnalysisPrompt = `Analyze this ${files.length}-page medical bill. Identify cross-page billing errors, duplicates, upcoding, unbundling issues. Provide specific savings amounts, action priorities, phone scripts, and charity care options.

BILL CONTENT (${files.length} PAGES):
${combinedBillText}

Provide detailed analysis with specific dollar amounts, error categories, and priority actions.`;

        analysisData.aiAnalysis = await aiProvider.generateText(
          comprehensiveAnalysisPrompt,
          `You are the world's leading medical bill reduction expert specializing in multi-page bill analysis. Provide comprehensive forensic analysis with cross-page error detection and maximum savings opportunities.`,
          { maxTokens: 4000, temperature: 0.3 }
        );
      } catch (analysisError) {
        console.error('Multi-page bill analysis error:', analysisError);
        analysisData.aiAnalysis = `Multi-page bill analysis completed for ${files.length} images. Advanced comprehensive analysis temporarily unavailable.`;
      }

      // Create a comprehensive medical bill record
      const billAmount = extractBillAmount(combinedBillText);
      const providerName = extractProvider(combinedBillText);
      const newBill = {
        title: `${providerName} - ${files.length} Pages - ${new Date().toLocaleDateString()}`,
        providerName: providerName,
        totalAmount: billAmount.toString(),
        patientResponsibility: billAmount.toString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'uploaded' as const,
        analysisStatus: 'completed' as const,
        originalText: combinedBillText,
        fileUrl: files.map(f => f.originalname).join(', ') // Store all filenames
      };

      const savedBill = await storage.createMedicalBill(userId, newBill);

      res.json({
        success: true,
        bill: savedBill,
        analysis: analysisData.aiAnalysis,
        fileCount: files.length,
        extractedText: combinedBillText.substring(0, 1000) + '...', // First 1000 chars for preview
        message: `Successfully analyzed ${files.length} bill image${files.length > 1 ? 's' : ''}. ${billAmount > 0 ? `Found $${billAmount} in total charges across all pages.` : 'Complete bill ready for comprehensive analysis.'}`
      });

    } catch (error) {
      console.error('Error uploading multiple bills:', error);
      res.status(500).json({ message: 'Failed to upload and analyze bill images. Please try again.' });
    }
  });

  // Helper functions for bill analysis
  function extractBillAmount(text: string): number {
    const patterns = [
      /total[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /amount due[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /balance[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /\$([0-9,]+\.?[0-9]*)/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 0) return amount;
      }
    }
    return 0;
  }

  function extractProvider(text: string): string {
    const lines = text.split('\n');
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 5 && !line.includes('$') && !line.includes('Date') && !line.includes('Account')) {
        return line;
      }
    }
    return 'Healthcare Provider';
  }

  // Medical Chatbot API - General medical and insurance Q&A
  app.post('/api/medical-chat', isAuthenticated, requiresAiAgreement, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.claims.sub;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      let response = "I'm here to help with medical questions and insurance/healthcare billing. Please ask me about symptoms, treatments, or insurance-related concerns.";

      // Use Gemini 3 Flash (via aiProvider) for intelligent medical responses
      try {
        const prompt = `You are a bill reduction expert and medical bill advocate with 20+ years of experience.

EXPERT KNOWLEDGE BASE:

CORE FACTS:
- 80% of medical bills contain errors worth $2,000-$35,000+
- Average reductions: 50-90% with proper strategies
- Bills typically go to collections after 90-120 days (use this window to negotiate)
- Charity care available even WITH insurance

COMMON BILLING ERRORS TO CHECK:
1. Duplicate charges for same service
2. Services billed but never received
3. Wrong procedure codes (upcoding)
4. Unbundled charges that should be packaged together
5. Incorrect dates or patient information
6. Room charges for time not in facility

CHARITY CARE INCOME LIMITS (2024):
- FREE CARE: Up to $30,120 individual or $62,400 family of 4
- DISCOUNTED CARE (25-75% off): $30,121-$60,240 individual
- HARDSHIP: When bills exceed 20% of annual income

NEGOTIATION APPROACHES:
1. Start with documented billing errors as leverage
2. Research fair market pricing (Healthcare Bluebook, FAIR Health)
3. Request prompt payment discounts (15-40% typical)
4. Apply for charity care if income-qualified
5. Request zero-interest payment plans (24-60 months)
6. Get ALL agreements in writing

USER QUESTION: ${message}

RESPONSE GUIDELINES:
- Write in plain conversational English
- Use simple numbered lists (1. 2. 3.) not bullet points
- NO markdown formatting (no **, ##, ---, or special characters)
- Be specific with dollar amounts and percentages
- Include sample phone scripts in quotation marks
- Offer to create personalized documents for the user
- Ask what specific details they need help with`;

        const systemPrompt = 'You are a friendly bill reduction expert. Write in plain, conversational English without any markdown formatting. No asterisks, hashtags, em-dashes, or special symbols. Use simple numbered lists and clear section headers. Be warm, specific, and actionable. Include dollar amounts and phone scripts when helpful.';
        
        response = await aiProvider.generateText(prompt, systemPrompt, { maxTokens: 1500 });
      } catch (aiError) {
        console.warn('AI API failed, using fallback response:', aiError);
        
        // Enhanced fallback responses with expert bill reduction knowledge
        const messageLower = message.toLowerCase();
        if (messageLower.includes('bill') || messageLower.includes('charge') || messageLower.includes('hospital') || messageLower.includes('cost') || messageLower.includes('reduce') || messageLower.includes('expensive')) {
          response = `🚨 CRITICAL: Don't pay that bill immediately! 80% of medical bills contain errors worth $2,000-$35,000+.

IMMEDIATE ACTION PLAN:
1. REQUEST ITEMIZED BILL: Call and say "I need a complete itemized statement with all CPT and ICD-10 codes, service dates, and provider information within 5 business days."

2. ERROR DETECTION: Look for duplicate charges, services not received, wrong procedure codes, and incorrect dates.

3. CHARITY CARE: If income ≤$60,240 (individual) or ≤$124,800 (family of 4), you may qualify for 25-100% bill forgiveness - even WITH insurance!

4. NEGOTIATION LEVERAGE: Present errors + fair market pricing research. Average reductions: 50-90%.

5. TIMING ADVANTAGE: Bills don't go to collections for 90-120 days. Use this window to negotiate from strength.

What's your total bill amount and what type of care was it for? I can provide a specific strategy tailored to your situation.`;
        } else if (messageLower.includes('insurance') || messageLower.includes('claim') || messageLower.includes('denial') || messageLower.includes('appeal')) {
          response = `For insurance claim appeals and denials, use these expert strategies:

PROFESSIONAL APPEAL APPROACH:
1. Request complete claims documentation from your insurer
2. Get medical records from your provider showing medical necessity
3. Write formal appeal letter referencing specific policy language
4. Include peer-reviewed studies supporting the treatment if applicable
5. Request external review if internal appeal is denied

APPEAL SUCCESS RATES: 50-60% for internal appeals, 20-40% for external reviews.

For medical bills after insurance, remember: 80% contain errors and average reductions are 50-90% with proper negotiation.

What specific insurance issue are you facing? I can provide exact templates and strategies.`;
        } else if (messageLower.includes('symptom') || messageLower.includes('pain') || messageLower.includes('fever')) {
          response = "For any concerning symptoms, especially persistent pain or fever, it's important to consult with a healthcare provider for proper evaluation and diagnosis. If you're experiencing severe symptoms, seek immediate medical attention.\n\nAs a medical bill reduction specialist, I also help patients save 50-90% on medical costs through expert negotiation strategies if you receive any bills from your care.";
        } else if (messageLower.includes('medication') || messageLower.includes('prescription')) {
          response = "Please consult your doctor or pharmacist about medications and prescriptions. They can provide personalized advice based on your medical history and current health status.\n\nIf you're concerned about prescription costs, I can also help with medical bill reduction strategies and pharmaceutical assistance programs.";
        } else {
          response = "I'm a bill reduction expert specializing in both health guidance and medical bill reduction. I help patients save $2,000-$35,000+ through expert negotiation strategies.\n\nFor medical questions, I provide guidance while recommending you consult healthcare providers.\nFor billing questions, I offer professional-grade strategies that typically reduce bills by 50-90%.\n\nHow can I help you today?";
        }
      }

      res.json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in medical chat:', error);
      res.status(500).json({ message: 'Failed to process your question. Please try again.' });
    }
  });

  // ===== SYNTHETIC PATIENT DIAGNOSTICS ENDPOINTS =====
  
  // Get all synthetic patients for the authenticated user
  app.get('/api/synthetic-patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patients = await storage.getSyntheticPatientsByUser(userId);
      res.json(patients);
    } catch (error) {
      console.error('Error fetching synthetic patients:', error);
      res.status(500).json({ message: 'Failed to fetch synthetic patients' });
    }
  });

  // Create a new synthetic patient (custom creation)
  app.post('/api/synthetic-patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Parse and structure the patient data
      const patientData = {
        userId,
        generationType: req.body.generationType || 'custom_created',
        profileName: req.body.profileName,
        age: parseInt(req.body.age),
        gender: req.body.gender,
        ethnicity: req.body.ethnicity || null,
        occupation: req.body.occupation || null,
        maritalStatus: null,
        chiefComplaint: req.body.chiefComplaint,
        presentingSymptoms: req.body.symptoms ? [{
          symptom: req.body.symptoms,
          severity: 5,
          duration: "unknown",
          onset: "gradual",
          quality: "described",
          aggravatingFactors: [],
          relievingFactors: []
        }] : [],
        medicalHistory: {
          pastMedicalHistory: req.body.medicalHistory ? req.body.medicalHistory.split(',').map((h: string) => h.trim()) : [],
          surgicalHistory: [],
          medications: req.body.medications ? req.body.medications.split(',').map((m: string) => ({
            name: m.trim(),
            dosage: "unknown",
            frequency: "unknown",
            indication: "unknown",
            adherence: "good" as const
          })) : [],
          allergies: req.body.allergies ? req.body.allergies.split(',').map((a: string) => ({
            allergen: a.trim(),
            reaction: "unknown",
            severity: "mild" as const
          })) : [],
          familyHistory: req.body.familyHistory ? req.body.familyHistory.split(',').map((f: string) => ({
            condition: f.trim(),
            relationship: "unknown"
          })) : [],
          socialHistory: {
            smoking: { status: "unknown" },
            alcohol: { status: "unknown" },
            drugs: { status: "unknown" },
            exercise: req.body.socialHistory || "unknown",
            diet: "unknown",
            occupation: req.body.occupation || "unknown",
            travelHistory: []
          },
          reviewOfSystems: {}
        },
        physicalExam: {
          vitals: {
            bloodPressure: "120/80",
            heartRate: "75",
            respiratoryRate: "16",
            temperature: "98.6°F",
            height: "5'8\"",
            weight: "160 lbs",
            bmi: "24.3"
          },
          general: {
            appearance: "well-appearing",
            distress: "no acute distress",
            mobility: "ambulatory",
            mood: "appropriate",
            speech: "clear"
          },
          systems: {
            cardiovascular: { "heart sounds": "regular rate and rhythm" },
            pulmonary: { "lung sounds": "clear to auscultation bilaterally" },
            abdominal: { "inspection": "soft, non-tender, non-distended" },
            neurological: { "mental status": "alert and oriented x3" },
            musculoskeletal: { "range of motion": "intact" },
            skin: { "inspection": "normal appearance" },
            heent: { "inspection": "normal" },
            psychiatric: { "mood": "euthymic" }
          }
        },
        riskFactors: [],
        comorbidities: [],
        complexity: parseInt(req.body.complexity) || 3,
        specialty: req.body.specialty || null,
        tags: req.body.specialty ? [req.body.specialty] : [],
        isAnonymized: true
      };

      const patient = await storage.createSyntheticPatient(patientData);
      res.json(patient);
    } catch (error) {
      console.error('Error creating synthetic patient:', error);
      res.status(500).json({ message: 'Failed to create synthetic patient' });
    }
  });

  // AI-generated synthetic patient creation
  app.post('/api/synthetic-patients/generate', isAuthenticated, requiresAiAgreement, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Generate a comprehensive synthetic patient using AI
      const aiPrompt = `Generate a realistic, anonymous synthetic patient profile for medical training purposes. Create an extremely comprehensive patient with the following structure:

PATIENT DEMOGRAPHICS:
- profileName: "Patient [Random Name]"
- age: random between 25-75
- gender: random (Male/Female/Non-binary)
- ethnicity: diverse representation (Caucasian, Hispanic, African American, Asian, Native American, etc.)
- occupation: realistic job with health implications
- maritalStatus: varied (Single, Married, Divorced, Widowed)

CLINICAL PRESENTATION:
- chiefComplaint: realistic, specific medical concern (not generic)
- presentingSymptoms: Array of 3-6 detailed symptom objects, each with:
  {
    symptom: "specific symptom name",
    severity: 1-10,
    duration: "specific timeframe",
    onset: "gradual/sudden/intermittent",
    quality: "sharp/dull/burning/cramping/etc",
    location: "specific anatomical location",
    radiation: "where it spreads if applicable",
    aggravatingFactors: ["factor1", "factor2"],
    relievingFactors: ["factor1", "factor2"],
    associatedSymptoms: ["symptom1", "symptom2"]
  }

COMPREHENSIVE MEDICAL HISTORY:
- pastMedicalHistory: {
    conditions: ["condition1 (year diagnosed)", "condition2 (year diagnosed)"],
    surgeries: ["surgery name (year)", "surgery name (year)"],
    hospitalizations: ["reason (year)", "reason (year)"]
  }
- medications: [
    {
      name: "medication name",
      dosage: "specific dose",
      frequency: "daily/BID/TID/etc",
      indication: "what it treats",
      duration: "how long taking"
    }
  ]
- allergies: [
    {
      allergen: "drug/food/environmental",
      reaction: "specific reaction type"
    }
  ]
- familyHistory: {
    father: ["condition1", "condition2"],
    mother: ["condition1", "condition2"],  
    siblings: ["condition1", "condition2"],
    paternal: ["condition1", "condition2"],
    maternal: ["condition1", "condition2"]
  }
- socialHistory: {
    smoking: { status: "never/former/current", details: "pack-years if applicable" },
    alcohol: { status: "none/social/heavy", details: "drinks per week" },
    drugs: { status: "none/former/current", details: "type and frequency" },
    exercise: { frequency: "daily/weekly/none", type: "cardio/weights/sports" },
    diet: { type: "balanced/vegetarian/high-sodium/etc", details: "specifics" },
    travel: { recent: "any recent travel", endemic: "areas of concern" },
    occupation: { hazards: "workplace exposures", stress: "high/moderate/low" }
  }

PHYSICAL EXAMINATION:
- vitalSigns: {
    temperature: "98.6-104°F realistic",
    bloodPressure: { systolic: 90-180, diastolic: 60-110 },
    heartRate: 60-120,
    respiratoryRate: 12-24,
    oxygenSaturation: 95-100,
    height: "realistic height",
    weight: "realistic weight",
    bmi: "calculated BMI"
  }
- generalAppearance: { status: "well/ill-appearing", distress: "none/mild/moderate/severe", mental: "alert/confused/lethargic" }
- systems: {
    cardiovascular: { heartSounds: "specific findings", murmurs: "if present", pulses: "strength and quality", edema: "presence/location" },
    pulmonary: { inspection: "findings", palpation: "findings", percussion: "findings", auscultation: "specific sounds" },
    abdominal: { inspection: "findings", palpation: "findings", percussion: "findings", auscultation: "bowel sounds" },
    neurological: { mentalStatus: "detailed findings", cranialNerves: "findings", motor: "strength/tone", sensory: "findings", reflexes: "findings" },
    musculoskeletal: { inspection: "findings", palpation: "findings", rangeOfMotion: "limitations", strength: "specific grades" },
    skin: { color: "findings", texture: "findings", lesions: "descriptions", temperature: "findings" },
    heent: { head: "findings", eyes: "findings", ears: "findings", nose: "findings", throat: "findings" },
    psychiatric: { mood: "findings", affect: "findings", thought: "process and content", perception: "findings" }
  }

RISK FACTORS & COMORBIDITIES:
- riskFactors: [
  {
    factor: "specific risk factor",
    severity: "mild/moderate/severe",
    control: "well-controlled/poorly-controlled/uncontrolled",
    impact: "low/medium/high impact on current condition"
  }
]
- comorbidities: [
  {
    condition: "specific comorbid condition",
    severity: "mild/moderate/severe",
    control: "well-controlled/poorly-controlled",
    relevance: "high/medium/low relevance to current presentation"
  }
]

CASE CHARACTERISTICS:
- complexity: 1-5 (1=straightforward, 5=highly complex multi-system)
- specialty: "Primary specialty this case relates to"
- tags: ["tag1", "tag2", "tag3"] (relevant medical specialties/topics)

Generate this as a single, well-structured JSON object with ALL fields populated with realistic, medically accurate, clinically relevant details. Make it educationally valuable and diagnostically challenging.`;

      const systemPrompt = 'You are a medical education AI that creates realistic synthetic patient profiles for training purposes. Generate comprehensive, medically accurate patient data in valid JSON format.';
      
      let aiPatientData;
      try {
        aiPatientData = await aiProvider.generateJSON<{
          profileName?: string;
          age?: number;
          gender?: string;
          ethnicity?: string;
          occupation?: string;
          maritalStatus?: string;
          chiefComplaint?: string;
          presentingSymptoms?: any[];
          medicalHistory?: any;
          physicalExam?: any;
          riskFactors?: any[];
          comorbidities?: any[];
          complexity?: number;
          specialty?: string;
          tags?: string[];
        }>(aiPrompt, systemPrompt, {
          maxTokens: 2500,
          temperature: 0.8
        });
      } catch (parseError) {
        console.error('Error generating AI patient:', parseError);
        aiPatientData = {
          age: Math.floor(Math.random() * 50) + 25,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          profileName: 'AI Generated Patient',
          chiefComplaint: 'Chest pain and shortness of breath',
          complexity: Math.floor(Math.random() * 3) + 2,
          specialty: 'Internal Medicine'
        };
      }

      // Structure the AI-generated data into our schema format
      const structuredPatientData = {
        userId,
        generationType: 'ai_generated',
        profileName: aiPatientData.profileName || `AI Patient ${Date.now()}`,
        age: aiPatientData.age || Math.floor(Math.random() * 50) + 25,
        gender: aiPatientData.gender || 'Male',
        ethnicity: aiPatientData.ethnicity || 'Not specified',
        occupation: aiPatientData.occupation || 'Not specified',
        maritalStatus: aiPatientData.maritalStatus || null,
        chiefComplaint: aiPatientData.chiefComplaint || 'General medical concern',
        presentingSymptoms: aiPatientData.presentingSymptoms || [],
        medicalHistory: aiPatientData.medicalHistory || {},
        physicalExam: aiPatientData.physicalExam || {},
        riskFactors: aiPatientData.riskFactors || [],
        comorbidities: aiPatientData.comorbidities || [],
        complexity: aiPatientData.complexity || Math.floor(Math.random() * 3) + 2,
        specialty: aiPatientData.specialty || 'Internal Medicine',
        tags: aiPatientData.tags || [aiPatientData.specialty || 'Internal Medicine'],
        isAnonymized: true
      };

      const patient = await storage.createSyntheticPatient(structuredPatientData);
      res.json(patient);
    } catch (error) {
      console.error('Error generating AI patient:', error);
      res.status(500).json({ message: 'Failed to generate AI patient' });
    }
  });

  // Run diagnostic analysis on a synthetic patient
  app.post('/api/synthetic-patients/:id/analyze', isAuthenticated, requiresAiAgreement, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patientId = req.params.id;
      
      console.log('Analysis request received:');
      console.log('- User ID:', userId);
      console.log('- Patient ID:', patientId);
      console.log('- Request body:', JSON.stringify(req.body, null, 2));
      
      const { analysisType, focusAreas, sessionName } = req.body;

      // Validate required parameters with better error messages
      if (!analysisType || typeof analysisType !== 'string' || analysisType.trim() === '') {
        console.log('Validation failed: analysisType missing or invalid:', analysisType);
        return res.status(400).json({ message: 'Analysis type is required and must be a non-empty string' });
      }

      // Get the patient data
      const patient = await storage.getSyntheticPatientById(patientId);
      console.log('Patient data retrieved:', patient ? 'Found' : 'Not found');
      if (!patient || patient.userId !== userId) {
        console.log('Patient validation failed - not found or user mismatch');
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Ensure we have valid data with defaults
      const safeAnalysisType = analysisType || 'differential_diagnosis';
      const safeFocusAreas = Array.isArray(focusAreas) ? focusAreas : ['Internal Medicine'];
      
      // Create comprehensive AI prompt for diagnostic analysis
      const analysisPrompt = `You are a world-class medical AI conducting ${safeAnalysisType.replace(/_/g, ' ')} for medical training purposes.

PATIENT PROFILE:
- Name: ${patient.profileName || 'Anonymous Patient'}
- Age: ${patient.age || 'Unknown'}, Gender: ${patient.gender || 'Unknown'}
- Chief Complaint: ${patient.chiefComplaint || 'General medical concern'}
- Medical History: ${JSON.stringify(patient.medicalHistory || {}, null, 2)}
- Physical Exam: ${JSON.stringify(patient.physicalExam || {}, null, 2)}
- Risk Factors: ${JSON.stringify(patient.riskFactors || [], null, 2)}
- Comorbidities: ${JSON.stringify(patient.comorbidities || [], null, 2)}

ANALYSIS TYPE: ${safeAnalysisType.replace(/_/g, ' ').toUpperCase()}
FOCUS AREAS: ${safeFocusAreas.join(', ')}

Provide comprehensive analysis in JSON format with:

{
  "differentialDiagnoses": [
    {
      "diagnosis": "Primary diagnosis name",
      "probability": 75,
      "supportingEvidence": ["evidence 1", "evidence 2"],
      "contraEvidence": ["contra evidence"],
      "requiredTests": ["test 1", "test 2"],
      "urgency": "moderate"
    }
  ],
  "recommendedTests": [
    {
      "testName": "Complete Blood Count",
      "category": "laboratory",
      "priority": "routine",
      "rationale": "Screen for infection/anemia",
      "expectedFindings": "May show elevated WBC",
      "cost": "$50-100"
    }
  ],
  "riskAssessment": {
    "overallRisk": "moderate",
    "specificRisks": [
      {
        "risk": "Cardiovascular event",
        "probability": 15,
        "mitigation": "Risk factor modification"
      }
    ],
    "redFlags": ["symptom progression", "chest pain"]
  },
  "treatmentRecommendations": [
    {
      "intervention": "Lifestyle modification",
      "type": "long_term",
      "evidenceLevel": "A",
      "contraindications": [],
      "monitoringRequired": ["vital signs", "symptoms"]
    }
  ],
  "prognosis": {
    "shortTerm": "Excellent with proper management",
    "mediumTerm": "Good with compliance",
    "longTerm": "Depends on risk factor control",
    "factorsAffectingOutcome": ["compliance", "comorbidities"]
  }
}

Also include learning insights:
{
  "keyInsights": ["insight 1", "insight 2"],
  "clinicalPearls": ["pearl 1", "pearl 2"],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "literatureReferences": ["reference 1", "reference 2"]
}

Make it clinically accurate and educationally valuable.`;

      // Use aiProvider (Gemini 3 Flash with OpenAI fallback)
      const aiResult = await aiProvider.generateJSON<{
        differentialDiagnoses: Array<{
          diagnosis: string;
          probability: number;
          supportingEvidence: string[];
          contraEvidence: string[];
          requiredTests: string[];
          urgency: 'low' | 'moderate' | 'high' | 'critical';
        }>;
        recommendedTests: Array<{
          testName: string;
          category: string;
          priority: string;
          rationale: string;
          expectedFindings: string;
          cost: string;
        }>;
        riskAssessment: {
          overallRisk: string;
          specificRisks: Array<{
            risk: string;
            probability: number;
            mitigation: string;
          }>;
          redFlags: string[];
        };
        treatmentRecommendations: Array<{
          intervention: string;
          type: string;
          evidenceLevel: string;
          contraindications: string[];
          monitoringRequired: string[];
        }>;
        prognosis: {
          shortTerm: string;
          mediumTerm: string;
          longTerm: string;
          factorsAffectingOutcome: string[];
        };
        keyInsights?: string[];
        clinicalPearls?: string[];
        commonMistakes?: string[];
        literatureReferences?: string[];
      }>(analysisPrompt, 'You are an expert medical AI providing comprehensive diagnostic analysis for educational purposes. Always respond with valid JSON format containing detailed medical analysis.', { maxTokens: 3000 });

      console.log('AI diagnostic analysis result received');
      
      let diagnosticAnalysis = aiResult;
      let learningPoints = {
        keyInsights: aiResult.keyInsights || ["Comprehensive case analysis completed"],
        clinicalPearls: aiResult.clinicalPearls || ["Systematic approach improves diagnostic accuracy"],
        commonMistakes: aiResult.commonMistakes || ["Not considering all differential diagnoses"],
        literatureReferences: aiResult.literatureReferences || ["Evidence-based medicine guidelines"]
      };

      // Create diagnostic session
      const sessionData = {
        userId,
        patientId,
        sessionName: sessionName || `${safeAnalysisType.replace(/_/g, ' ')} Analysis - ${patient.profileName || 'Patient'}`,
        analysisType: safeAnalysisType,
        focusAreas: safeFocusAreas,
        diagnosticAnalysis,
        learningPoints,
        timeElapsed: 0,
        accuracy: null,
        completed: true,
        completedAt: new Date()
      };

      const session = await storage.createDiagnosticSession(sessionData);
      console.log('Diagnostic session created successfully:', session.id);
      res.json(session);
    } catch (error) {
      console.error('Error running diagnostic analysis:', error);
      console.error('Error details:', (error as Error).message);
      console.error('Stack trace:', (error as Error).stack);
      res.status(500).json({ message: 'Failed to run diagnostic analysis', error: (error as Error).message });
    }
  });

  // AI-powered medical bill analysis endpoint
  // Integrates lessons from "Never Pay the First Bill" by Marshall Allen
  app.post('/api/analyze-bill-ai', express.json(), async (req, res) => {
    try {
      const { 
        totalAmount, 
        patientResponsibility, 
        providerName, 
        serviceDate, 
        serviceType,
        billDescription 
      } = req.body;

      console.log('Analyzing bill with AI:', { totalAmount, serviceType });

      // Create comprehensive prompt based on "Never Pay the First Bill" principles
      const analysisPrompt = `You are a medical billing expert trained in the strategies from "Never Pay the First Bill" by Marshall Allen. Analyze this medical bill and provide a comprehensive assessment.

BILL DETAILS:
- Total Amount: $${totalAmount}
- Patient Responsibility: $${patientResponsibility}
- Provider: ${providerName}
- Service Date: ${serviceDate}
- Type of Care: ${serviceType}
- Additional Details: ${billDescription || 'Not provided'}

KEY PRINCIPLES FROM "NEVER PAY THE FIRST BILL":
1. Hospital charges are often inflated 2x-10x actual costs
2. Chargemaster prices are arbitrary and negotiable
3. Common billing errors: duplicate charges, unbundling, upcoding, phantom charges
4. Insurance "allowed amounts" reveal true negotiated rates
5. Financial assistance programs available for most patients
6. Timing matters - negotiate BEFORE paying
7. Always request itemized bills with CPT codes
8. Compare prices against Medicare rates and fair health pricing databases

ANALYZE AND PROVIDE JSON OUTPUT WITH:
{
  "potentialSavings": <number>,
  "riskScore": <0-100>,
  "analysisConfidence": <0-100>,
  "issues": [
    {
      "id": "<unique-id>",
      "title": "<issue-title>",
      "description": "<detailed-description>",
      "category": "duplicate|overcharge|unbundling|coding_error|phantom|timing",
      "riskLevel": "low|medium|high",
      "potentialSavings": <number>,
      "confidence": <0-100>,
      "priority": <1-3>,
      "actionRequired": "<specific-action>",
      "evidence": ["<evidence-1>", "<evidence-2>"],
      "nextSteps": ["<step-1>", "<step-2>", "<step-3>"]
    }
  ],
  "recommendations": [
    "<recommendation-1>",
    "<recommendation-2>",
    "<recommendation-3>"
  ],
  "negotiationStrategy": {
    "approach": "<negotiation-approach>",
    "talkingPoints": ["<point-1>", "<point-2>"],
    "targetReduction": "<percentage>",
    "fallbackOptions": ["<option-1>", "<option-2>"]
  },
  "financialAssistance": {
    "eligible": <boolean>,
    "programs": ["<program-1>", "<program-2>"],
    "estimatedDiscount": "<percentage-range>"
  },
  "insiderTactics": [
    "<tactic-1-from-book>",
    "<tactic-2-from-book>"
  ]
}

Focus on actionable insights and specific dollar amounts. Be realistic but advocate strongly for the patient.`;

      const systemPromptBillAnalysis = 'You are a friendly medical bill expert. Respond with clean JSON only. In text fields, write in plain English without markdown formatting, asterisks, em dashes, or special characters. Keep recommendations concise and actionable.';

      const analysisResult = await aiProvider.generateJSON<{
        potentialSavings?: number;
        riskScore?: number;
        analysisConfidence?: number;
        issues?: any[];
        recommendations?: string[];
        negotiationStrategy?: any;
        financialAssistance?: any;
        insiderTactics?: string[];
      }>(analysisPrompt, systemPromptBillAnalysis, {
        maxTokens: 8192
      });

      console.log('AI analysis complete:', {
        potentialSavings: analysisResult.potentialSavings,
        issuesFound: analysisResult.issues?.length || 0
      });

      // Return the analysis
      res.json({
        success: true,
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error in AI bill analysis:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to analyze bill with AI', 
        error: (error as Error).message 
      });
    }
  });

  // Tutorial progress endpoint
  app.post('/api/tutorial/progress', isAuthenticated, express.json(), async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { currentStep, completedSteps, skippedSteps, tutorialCompleted } = req.body;

      // Update user tutorial progress
      await storage.upsertUser({
        id: user.id,
        email: user.email,
        tutorialProgress: {
          currentStep: currentStep || 0,
          completedSteps: completedSteps || [],
          skippedSteps: skippedSteps || [],
          lastAccessedAt: new Date().toISOString(),
        },
        tutorialCompleted: tutorialCompleted || false,
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
      res.status(500).json({ message: 'Failed to save tutorial progress' });
    }
  });

  // Health Insights AI Chat - Educational health information (not medical advice)
  app.post('/api/health-insights-chat', isAuthenticated, requiresAiAgreement, async (req: any, res) => {
    try {
      const { message, sessionType, conversationHistory } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      const systemPrompt = `You are a friendly health education assistant. You help people understand health topics, symptoms, and medical terminology so they can have better conversations with their doctors.

IMPORTANT RULES:
1. You are NOT a doctor and cannot diagnose or prescribe
2. Always recommend consulting a healthcare professional for medical decisions
3. For emergencies, tell them to call 911 or go to the ER immediately
4. Provide educational information only
5. Be warm, empathetic, and reassuring

FORMATTING RULES:
1. Write in plain conversational English
2. No markdown formatting (no asterisks, hashtags, or dashes)
3. Use simple numbered lists when helpful
4. Keep responses concise and easy to understand
5. Use occasional emojis to be friendly but not excessive

SESSION TYPE: ${sessionType || 'general'}

When discussing symptoms:
- Ask clarifying questions to understand better
- Provide general educational information
- Suggest questions they might ask their doctor
- Never diagnose or suggest specific treatments

End each response with an offer to help further or a gentle reminder to consult their doctor if needed.`;

      const conversationContext = (conversationHistory || []).slice(-10).map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      const fullPrompt = conversationContext 
        ? `Previous conversation:\n${conversationContext}\n\nUser: ${message}`
        : message;

      const aiResponse = await aiProvider.generateText(fullPrompt, systemPrompt, {
        maxTokens: 1000,
        temperature: 0.7
      }) || "I'm here to help. Could you tell me more about what you're experiencing?";
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error('Health insights error:', error);
      res.status(500).json({ message: 'Failed to process your request' });
    }
  });

  // Savings Outcomes API
  app.get('/api/savings-outcomes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const outcomes = await storage.getSavingsOutcomes(userId);
      res.json(outcomes);
    } catch (error) {
      console.error('Get savings outcomes error:', error);
      res.status(500).json({ message: 'Failed to get savings outcomes' });
    }
  });

  app.post('/api/savings-outcomes', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { originalAmount, finalAmount, totalSaved, savingsMethod, providerName, strategyUsed, status, userNotes } = req.body;
      
      if (!originalAmount) {
        return res.status(400).json({ message: 'Original amount is required' });
      }

      const outcome = await storage.createSavingsOutcome(userId, {
        originalAmount: originalAmount.toString(),
        finalAmount: finalAmount?.toString() || null,
        totalSaved: totalSaved?.toString() || null,
        savingsMethod: savingsMethod || null,
        providerName: providerName || null,
        strategyUsed: strategyUsed || null,
        status: status || 'in_progress',
        userNotes: userNotes || null
      });

      res.json(outcome);
    } catch (error) {
      console.error('Create savings outcome error:', error);
      res.status(500).json({ message: 'Failed to create savings outcome' });
    }
  });

  app.patch('/api/savings-outcomes/:id', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const outcomeId = req.params.id;
      const updates = req.body;

      const outcome = await storage.updateSavingsOutcome(outcomeId, userId, updates);
      if (!outcome) {
        return res.status(404).json({ message: 'Outcome not found' });
      }
      res.json(outcome);
    } catch (error) {
      console.error('Update savings outcome error:', error);
      res.status(500).json({ message: 'Failed to update savings outcome' });
    }
  });

  app.delete('/api/savings-outcomes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const outcomeId = req.params.id;

      const success = await storage.deleteSavingsOutcome(outcomeId, userId);
      res.json({ success });
    } catch (error) {
      console.error('Delete savings outcome error:', error);
      res.status(500).json({ message: 'Failed to delete savings outcome' });
    }
  });

  // =====================================================
  // CLINICAL COMMAND CENTER APIs
  // =====================================================

  // Lab Results Analysis API
  app.post('/api/analyze-labs', isAuthenticated, requiresAiAgreement, express.json(), async (req: any, res) => {
    try {
      const { type, values } = req.body;

      const labPrompt = `You are a clinical laboratory specialist providing educational interpretation of lab results. 
      
${type === 'manual' ? `
The patient has provided these lab values:
${values}
` : `
Panel Type: ${type}
Lab Values: ${JSON.stringify(values, null, 2)}
`}

Analyze these results and provide a comprehensive, educational interpretation. 

IMPORTANT DISCLAIMERS TO INCLUDE:
- This is educational information only
- Always consult your healthcare provider
- Context matters - isolated values don't tell the whole story

Provide your analysis in this JSON format:
{
  "summary": "Brief 2-3 sentence overall summary of the results",
  "overallHealth": "good|concerning|requires-attention",
  "values": [
    {
      "name": "Test name",
      "value": "actual value",
      "unit": "unit",
      "normalRange": "normal range",
      "status": "normal|low|high|critical"
    }
  ],
  "insights": [
    "Key insight about the results",
    "Another important observation",
    "Pattern or trend to note"
  ],
  "recommendations": [
    "Lifestyle or dietary recommendation",
    "Monitoring suggestion",
    "General health tip"
  ],
  "followUp": [
    "Question to ask your doctor",
    "Additional tests that might be helpful"
  ]
}`;

      const labSystemPrompt = "You are a clinical laboratory specialist providing educational lab result interpretations. Always emphasize this is for educational purposes only and encourage consulting healthcare providers.";

      const result = await aiProvider.generateJSON<{
        summary: string;
        overallHealth: string;
        values: Array<{
          name: string;
          value: string;
          unit: string;
          normalRange: string;
          status: string;
        }>;
        insights: string[];
        recommendations: string[];
        followUp: string[];
      }>(labPrompt, labSystemPrompt, {
        maxTokens: 2000,
        temperature: 0.3
      });
      res.json(result);
    } catch (error) {
      console.error('Lab analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze lab results' });
    }
  });

  // Drug Interaction Checker API
  app.post('/api/check-drug-interactions', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const { medications } = req.body;

      if (!medications || !Array.isArray(medications) || medications.length < 2) {
        return res.status(400).json({ message: 'At least 2 medications are required' });
      }

      // Common drug interactions database (not AI-based for safety)
      const KNOWN_INTERACTIONS: Record<string, { drugs: string[], severity: string, description: string, mechanism?: string, management?: string }[]> = {
        'warfarin': [
          { drugs: ['aspirin'], severity: 'major', description: 'Increased risk of bleeding when combined', mechanism: 'Both medications affect blood clotting through different mechanisms', management: 'Monitor closely for signs of bleeding. Your doctor may adjust doses.' },
          { drugs: ['ibuprofen', 'naproxen', 'nsaid'], severity: 'major', description: 'NSAIDs increase bleeding risk with warfarin', mechanism: 'NSAIDs inhibit platelet function and can cause GI bleeding', management: 'Avoid NSAIDs if possible. Use acetaminophen for pain instead.' },
          { drugs: ['vitamin k'], severity: 'moderate', description: 'Vitamin K reduces warfarin effectiveness', mechanism: 'Vitamin K is needed for clotting factor production', management: 'Maintain consistent vitamin K intake. Inform your doctor of dietary changes.' }
        ],
        'lisinopril': [
          { drugs: ['potassium', 'spironolactone'], severity: 'moderate', description: 'Risk of high potassium levels (hyperkalemia)', mechanism: 'ACE inhibitors reduce potassium excretion', management: 'Monitor potassium levels regularly. Watch for muscle weakness.' },
          { drugs: ['ibuprofen', 'naproxen', 'nsaid'], severity: 'moderate', description: 'NSAIDs may reduce blood pressure lowering effect', mechanism: 'NSAIDs cause sodium and fluid retention', management: 'Use NSAIDs sparingly. Monitor blood pressure.' }
        ],
        'metformin': [
          { drugs: ['alcohol'], severity: 'moderate', description: 'Increased risk of lactic acidosis with heavy alcohol use', mechanism: 'Both can affect lactate metabolism', management: 'Limit alcohol consumption. Avoid binge drinking.' },
          { drugs: ['contrast dye'], severity: 'major', description: 'Risk of kidney damage with IV contrast', mechanism: 'Both can stress kidney function', management: 'Stop metformin before and after contrast procedures as directed.' }
        ],
        'simvastatin': [
          { drugs: ['grapefruit'], severity: 'moderate', description: 'Grapefruit increases statin levels in blood', mechanism: 'Grapefruit inhibits CYP3A4 enzyme that metabolizes statins', management: 'Avoid grapefruit and grapefruit juice.' },
          { drugs: ['amiodarone'], severity: 'major', description: 'Increased risk of muscle damage (rhabdomyolysis)', mechanism: 'Amiodarone inhibits statin metabolism', management: 'Lower statin dose may be needed. Report muscle pain immediately.' }
        ],
        'fluoxetine': [
          { drugs: ['tramadol'], severity: 'major', description: 'Risk of serotonin syndrome', mechanism: 'Both increase serotonin levels', management: 'Watch for agitation, rapid heartbeat, fever. Seek immediate care if symptoms occur.' },
          { drugs: ['maoi', 'phenelzine', 'tranylcypromine'], severity: 'major', description: 'Severe serotonin syndrome risk', mechanism: 'MAOIs prevent serotonin breakdown', management: 'Never combine. Wait 5 weeks after stopping fluoxetine before starting MAOI.' }
        ],
        'metoprolol': [
          { drugs: ['verapamil', 'diltiazem'], severity: 'major', description: 'Risk of very slow heart rate and low blood pressure', mechanism: 'Both slow heart rate through different mechanisms', management: 'Monitor heart rate closely. Watch for dizziness.' }
        ],
        'omeprazole': [
          { drugs: ['clopidogrel', 'plavix'], severity: 'moderate', description: 'May reduce clopidogrel effectiveness', mechanism: 'Omeprazole inhibits CYP2C19 needed to activate clopidogrel', management: 'Consider alternative PPI like pantoprazole if needed.' }
        ]
      };

      const interactions: any[] = [];
      const normalizedMeds = medications.map(m => m.toLowerCase().trim());

      // Check each pair of medications
      for (let i = 0; i < normalizedMeds.length; i++) {
        for (let j = i + 1; j < normalizedMeds.length; j++) {
          const med1 = normalizedMeds[i];
          const med2 = normalizedMeds[j];

          // Check if med1 has interactions with med2
          if (KNOWN_INTERACTIONS[med1]) {
            for (const interaction of KNOWN_INTERACTIONS[med1]) {
              if (interaction.drugs.some(d => med2.includes(d) || d.includes(med2))) {
                interactions.push({
                  drug1: medications[i],
                  drug2: medications[j],
                  severity: interaction.severity,
                  description: interaction.description,
                  mechanism: interaction.mechanism,
                  management: interaction.management
                });
              }
            }
          }

          // Check reverse (med2 with med1)
          if (KNOWN_INTERACTIONS[med2]) {
            for (const interaction of KNOWN_INTERACTIONS[med2]) {
              if (interaction.drugs.some(d => med1.includes(d) || d.includes(med1))) {
                // Avoid duplicates
                const exists = interactions.some(i => 
                  (i.drug1.toLowerCase() === medications[j].toLowerCase() && i.drug2.toLowerCase() === medications[i].toLowerCase())
                );
                if (!exists) {
                  interactions.push({
                    drug1: medications[j],
                    drug2: medications[i],
                    severity: interaction.severity,
                    description: interaction.description,
                    mechanism: interaction.mechanism,
                    management: interaction.management
                  });
                }
              }
            }
          }
        }
      }

      const safetyNotes = [
        'Always inform your healthcare providers about all medications, supplements, and vitamins you take',
        'This check may not include all possible interactions',
        'Some interactions depend on dosage and individual factors',
        'Report any unusual symptoms to your doctor promptly'
      ];

      res.json({
        medications,
        interactions,
        safetyNotes,
        disclaimer: 'This drug interaction checker is for educational purposes only. It may not include all possible interactions. Always consult your pharmacist or healthcare provider for complete medication safety guidance.'
      });
    } catch (error) {
      console.error('Drug interaction check error:', error);
      res.status(500).json({ message: 'Failed to check drug interactions' });
    }
  });

  // Symptom Checker API
  app.post('/api/analyze-symptoms', isAuthenticated, requiresAiAgreement, express.json(), async (req: any, res) => {
    try {
      const { symptoms, age, gender, bodyPart, duration, severity, additionalInfo } = req.body;

      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ message: 'At least one symptom is required' });
      }

      const symptomPrompt = `You are a medical triage AI providing educational health information. A person is seeking to understand their symptoms.

PATIENT INFORMATION:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Primary Area Affected: ${bodyPart || 'Not specified'}
- Symptoms: ${symptoms.join(', ')}
- Duration: ${duration || 'Not specified'}
- Severity (1-10): ${severity || 'Not specified'}
- Additional Context: ${additionalInfo || 'None provided'}

CRITICAL INSTRUCTIONS:
1. This is for EDUCATIONAL purposes only - not diagnosis
2. Always err on the side of caution
3. If symptoms suggest emergency, urgency must be "emergency"
4. Red flags (chest pain, difficulty breathing, severe bleeding, stroke symptoms, etc.) = emergency
5. Provide general health education, not specific medical advice
6. Recommend professional consultation appropriately

Provide analysis in this JSON format:
{
  "urgency": "emergency|urgent|soon|routine",
  "summary": "Brief explanation of what these symptoms might indicate and why they need attention at the indicated urgency level",
  "possibleConditions": [
    {
      "name": "Condition name",
      "likelihood": "high|moderate|low",
      "description": "Brief description of the condition",
      "commonSymptoms": ["symptom1", "symptom2"],
      "whenToSeek": "When to seek care for this condition"
    }
  ],
  "redFlags": [
    "Warning sign to watch for",
    "Another concerning symptom to monitor"
  ],
  "selfCareAdvice": [
    "General self-care suggestion",
    "Comfort measure",
    "Monitoring tip"
  ],
  "questions": [
    "Question to ask your doctor",
    "Another relevant question"
  ],
  "disclaimer": "This symptom checker provides general health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, call 911 or go to the nearest emergency room immediately."
}`;

      const result = await aiProvider.generateJSON<{
        urgency: string;
        summary: string;
        possibleConditions: Array<{
          name: string;
          likelihood: string;
          description: string;
          commonSymptoms: string[];
          whenToSeek: string;
        }>;
        redFlags: string[];
        selfCareAdvice: string[];
        questions: string[];
        disclaimer: string;
      }>(symptomPrompt, 'You are a medical triage AI. Your role is to provide educational health information and help people understand when and how urgently they should seek medical care. Always prioritize safety and encourage professional consultation. Never diagnose or prescribe treatment.', { temperature: 0.3 });
      
      res.json(result);
    } catch (error) {
      console.error('Symptom analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze symptoms' });
    }
  });

  // ============================================================================
  // Medicare/Medicaid Enrollment API Endpoints
  // ============================================================================

  // POST /api/enrollment/sessions - Create new enrollment session
  app.post('/api/enrollment/sessions', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const { programType, voiceEnabled } = req.body;
      const userId = req.user?.id;

      if (!programType) {
        return res.status(400).json({ message: 'programType is required' });
      }

      const validProgramTypes = ['medicare_part_a', 'medicare_part_b', 'medicare_part_c', 'medicare_part_d', 'medicaid', 'chip', 'marketplace'];
      if (!validProgramTypes.includes(programType)) {
        return res.status(400).json({ message: 'Invalid programType. Must be one of: ' + validProgramTypes.join(', ') });
      }

      const session = await storage.createEnrollmentSession(userId, {
        programType,
        voiceEnabled: voiceEnabled || false,
      });

      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating enrollment session:', error);
      res.status(500).json({ message: 'Failed to create enrollment session' });
    }
  });

  // GET /api/enrollment/sessions - Get user's enrollment sessions
  app.get('/api/enrollment/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const sessions = await storage.getEnrollmentSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching enrollment sessions:', error);
      res.status(500).json({ message: 'Failed to fetch enrollment sessions' });
    }
  });

  // GET /api/enrollment/sessions/:id - Get specific enrollment session with responses
  app.get('/api/enrollment/sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.id;

      const session = await storage.getEnrollmentSession(sessionId, userId);
      if (!session) {
        return res.status(404).json({ message: 'Enrollment session not found' });
      }

      const responses = await storage.getEnrollmentResponses(sessionId);
      res.json({ ...session, responses });
    } catch (error) {
      console.error('Error fetching enrollment session:', error);
      res.status(500).json({ message: 'Failed to fetch enrollment session' });
    }
  });

  // PATCH /api/enrollment/sessions/:id - Update enrollment session
  app.patch('/api/enrollment/sessions/:id', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.id;
      const updates = req.body;

      // Verify session belongs to user
      const existingSession = await storage.getEnrollmentSession(sessionId, userId);
      if (!existingSession) {
        return res.status(404).json({ message: 'Enrollment session not found' });
      }

      const updatedSession = await storage.updateEnrollmentSession(sessionId, userId, updates);
      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating enrollment session:', error);
      res.status(500).json({ message: 'Failed to update enrollment session' });
    }
  });

  // POST /api/enrollment/sessions/:id/responses - Add a response to a session
  app.post('/api/enrollment/sessions/:id/responses', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.id;
      const { questionKey, questionText, response, responseType } = req.body;

      if (!questionKey) {
        return res.status(400).json({ message: 'questionKey is required' });
      }

      // Verify session belongs to user
      const session = await storage.getEnrollmentSession(sessionId, userId);
      if (!session) {
        return res.status(404).json({ message: 'Enrollment session not found' });
      }

      const enrollmentResponse = await storage.createEnrollmentResponse({
        sessionId,
        questionKey,
        questionText,
        response,
        responseType,
      });

      res.status(201).json(enrollmentResponse);
    } catch (error) {
      console.error('Error creating enrollment response:', error);
      res.status(500).json({ message: 'Failed to create enrollment response' });
    }
  });

  // POST /api/enrollment/sessions/:id/submit - Submit the enrollment application
  app.post('/api/enrollment/sessions/:id/submit', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.id;

      // Verify session belongs to user
      const session = await storage.getEnrollmentSession(sessionId, userId);
      if (!session) {
        return res.status(404).json({ message: 'Enrollment session not found' });
      }

      if (session.status === 'submitted') {
        return res.status(400).json({ message: 'Session has already been submitted' });
      }

      // Generate confirmation number
      const confirmationNumber = `GR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Create applicant record from session data
      const applicantData = session.applicantData || {};
      const applicant = await storage.createEnrollmentApplicant({
        sessionId,
        userId,
        programType: session.programType,
        fullName: applicantData.firstName && applicantData.lastName 
          ? `${applicantData.firstName} ${applicantData.lastName}` 
          : undefined,
        dateOfBirth: applicantData.dob,
        contactEmail: applicantData.email,
        contactPhone: applicantData.phone,
        mailingAddress: applicantData.address,
        applicationData: applicantData,
        status: 'pending',
        confirmationNumber,
      });

      // Update session status
      await storage.updateEnrollmentSession(sessionId, userId, {
        status: 'submitted',
        submittedAt: new Date(),
        completedAt: new Date(),
      });

      res.json({
        applicant,
        confirmationNumber,
        message: 'Application submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting enrollment application:', error);
      res.status(500).json({ message: 'Failed to submit enrollment application' });
    }
  });

  // POST /api/enrollment/eligibility-check - AI-powered eligibility check
  app.post('/api/enrollment/eligibility-check', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const { programType, age, income, householdSize, state, currentCoverage, hasDisability } = req.body;

      if (!programType || age === undefined || income === undefined || householdSize === undefined || !state) {
        return res.status(400).json({ 
          message: 'Missing required fields: programType, age, income, householdSize, and state are required' 
        });
      }

      const prompt = `You are a Medicare/Medicaid eligibility expert. Analyze the following information to determine eligibility for healthcare programs.

APPLICANT INFORMATION:
- Requested Program: ${programType}
- Age: ${age}
- Annual Household Income: $${income}
- Household Size: ${householdSize}
- State: ${state}
- Current Coverage: ${currentCoverage || 'None specified'}
- Has Disability: ${hasDisability ? 'Yes' : 'No'}

FEDERAL POVERTY LEVEL GUIDELINES (2024):
- 1 person: $15,060
- 2 people: $20,440
- 3 people: $25,820
- 4 people: $31,200
- Each additional: +$5,380

MEDICARE ELIGIBILITY CRITERIA:
- Part A: Age 65+ OR disability for 24+ months OR ESRD/ALS
- Part B: Same as Part A, optional enrollment
- Part C (Medicare Advantage): Must have Part A and B
- Part D: Must have Part A or B

MEDICAID ELIGIBILITY:
- Income-based, varies by state
- Generally up to 138% FPL in expansion states
- Special categories for children (CHIP), pregnant women, elderly, disabled

Analyze and provide a JSON response with:
{
  "eligible": boolean (true if likely eligible for the requested program),
  "reasons": ["array of specific reasons for eligibility determination"],
  "recommendedPrograms": ["array of programs they may qualify for"],
  "nextSteps": ["array of actionable next steps to apply"]
}`;

      const result = await aiProvider.generateJSON<{
        eligible: boolean;
        reasons: string[];
        recommendedPrograms: string[];
        nextSteps: string[];
      }>(prompt, 'You are a government healthcare program eligibility expert. Analyze eligibility based on federal guidelines.', { temperature: 0.3 });

      res.json(result);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      res.status(500).json({ message: 'Failed to check eligibility' });
    }
  });

  // ===============================================
  // INSURANCE BENEFITS API ENDPOINTS
  // ===============================================

  // GET /api/insurance/providers - Get all insurance providers
  app.get('/api/insurance/providers', async (req, res) => {
    try {
      const { type, state } = req.query;
      const providers = await storage.getInsuranceProviders({
        type: type as string | undefined,
        state: state as string | undefined,
      });
      res.json(providers);
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
      res.status(500).json({ message: 'Failed to fetch insurance providers' });
    }
  });

  // GET /api/insurance/providers/:id - Get specific provider with their plans
  app.get('/api/insurance/providers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const provider = await storage.getInsuranceProvider(id);
      
      if (!provider) {
        return res.status(404).json({ message: 'Provider not found' });
      }
      
      const plans = await storage.getInsurancePlans({ providerId: id });
      
      res.json({
        ...provider,
        plans,
      });
    } catch (error) {
      console.error('Error fetching insurance provider:', error);
      res.status(500).json({ message: 'Failed to fetch insurance provider' });
    }
  });

  // GET /api/insurance/plans - Get insurance plans
  app.get('/api/insurance/plans', async (req, res) => {
    try {
      const { providerId, planType, metalLevel, maxPremium, state } = req.query;
      
      const plans = await storage.getInsurancePlans({
        providerId: providerId as string | undefined,
        planType: planType as string | undefined,
        metalLevel: metalLevel as string | undefined,
        maxPremium: maxPremium ? parseFloat(maxPremium as string) : undefined,
        state: state as string | undefined,
      });
      
      // Get provider info for each plan
      const providerIds = Array.from(new Set(plans.map(p => p.providerId).filter(Boolean))) as string[];
      const providers = await Promise.all(providerIds.map(id => storage.getInsuranceProvider(id)));
      const providerMap = new Map(providers.filter(Boolean).map(p => [p!.id, p]));
      
      const plansWithProviders = plans.map(plan => ({
        ...plan,
        provider: plan.providerId ? providerMap.get(plan.providerId) : null,
      }));
      
      res.json(plansWithProviders);
    } catch (error) {
      console.error('Error fetching insurance plans:', error);
      res.status(500).json({ message: 'Failed to fetch insurance plans' });
    }
  });

  // GET /api/insurance/plans/:id - Get specific plan with all benefits
  app.get('/api/insurance/plans/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.getInsurancePlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      const [provider, benefits, categories] = await Promise.all([
        plan.providerId ? storage.getInsuranceProvider(plan.providerId) : null,
        storage.getPlanBenefits(id),
        storage.getBenefitCategories(),
      ]);
      
      // Group benefits by category
      const categoryMap = new Map(categories.map(c => [c.id, { ...c, benefits: [] as typeof benefits }]));
      const uncategorizedBenefits: typeof benefits = [];
      
      for (const benefit of benefits) {
        if (benefit.categoryId && categoryMap.has(benefit.categoryId)) {
          categoryMap.get(benefit.categoryId)!.benefits.push(benefit);
        } else {
          uncategorizedBenefits.push(benefit);
        }
      }
      
      const benefitsByCategory = Array.from(categoryMap.values())
        .filter(cat => cat.benefits.length > 0)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      
      if (uncategorizedBenefits.length > 0) {
        benefitsByCategory.push({
          id: 'uncategorized',
          name: 'Other Benefits',
          description: null,
          icon: null,
          displayOrder: 999,
          benefits: uncategorizedBenefits,
        });
      }
      
      res.json({
        ...plan,
        provider,
        benefitsByCategory,
      });
    } catch (error) {
      console.error('Error fetching insurance plan:', error);
      res.status(500).json({ message: 'Failed to fetch insurance plan' });
    }
  });

  // GET /api/insurance/benefit-categories - Get all benefit categories
  app.get('/api/insurance/benefit-categories', async (req, res) => {
    try {
      const categories = await storage.getBenefitCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching benefit categories:', error);
      res.status(500).json({ message: 'Failed to fetch benefit categories' });
    }
  });

  // POST /api/insurance/explain-benefit - AI explanation of a specific benefit
  app.post('/api/insurance/explain-benefit', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const { planId, benefitId, question } = req.body;
      
      if (!planId || !benefitId) {
        return res.status(400).json({ message: 'planId and benefitId are required' });
      }
      
      const [plan, benefit] = await Promise.all([
        storage.getInsurancePlan(planId),
        storage.getPlanBenefit(benefitId),
      ]);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      if (!benefit) {
        return res.status(404).json({ message: 'Benefit not found' });
      }
      
      const prompt = `You are a health insurance expert. Explain the following insurance benefit in plain English that anyone can understand.

PLAN INFORMATION:
- Plan Name: ${plan.name}
- Plan Type: ${plan.planType || 'Not specified'}
- Metal Level: ${plan.metalLevel || 'Not specified'}
- Deductible: $${plan.deductible || 'Not specified'}
- Out-of-Pocket Max: $${plan.outOfPocketMax || 'Not specified'}

BENEFIT DETAILS:
- Benefit Name: ${benefit.benefitName}
- Coverage Type: ${benefit.coverageType || 'Not specified'}
- Coverage Details: ${benefit.coverageDetails || 'Not specified'}
- Copay Amount: $${benefit.copayAmount || 'None'}
- Coinsurance: ${benefit.coinsurancePercent ? benefit.coinsurancePercent + '%' : 'None'}
- Annual Limit: $${benefit.annualLimit || 'None'}
- Requires Pre-Authorization: ${benefit.requiresPreAuth ? 'Yes' : 'No'}
- In-Network Only: ${benefit.inNetworkOnly ? 'Yes' : 'No'}
- Notes: ${benefit.notes || 'None'}

${question ? `USER'S SPECIFIC QUESTION: ${question}` : ''}

Provide a JSON response with:
{
  "explanation": "A clear, jargon-free explanation of this benefit and what it means for the member",
  "examples": ["2-3 real-world examples of when this benefit would apply"],
  "relatedBenefits": ["List any related benefits they might want to know about"]
}`;

      const result = await aiProvider.generateJSON<{
        explanation: string;
        examples: string[];
        relatedBenefits?: string[];
      }>(prompt, 'You are a health insurance benefits expert. Explain insurance benefits in plain, jargon-free language.', { temperature: 0.5 });
      
      res.json(result);
    } catch (error) {
      console.error('Error explaining benefit:', error);
      res.status(500).json({ message: 'Failed to explain benefit' });
    }
  });

  // POST /api/insurance/compare-plans - AI-powered plan comparison
  app.post('/api/insurance/compare-plans', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const { planIds, focusAreas } = req.body;
      
      if (!planIds || !Array.isArray(planIds) || planIds.length < 2) {
        return res.status(400).json({ message: 'At least 2 planIds are required for comparison' });
      }
      
      if (planIds.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 plans can be compared at once' });
      }
      
      const plans = await storage.getInsurancePlansByIds(planIds);
      
      if (plans.length !== planIds.length) {
        return res.status(404).json({ message: 'One or more plans not found' });
      }
      
      // Get benefits for all plans
      const planBenefitsMap = new Map<string, Awaited<ReturnType<typeof storage.getPlanBenefits>>>();
      await Promise.all(plans.map(async (plan) => {
        const benefits = await storage.getPlanBenefits(plan.id);
        planBenefitsMap.set(plan.id, benefits);
      }));
      
      const plansDescription = plans.map(plan => {
        const benefits = planBenefitsMap.get(plan.id) || [];
        return `
PLAN: ${plan.name}
- Type: ${plan.planType || 'Not specified'}
- Metal Level: ${plan.metalLevel || 'Not specified'}
- Monthly Premium: $${plan.monthlyPremium || 'Not specified'}
- Deductible: $${plan.deductible || 'Not specified'}
- Family Deductible: $${plan.familyDeductible || 'Not specified'}
- Out-of-Pocket Max: $${plan.outOfPocketMax || 'Not specified'}
- Primary Care Copay: $${plan.copayPrimary || 'Not specified'}
- Specialist Copay: $${plan.copaySpecialist || 'Not specified'}
- ER Copay: $${plan.copayER || 'Not specified'}
- Network Type: ${plan.networkType || 'Not specified'}
- Number of Benefits Covered: ${benefits.length}`;
      }).join('\n\n');

      const prompt = `You are a health insurance expert. Compare the following insurance plans and help the user understand which might be best for their needs.

${plansDescription}

${focusAreas && focusAreas.length > 0 ? `USER'S FOCUS AREAS: ${focusAreas.join(', ')}` : ''}

Provide a comprehensive comparison in JSON format:
{
  "comparison": "A clear narrative comparison of these plans, highlighting key differences",
  "prosConsPerPlan": [
    {
      "planName": "Plan Name",
      "pros": ["List of advantages"],
      "cons": ["List of disadvantages"],
      "bestFor": "Description of who this plan is best suited for"
    }
  ],
  "recommendation": "A balanced recommendation considering different user needs and situations"
}`;

      const result = await aiProvider.generateJSON<{
        comparison: string;
        prosConsPerPlan: Array<{
          planName: string;
          pros: string[];
          cons: string[];
          bestFor: string;
        }>;
        recommendation?: string;
      }>(prompt, 'You are a health insurance comparison expert. Provide balanced, objective plan comparisons.', { temperature: 0.4 });
      
      res.json(result);
    } catch (error) {
      console.error('Error comparing plans:', error);
      res.status(500).json({ message: 'Failed to compare plans' });
    }
  });

  // GET /api/insurance/user-plans - Get user's saved insurance plans
  app.get('/api/insurance/user-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userPlans = await storage.getUserInsurancePlans(userId);
      
      // Get full plan details for each saved plan
      const planIds = userPlans.map(up => up.planId).filter(Boolean) as string[];
      const plans = await storage.getInsurancePlansByIds(planIds);
      const planMap = new Map(plans.map(p => [p.id, p]));
      
      // Get provider info for each plan
      const providerIds = Array.from(new Set(plans.map(p => p.providerId).filter(Boolean))) as string[];
      const providers = await Promise.all(providerIds.map(id => storage.getInsuranceProvider(id)));
      const providerMap = new Map(providers.filter(Boolean).map(p => [p!.id, p]));
      
      const userPlansWithDetails = userPlans.map(userPlan => {
        const plan = userPlan.planId ? planMap.get(userPlan.planId) : null;
        const provider = plan?.providerId ? providerMap.get(plan.providerId) : null;
        
        return {
          ...userPlan,
          plan: plan ? {
            ...plan,
            provider,
          } : null,
        };
      });
      
      res.json(userPlansWithDetails);
    } catch (error) {
      console.error('Error fetching user insurance plans:', error);
      res.status(500).json({ message: 'Failed to fetch user insurance plans' });
    }
  });

  // POST /api/insurance/user-plans - Save a plan to user's profile
  app.post('/api/insurance/user-plans', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { planId, isPrimary, memberNumber, groupNumber, effectiveDate } = req.body;
      
      if (!planId) {
        return res.status(400).json({ message: 'planId is required' });
      }
      
      // Verify the plan exists
      const plan = await storage.getInsurancePlan(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      const userPlan = await storage.createUserInsurancePlan({
        userId,
        planId,
        isPrimary: isPrimary ?? true,
        memberNumber: memberNumber || null,
        groupNumber: groupNumber || null,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
      });
      
      res.status(201).json(userPlan);
    } catch (error) {
      console.error('Error saving user insurance plan:', error);
      res.status(500).json({ message: 'Failed to save insurance plan' });
    }
  });

  // DELETE /api/insurance/user-plans/:id - Remove a saved plan
  app.delete('/api/insurance/user-plans/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.deleteUserInsurancePlan(id, userId);
      res.json({ message: 'Insurance plan removed successfully' });
    } catch (error) {
      console.error('Error deleting user insurance plan:', error);
      res.status(500).json({ message: 'Failed to delete insurance plan' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
