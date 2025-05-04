import { getAuth } from "@clerk/nextjs/server";
import prisma from '../../lib/prisma';

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
    let user = await prisma.user.findUnique({ where: { id: userId } });
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

    // Increment ads generated count
    user = await prisma.user.update({
      where: { id: userId },
      data: { adsGenerated: { increment: 1 } }
    });

    return res.status(200).json({ adsGenerated: user.adsGenerated });
  } catch (error) {
    console.error('Error tracking ad generation:', error);
    return res.status(500).json({ error: 'Failed to track ad generation' });
  }
} 