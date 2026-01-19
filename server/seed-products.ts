import { getUncachableStripeClient } from './stripeClient';

async function createGoldRockProducts() {
  console.log('Creating GoldRock Health subscription products...');
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.search({ query: "active:'true'" });
  
  const hasMonthly = existingProducts.data.some(p => p.name.includes('Monthly'));
  const hasAnnual = existingProducts.data.some(p => p.name.includes('Annual'));
  const hasLifetime = existingProducts.data.some(p => p.name.includes('Lifetime'));

  if (!hasMonthly) {
    console.log('Creating Monthly subscription product...');
    const monthlyProduct = await stripe.products.create({
      name: 'GoldRock Health Premium Monthly',
      description: 'Monthly subscription for GoldRock Health Premium - AI-powered medical bill reduction including bill analysis, negotiation coaching, dispute templates, and insider strategies',
      metadata: {
        plan_type: 'monthly',
        features: 'bill_analysis,negotiation_coaching,dispute_templates,insider_strategies',
      },
    });

    await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 2500,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: 'monthly' },
    });
    console.log('Monthly product created:', monthlyProduct.id);
  }

  if (!hasAnnual) {
    console.log('Creating Annual subscription product...');
    const annualProduct = await stripe.products.create({
      name: 'GoldRock Health Premium Annual',
      description: 'Annual subscription for GoldRock Health Premium - Save 17% with annual billing. Full access to AI bill analysis, negotiation coaching, dispute templates, and insider strategies',
      metadata: {
        plan_type: 'annual',
        features: 'bill_analysis,negotiation_coaching,dispute_templates,insider_strategies,priority_support',
        savings: '17%',
      },
    });

    await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 24900,
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { plan: 'annual' },
    });
    console.log('Annual product created:', annualProduct.id);
  }

  if (!hasLifetime) {
    console.log('Creating Lifetime access product...');
    const lifetimeProduct = await stripe.products.create({
      name: 'GoldRock Health Premium Lifetime',
      description: 'Lifetime access to GoldRock Health Premium - Pay once, use forever. Includes all current and future features, priority support, and exclusive insider strategies',
      metadata: {
        plan_type: 'lifetime',
        features: 'bill_analysis,negotiation_coaching,dispute_templates,insider_strategies,priority_support,lifetime_updates',
      },
    });

    await stripe.prices.create({
      product: lifetimeProduct.id,
      unit_amount: 74700,
      currency: 'usd',
      metadata: { plan: 'lifetime' },
    });
    console.log('Lifetime product created:', lifetimeProduct.id);
  }

  console.log('Product seeding complete!');
}

createGoldRockProducts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error creating products:', err);
    process.exit(1);
  });
