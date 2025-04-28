import prisma from "../../lib/prisma";
import { checkAdGenerationLimit, incrementAdCount } from "../../lib/adLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, product, audience, usp, tone, platform } = req.body;

  if (!userId || !product) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: "placeholder@example.com", // Optional for now
          plan: "FREE",
          adsGenerated: 0,
        },
      });
    }

    await checkAdGenerationLimit(userId);

    const generatedAd = `Generated ad for ${product}${audience ? ' targeting ' + audience : ''}${usp ? ' with ' + usp : ''}${tone ? ' in a ' + tone + ' tone' : ''}${platform ? ' on ' + platform : ''}.`;

    await prisma.adCopy.create({
      data: {
        content: generatedAd,
        userId: userId,
      },
    });

    await incrementAdCount(userId);

    return res.status(200).json({ generatedAd });

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message || error);
    return res.status(500).json({ error: "Server error while generating ad copy." });
  }
} 