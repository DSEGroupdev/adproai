import { auth } from '@clerk/nextjs';
import prisma from '../../lib/prisma';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const FREE_TIER_LIMIT = 3;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = auth();
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          plan: 'FREE',
          adsGenerated: 0,
        },
      });
    }

    // Check ad generation limits
    const isFreeTier = user.plan === 'FREE';
    if (isFreeTier && user.adsGenerated >= FREE_TIER_LIMIT) {
      return res.status(403).json({
        error: 'ad_limit_reached',
        message: 'You have reached your monthly ad generation limit',
        currentPlan: user.plan
      });
    }

    // Extract request data
    const { product, audience, usp, tone, platform } = req.body;

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

    const completion = await openai.createChatCompletion({
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
    const responseText = completion.data.choices[0].message.content;
    const adCopy = JSON.parse(responseText);

    // Increment ads generated count
    await prisma.user.update({
      where: { id: user.id },
      data: { adsGenerated: { increment: 1 } },
    });

    // Get updated ads remaining count
    const adsRemaining = isFreeTier ? FREE_TIER_LIMIT - (user.adsGenerated + 1) : null;

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