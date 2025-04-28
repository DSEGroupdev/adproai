import prisma from "../../lib/prisma";
import { checkAdGenerationLimit, incrementAdCount } from "../../lib/adLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId, product, audience, usp, tone, platform } = req.body;

    if (!userId || !product) {
      return res.status(400).json({ error: "Missing required fields." });
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
      throw new Error('Failed to generate ad copy');
    }

    const data = await response.json();
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid response format from AI' });
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
    console.error("Ad generation error:", error);
    return res.status(500).json({ error: error.message || "Server Error" });
  }
} 