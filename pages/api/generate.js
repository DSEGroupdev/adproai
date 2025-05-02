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
    const { product, audience, usp, tone, platform, location, demographic } = req.body;

    if (!product || !audience || !usp || !tone || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ad copy using OpenAI
    const prompt = `Create a compelling ad for ${platform} with the following details:
Product: ${product}
Target Audience: ${audience}
Unique Selling Point: ${usp}
Tone: ${tone}
${location ? `Target Location: ${location}` : ''}
${demographic ? `Target Demographic: ${demographic}` : ''}

Generate high-converting ad copy tailored to the selected platform, tone, audience, and unique selling point. If provided, factor in the target location and demographic details to make the copy more relevant.

Structure your response in JSON format:
{
  "headline": "...",
  "body": "...",
  "call_to_action": "...",
  "targeting": "Suggested Targeting: Age 25–45, Interests: AI Tools, Location: Dubai"
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

    // Increment ads generated count
    await prisma.user.update({
      where: { id: userId },
      data: { adsGenerated: { increment: 1 } }
    });

    // Return the generated ad copy
    return res.status(200).json({
      ...adCopy,
      adsRemaining: limit - (user.adsGenerated + 1)
    });

  } catch (error) {
    console.error('Error generating ad copy:', error);
    return res.status(500).json({ error: "Failed to generate ad copy. Please try again." });
  }
} 