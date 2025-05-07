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
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { clerkUserId } = session.metadata;

        if (!clerkUserId) {
          console.error('No clerkUserId in session metadata:', session);
          return res.status(400).json({ error: 'Missing clerkUserId in session metadata' });
        }

        // Create or update customer with clerkUserId
        const customer = await stripe.customers.create({
          metadata: {
            clerkUserId: clerkUserId
          }
        });

        // Update user's plan to PREMIUM
        await prisma.user.update({
          where: { clerkId: clerkUserId },
          data: { plan: 'PREMIUM' },
        });

        console.log('Updated user plan to PREMIUM:', {
          clerkUserId,
          customerId: customer.id
        });

        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.cancelled': {
        const subscription = event.data.object;
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
            customerId: customer.id
          });
        }

        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
} 