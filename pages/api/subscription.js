import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import prisma from '../../lib/prisma';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  throw new Error('Stripe configuration is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user session' });
    }

    // Get user from DB for email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Try to find Stripe customer by metadata clerkUserId
    let customer = null;
    let customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1
    });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else if (user.email) {
      // 2. Fall back to searching by email match
      customers = await stripe.customers.search({
        query: `email:'${user.email}'`,
        limit: 1
      });
      if (customers.data.length > 0) {
        customer = customers.data[0];
        // 3. If missing correct metadata, update it
        if (!customer.metadata || customer.metadata.clerkUserId !== userId) {
          await stripe.customers.update(customer.id, {
            metadata: { ...customer.metadata, clerkUserId: userId }
          });
          console.log('Updated Stripe customer metadata with clerkUserId:', userId);
        }
      }
    }
    let isPremium = false;
    if (customer) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        expand: ['data.plan.product']
      });
      isPremium = subscriptions.data.length > 0;
    }

    if (!customer) {
      return res.status(404).json({ error: 'No Stripe customer found for user' });
    }

    const product = customer.metadata?.product ? JSON.parse(customer.metadata.product) : null;
    const planName = product ? product.name : 'Premium';
    const adsLimit = customer.metadata?.adsLimit || 100;

    // Usage calculation (optional, fallback to 0 if not using metered)
    const adsUsed = 0;
    const adsRemaining = adsLimit - adsUsed;

    return res.status(200).json({
      plan: planName,
      adsUsed,
      adsTotal: adsLimit,
      adsRemaining,
      status: isPremium ? 'active' : 'inactive'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription' });
  }
} 