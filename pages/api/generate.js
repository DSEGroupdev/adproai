import prisma from "../../lib/prisma";
import { checkAdGenerationLimit, incrementAdCount } from "../../lib/adLimit";
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, product, audience, usp, tone, platform, targeting } = req.body;

  if (!userId || !product) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the user's email from Clerk
    const { userId: clerkUserId } = getAuth(req);
    const userResponse = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user from Clerk');
    }
    
    const userData = await userResponse.json();
    const userEmail = userData.email_addresses.find(email => email.id === userData.primary_email_address_id)?.email_address;

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      if (!userEmail) {
        return res.status(400).json({ error: "User email not found" });
      }

      user = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail,
          plan: "FREE",
          adsGenerated: 0,
        },
      });
    }

    await checkAdGenerationLimit(userId);

    // Plan-based feature control
    const allowTextTargeting = ["STARTER", "PRO", "AGENCY"].includes(user.plan);
    const allowTargetingConfig = ["PRO", "AGENCY"].includes(user.plan);

    let platformInstructions = "";

    switch (platform.toLowerCase()) {
      case "facebook":
        platformInstructions = "Format this ad for Facebook. Output should include:\n- Headline (max 40 characters)\n- Body (max 125 characters)\n- Call to Action (1 sentence, max 80 characters)\nStrictly follow these character limits. Do not exceed.";
        break;
      case "instagram":
        platformInstructions = "Format this ad for Instagram. Combine the message into one emotional, short caption under 100 characters total. Use emojis if appropriate. Do not exceed 100 characters.";
        break;
      case "google":
        platformInstructions = "Format for Google Search Ads. Output should include:\n- 3 Headlines (max 30 characters each)\n- 2 Descriptions (max 90 characters each)\nReturn in a clear labeled format. Strictly follow these limits.";
        break;
      case "tiktok":
        platformInstructions = "Format this ad for TikTok. Use a casual, fun tone. Output should be a single hook-based sentence under 80 characters. Include a trending-style tone. Do not exceed limit.";
        break;
      case "linkedin":
        platformInstructions = "Format for LinkedIn. Output should include:\n- Headline (max 50 characters)\n- Body (max 150 characters)\n- Call to Action (formal, max 80 characters)\nUse a professional tone and strictly respect these character limits.";
        break;
      default:
        platformInstructions = "Output should include Headline, Body, and Call to Action. Keep each section concise. Do not exceed reasonable ad character limits.";
    }

    // Build targeting content
    const targetingInput = allowTextTargeting && targeting
      ? `Targeting Description: ${targeting}\n`
      : "";

    const targetingConfigPrompt = allowTargetingConfig
      ? `Also include a section labeled "Suggested Targeting for ${platform}" with:
- Age range
- Gender
- Interests
- Location
Format your response as a bullet list. Tailor the structure for ${platform} based on how targeting is configured on that platform.`
      : "";

    const promptContent = `Product: ${product}
Audience: ${audience}
Unique Selling Point: ${usp}
Tone: ${tone}
Platform: ${platform}
${targetingInput}
${platformInstructions}
${targetingConfigPrompt}

Please output:
Headline:
Body:
Call to Action:
${allowTargetingConfig ? 'Suggested Targeting for ' + platform + ':' : ''}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional ad copywriter creating high-converting ads tailored to platform rules and audience targeting."
        },
        {
          role: "user",
          content: promptContent,
        },
      ],
      temperature: 0.7,
    });

    if (!response) {
      console.error('OpenAI API error: No response received');
      return res.status(500).json({ error: 'Failed to generate ad copy', openai: 'No response received' });
    }

    let result;
    try {
      // Extract the content from the response
      const content = response.choices[0].message.content;
      
      // Parse the content into sections
      const sections = content.split('\n\n');
      result = {
        headline: sections.find(s => s.startsWith('Headline:'))?.replace('Headline:', '').trim() || '',
        body: sections.find(s => s.startsWith('Body:'))?.replace('Body:', '').trim() || '',
        callToAction: sections.find(s => s.startsWith('Call to Action:'))?.replace('Call to Action:', '').trim() || '',
        targeting: sections.find(s => s.startsWith('Suggested Targeting for'))?.replace(/Suggested Targeting for .*:/, '').trim() || ''
      };
    } catch (e) {
      console.error('OpenAI response parse error:', e);
      return res.status(500).json({ error: 'Invalid response format from AI', openai: response });
    }

    // Save the generated ad copy
    await prisma.adCopy.create({
      data: {
        content: JSON.stringify(result),
        userId: userId,
      },
    });

    await incrementAdCount(userId);

    return res.status(200).json(result);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error while generating ad copy." });
  }
} 