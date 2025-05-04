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
    const prompt = `You are a professional performance ad strategist.

Create a high-converting ad campaign for the following product or service, customized to the selected ad platform.

Inputs:
- Product: ${product}
- Audience: ${audience}
- Unique Selling Point: ${usp}
- Tone: ${tone}
- Platform: ${platform}
- Location (if provided): ${location}
- Demographic Details (if provided): ${demographic}
- Keyword Focus (if provided): ${keywords}

Respond in strict JSON format with the following fields:
- headline
- body
- call_to_action
- targeting
- recommended_budget

Platform-specific instructions:

▶️ Facebook/Instagram:  
- Headline max 40 characters  
- Body max 125 characters  
- Interest-based targeting  
- Call to action in casual or emotional tone  
- Include suggested age, gender, location, interests  
- Format body for mobile

🔍 Google Ads:  
- 3 headlines (max 30 characters each)  
- 2 descriptions (max 90 characters each)  
- Focus on search intent and keyword usage  
- Include radius-based location targeting  
- Include suggested daily budget

💼 LinkedIn:  
- Professional tone  
- Headline under 50 characters  
- Target by job titles, industries, and company size  
- Emphasize B2B value  
- Include suggested daily budget for B2B targeting

Respond only in strict JSON, like:
{
  "headline": "...",
  "body": "...",
  "call_to_action": "...",
  "targeting": "Suggested Targeting:\\n- Age: 30–50\\n- Gender: All\\n- Interests: AI tools, SaaS, automation\\n- Location: Within 25 miles of San Diego",
  "recommended_budget": "$20–30/day for the first 7 days"
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
        callToAction: obj.call_to_action || obj.callToAction || '',
        targeting: (typeof obj.targeting === 'object' && obj.targeting !== null)
          ? {
              demographics: obj.targeting.demographics || [],
              geographics: obj.targeting.geographics || []
            }
          : { demographics: [], geographics: [] },
        recommendedBudget: obj.recommended_budget || obj.recommendedBudget || '',
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
      targeting: mappedAdCopy.targeting,
      recommendedBudget: mappedAdCopy.recommendedBudget,
      adsRemaining: limit - (user.adsGenerated + 1)
    });

  } catch (error) {
    console.error('Error generating ad copy:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
} 