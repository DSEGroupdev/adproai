import prisma from "../../lib/prisma";
import { checkAdGenerationLimit, incrementAdCount } from "../../lib/adLimit";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, product, audience, usp, tone, platform } = req.body;

  if (!userId || !product) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the user's email from Clerk
    const { sessionClaims } = getAuth(req);
    const userEmail = sessionClaims?.email;

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

    // Compose the prompt for OpenAI
    const prompt = `Product: ${product}\nAudience: ${audience || ''}\nUSP: ${usp || ''}\nTone: ${tone || ''}\nPlatform: ${platform || ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter specializing in creating high-converting ad copy. Generate ad copy in JSON format with the following structure: { "headline": "string", "body": "string", "callToAction": "string" }'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({ error: 'Failed to generate ad copy', openai: errorText });
    }

    const data = await response.json();
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('OpenAI response parse error:', data);
      return res.status(500).json({ error: 'Invalid response format from AI', openai: data });
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
    console.error("API Error:", error.response?.data || error.message || error);
    return res.status(500).json({ error: "Server error while generating ad copy." });
  }
} 