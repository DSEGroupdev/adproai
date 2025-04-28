import prisma from "../../lib/prisma";
import { checkAdGenerationLimit, incrementAdCount } from "../../lib/adLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId, product, audience, usp, tone, platform } = req.body;

    // Only require userId and product
    if (!userId || !product) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await checkAdGenerationLimit(userId);

    // Generate ad copy (mock logic or call OpenAI)
    const generatedAd = `Generated Ad for ${product}` +
      (audience ? ` targeting ${audience}` : "") +
      (usp ? ` with ${usp}` : "") +
      (tone ? `, ${tone} tone` : "") +
      (platform ? ` on ${platform}` : "") + ".";

    await prisma.adCopy.create({
      data: {
        content: generatedAd,
        userId: userId,
      },
    });

    await incrementAdCount(userId);

    return res.status(200).json({ generatedAd });

  } catch (error) {
    console.error("Ad generation error:", error);
    return res.status(500).json({ error: error.message || "Server Error" });
  }
} 