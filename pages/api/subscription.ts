import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  throw new Error('Stripe configuration is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      console.log('No user session found');
      return res.status(401).json({ error: 'Unauthorized - No user session' });
    }

    console.log('Fetching subscription for user:', userId);

    // Get customer from Stripe using Clerk user ID
    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1
    });

    if (!customers.data.length) {
      console.log('No Stripe customer found for user:', userId);
      return res.status(404).json({ 
        error: 'No subscription found',
        details: 'Please ensure you have completed the checkout process'
      });
    }

    const customer = customers.data[0];
    console.log('Found customer:', customer.id);

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.plan.product']
    });

    if (!subscriptions.data.length) {
      console.log('No active subscription found for customer:', customer.id);
      return res.status(404).json({ 
        error: 'No active subscription found',
        details: 'Please ensure you have an active subscription'
      });
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

    console.log('Subscription details:', {
      plan: product.name,
      adsUsed: totalUsage,
      adsTotal: limit,
      adsRemaining: remaining
    });

    return res.status(200).json({
      plan: product.name,
      adsUsed: totalUsage,
      adsTotal: limit,
      adsRemaining: remaining,
      status: subscription.status
    });

  } catch (error) {
    console.error('Subscription error:', {
      message: error.message,
      type: error.type,
      stack: error.stack,
      raw: error
    });

    if (error.type?.startsWith('Stripe')) {
      return res.status(500).json({ 
        error: 'Stripe service error',
        details: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch subscription',
      details: 'An unexpected error occurred'
    });
  }
} 