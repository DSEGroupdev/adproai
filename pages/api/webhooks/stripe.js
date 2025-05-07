import { auth } from '@clerk/nextjs';
import prisma from '../../../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    console.log('Processing webhook event:', {
      type: event.type,
      id: event.id,
      created: new Date(event.created * 1000).toISOString()
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', {
          sessionId: session.id,
          customerId: session.customer,
          metadata: session.metadata,
          subscriptionId: session.subscription
        });

        const { clerkUserId } = session.metadata;

        if (!clerkUserId) {
          console.error('No clerkUserId in session metadata:', session);
          return res.status(400).json({ error: 'Missing clerkUserId in session metadata' });
        }

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log('Subscription details:', {
          id: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
        });

        // Update user's plan to PREMIUM
        await prisma.user.update({
          where: { clerkId: clerkUserId },
          data: { plan: 'PREMIUM' },
        });

        console.log('Updated user plan to PREMIUM:', {
          clerkUserId,
          customerId: session.customer,
          subscriptionId: session.subscription
        });

        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.cancelled': {
        const subscription = event.data.object;
        console.log('Subscription cancelled/deleted:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
        });

        const customer = await stripe.customers.retrieve(subscription.customer);
        const { clerkUserId } = customer.metadata;

        if (clerkUserId) {
          // Update user's plan back to FREE
          await prisma.user.update({
            where: { clerkId: clerkUserId },
            data: { plan: 'FREE' },
          });

          console.log('Updated user plan to FREE:', {
            clerkUserId,
            customerId: customer.id,
            subscriptionId: subscription.id
          });
        }

        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    });
    return res.status(500).json({ error: 'Error processing webhook' });
  }
} 