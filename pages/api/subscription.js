import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get customer from Stripe using Clerk user ID
    const customers = await stripe.customers.list({
      limit: 1,
      metadata: { clerkUserId: userId }
    });

    if (!customers.data.length) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.plan.product']
    });

    if (!subscriptions.data.length) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];
    const product = subscription.plan.product;

    // Calculate usage
    const usage = await stripe.subscriptionItems.listUsageRecordSummaries(
      subscription.items.data[0].id
    );

    const totalUsage = usage.data[0]?.total_usage || 0;
    const limit = subscription.plan.metadata.adsLimit || 100;
    const remaining = Math.max(0, limit - totalUsage);

    return res.status(200).json({
      plan: product.name,
      adsUsed: totalUsage,
      adsTotal: limit,
      adsRemaining: remaining,
      status: subscription.status
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 