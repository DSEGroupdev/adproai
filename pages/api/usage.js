import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Get or create user's usage record
      let usage = await prisma.usage.findUnique({
        where: { userId },
      });

      if (!usage) {
        usage = await prisma.usage.create({
          data: {
            userId,
            adsGenerated: 0,
            lastReset: new Date(),
          },
        });
      }

      // Check if we need to reset the count (new month)
      const now = new Date();
      const lastReset = new Date(usage.lastReset);
      if (
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      ) {
        usage = await prisma.usage.update({
          where: { userId },
          data: {
            adsGenerated: 0,
            lastReset: now,
          },
        });
      }

      res.status(200).json({ adsGenerated: usage.adsGenerated });
    } catch (error) {
      console.error('Error fetching usage:', error);
      res.status(500).json({ message: 'Error fetching usage data' });
    }
  } else if (req.method === 'POST') {
    try {
      // Increment the ad count
      const usage = await prisma.usage.upsert({
        where: { userId },
        update: {
          adsGenerated: {
            increment: 1,
          },
        },
        create: {
          userId,
          adsGenerated: 1,
          lastReset: new Date(),
        },
      });

      res.status(200).json({ adsGenerated: usage.adsGenerated });
    } catch (error) {
      console.error('Error updating usage:', error);
      res.status(500).json({ message: 'Error updating usage data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 