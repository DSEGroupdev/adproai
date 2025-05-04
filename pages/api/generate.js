import { getAuth } from "@clerk/nextjs/server";
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
    const { product, audience, usp, tone, platform, location, demographic, radius, keywords } = req.body;

    if (!product || !audience || !usp || !tone || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ad copy using OpenAI
    const prompt = `You are a performance ad strategist. Based on the following inputs, generate:
- A high-converting ad copy (headline, body, CTA) optimized for the selected platform.
- Suggested targeting radius and demographics.
- Recommended keywords to include in targeting.
- A monthly ad budget estimate.
The output should be customized for the selected ad platform (Facebook, Google Ads, LinkedIn, or Instagram), respecting platform-specific best practices and character limits.

Inputs:
- Product: ${product}
- Audience: ${audience}
- Unique Selling Point: ${usp}
- Tone: ${tone}
- Platform: ${platform}
- Location (if provided): ${location}

Respond only in strict JSON, like:
{
  "headline": "...",
  "body": "...",
  "callToAction": "...",
  "suggestedTargeting": {
    "radius": "15 miles around San Diego",
    "demographic": "Men 18–45, enduro riders",
    "keywords": ["enduro training", "dirt bike school"]
  },
  "recommendedBudget": "$250–300/month"
}`;

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
        suggestedTargeting: obj.suggestedTargeting || {
          radius: '',
          demographic: '',
          keywords: []
        },
        recommendedBudget: obj.recommendedBudget || obj.recommended_budget || '',
      };
    };

    const mappedAdCopy = mapKeys(adCopy);

    // Increment ads generated count
    await prisma.user.update({
      where: { id: userId },
      data: { adsGenerated: { increment: 1 } }
    });

    // Return the generated ad copy in the expected format
    return res.status(200).json({
      headline: mappedAdCopy.headline,
      body: mappedAdCopy.body,
      callToAction: mappedAdCopy.callToAction,
      suggestedTargeting: mappedAdCopy.suggestedTargeting,
      recommendedBudget: mappedAdCopy.recommendedBudget,
      adsRemaining: limit - (user.adsGenerated + 1)
    });

  } catch (error) {
    console.error('Error generating ad copy:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 