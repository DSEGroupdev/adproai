import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/nextjs";
import prisma from '../../lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FREE_TIER_LIMIT = 3;
const PREMIUM_TIER_LIMIT = 100;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Fetch user email from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        return res.status(400).json({ error: "User email not found in Clerk." });
      }

      user = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          email,
          plan: "FREE",
          adsGenerated: 0
        },
      });
    }

    // Check ad generation limits
    const isFreeTier = user.plan === 'FREE';
    const limit = isFreeTier ? FREE_TIER_LIMIT : PREMIUM_TIER_LIMIT;
    
    if (user.adsGenerated >= limit) {
      return res.status(403).json({
        error: 'ad_limit_reached',
        message: `You have reached your monthly ad generation limit (${limit} ads)`,
        currentPlan: user.plan
      });
    }

    // Extract request data
    const { product, audience, usp, tone, platform } = req.body;

    if (!product || !audience || !usp || !tone || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ad copy using OpenAI
    const prompt = `Create a compelling ad for ${platform} with the following details:
Product: ${product}
Target Audience: ${audience}
Unique Selling Point: ${usp}
Tone: ${tone}

Please provide:
1. Attention-grabbing headline
2. Engaging body copy
3. Clear call-to-action
4. Targeting suggestions for ${platform}

Format the response as JSON with these keys: headline, body, callToAction, targeting`;

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

    // Increment ads generated count
    await prisma.user.update({
      where: { id: user.id },
      data: { adsGenerated: { increment: 1 } },
    });

    // Get updated ads remaining count
    const adsRemaining = limit - (user.adsGenerated + 1);

    // Save the generated ad copy
    await prisma.adCopy.create({
      data: {
        userId: user.id,
        content: responseText,
        platform,
      },
    });

    // Return the generated ad copy with remaining ads count
    return res.status(200).json({
      ...adCopy,
      adsRemaining,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 