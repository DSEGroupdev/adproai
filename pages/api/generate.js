import { getAuth } from "@clerk/nextjs/server";
import prisma from '../../lib/prisma';
import OpenAI from 'openai';
import Stripe from 'stripe';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FREE_TIER_LIMIT = 3;
const PREMIUM_TIER_LIMIT = 100;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      console.log('No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Processing request for user:', userId);

    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log('Database user:', {
      exists: !!user,
      plan: user?.plan,
      adsGenerated: user?.adsGenerated
    });

    if (!user) {
      console.log('Creating new user in database');
      user = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          email: `${userId}@placeholder.email`,
          plan: "FREE",
          adsGenerated: 0
        },
      });
    }

    // Log the user's email from Clerk before searching Stripe
    console.log('User email from Clerk:', user.email);

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
        status: 'active'
      });
      isPremium = subscriptions.data.length > 0;
    }

    console.log('Subscription status:', {
      isPremium,
      currentPlan: user.plan,
      needsUpdate: isPremium && user.plan !== 'PREMIUM'
    });

    // Update user's plan based on Stripe subscription
    if (isPremium && user.plan !== 'PREMIUM') {
      console.log('Updating user plan to PREMIUM');
      user = await prisma.user.update({
        where: { id: userId },
        data: { plan: 'PREMIUM' }
      });
    }

    // Check ad generation limits
    const limit = isPremium ? PREMIUM_TIER_LIMIT : FREE_TIER_LIMIT;
    
    console.log('Ad generation limits:', {
      isPremium,
      limit,
      currentUsage: user.adsGenerated,
      remaining: limit - user.adsGenerated
    });

    if (user.adsGenerated >= limit) {
      console.log('Ad limit reached:', {
        limit,
        currentUsage: user.adsGenerated,
        plan: isPremium ? 'PREMIUM' : 'FREE'
      });
      return res.status(403).json({
        error: 'ad_limit_reached',
        message: `You have reached your monthly ad generation limit (${limit} ads)`,
        currentPlan: isPremium ? 'PREMIUM' : 'FREE'
      });
    }

    // Extract request data
    const { product, audience, usp, tone, platform, location, demographic, radius, keywords } = req.body;

    if (!product || !audience || !usp || !tone || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ad copy using OpenAI
    const prompt = `You are a world-class paid media strategist. Your goal is to generate complete ad copy and platform-specific targeting advice for the following product or service. Always return all fields in the JSON response.

Return your response in this JSON format:
{
  "headline": "Short, high-converting, benefit-driven headline optimized for [platform]",
  "body": "Persuasive ad copy with clear benefits, social proof or urgency. Max 125 words for Meta platforms.",
  "callToAction": "Strong CTA tailored to platform (e.g., Book Now, Get Offer, Contact Us)",
  "targeting": {
    "radius": "Suggested ad targeting radius based on product and location (e.g., 15 miles)",
    "demographic": "Suggested age range, gender, interests, job titles, etc.",
    "keywords": "Suggested keyword themes for ad targeting or SEO"
  },
  "recommendedBudget": "Suggested monthly ad budget in USD based on audience size and platform"
}

Instructions:
- Respect the selected tone and platform
- Headline must be punchy and emotionally engaging
- Body must be platform-appropriate (e.g. Meta vs Google vs LinkedIn)
- All fields must always be returned
- CTA should avoid generic terms like 'Sign Up Now' unless highly relevant

Inputs:
- Product: ${product}
- Audience: ${audience}
- Unique Selling Point: ${usp}
- Tone: ${tone}
- Platform: ${platform}
- Location (if provided): ${location}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in social media ads. Provide responses in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    let adCopy;
    try {
      adCopy = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return res.status(500).json({ error: 'Failed to parse ad copy response' });
    }

    // Map snake_case to camelCase for frontend compatibility
    const mapKeys = (obj) => {
      return {
        headline: obj.headline || '',
        body: obj.body || '',
        callToAction: obj.callToAction || obj.call_to_action || '',
        targeting: obj.targeting ? {
          radius: obj.targeting.radius || '',
          demographic: obj.targeting.demographic || '',
          keywords: typeof obj.targeting.keywords === 'string' ? obj.targeting.keywords : Array.isArray(obj.targeting.keywords) ? obj.targeting.keywords.join(', ') : ''
        } : { radius: '', demographic: '', keywords: '' },
        recommendedBudget: obj.recommendedBudget || obj.recommended_budget || '',
      };
    };

    const mappedAdCopy = mapKeys(adCopy);

    // Validate required fields
    const isValid = mappedAdCopy.headline && mappedAdCopy.body && mappedAdCopy.callToAction;
    if (!isValid) {
      console.error('Invalid GPT response: missing required fields', mappedAdCopy);
      return res.status(500).json({ error: 'Invalid GPT response: missing required fields', valid: false });
    }

    // Return the generated ad copy in the expected format, with valid flag
    return res.status(200).json({
      headline: mappedAdCopy.headline,
      body: mappedAdCopy.body,
      callToAction: mappedAdCopy.callToAction,
      targeting: mappedAdCopy.targeting,
      recommendedBudget: mappedAdCopy.recommendedBudget,
      adsRemaining: limit - user.adsGenerated, // not incremented here
      valid: true
    });

  } catch (error) {
    console.error('Error generating ad copy:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 