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
    // Get user session and log it
    const { userId } = getAuth(req);
    console.log('User session:', { userId });

    if (!userId) {
      console.log('No user session found');
      return res.status(401).json({ error: 'Unauthorized - No user session' });
    }

    // Get customer from Stripe using Clerk user ID
    console.log('Searching for Stripe customer with metadata:', { clerkUserId: userId });
    const customers = await stripe.customers.list({
      limit: 1,
      metadata: { clerkUserId: userId }
    });

    console.log('Stripe customers response:', {
      count: customers.data.length,
      hasMore: customers.has_more,
      customerIds: customers.data.map(c => c.id)
    });

    if (!customers.data.length) {
      console.log('No Stripe customer found for user:', userId);
      return res.status(404).json({ 
        error: 'No customer found',
        details: 'Please ensure you have completed the checkout process'
      });
    }

    const customer = customers.data[0];
    console.log('Found Stripe customer:', {
      id: customer.id,
      email: customer.email,
      metadata: customer.metadata
    });

    // Create a billing portal session
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    console.log('Creating portal session with return URL:', returnUrl);

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    console.log('Successfully created portal session:', {
      id: session.id,
      url: session.url,
      customer: session.customer
    });

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
        error: 'Failed to create billing portal session',
        details: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Failed to create billing portal session',
      details: 'An unexpected error occurred'
    });
  }
} 