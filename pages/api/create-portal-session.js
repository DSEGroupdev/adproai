import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  throw new Error('Stripe configuration is missing');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.error('Missing NEXT_PUBLIC_APP_URL environment variable');
  throw new Error('App URL configuration is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session
    const { userId } = getAuth(req);
    if (!userId) {
      console.log('No user session found');
      return res.status(401).json({ error: 'Unauthorized - No user session' });
    }

    console.log('Fetching customer for user:', userId);

    // Get customer from Stripe using Clerk user ID
    const customers = await stripe.customers.list({
      limit: 1,
      metadata: { clerkUserId: userId }
    });

    if (!customers.data.length) {
      console.log('No Stripe customer found for user:', userId);
      return res.status(404).json({ 
        error: 'No customer found',
        details: 'Please ensure you have completed the checkout process'
      });
    }

    const customer = customers.data[0];
    console.log('Found customer:', customer.id);

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    console.log('Created portal session:', session.id);
    return res.status(200).json({ url: session.url });

  } catch (error) {
    // Log the full error for debugging
    console.error('Portal session error:', {
      message: error.message,
      type: error.type,
      stack: error.stack,
      raw: error
    });

    // Return appropriate error response
    if (error.type?.startsWith('Stripe')) {
      return res.status(500).json({ 
        error: 'Stripe service error',
        details: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      details: 'Failed to create billing portal session'
    });
  }
} 