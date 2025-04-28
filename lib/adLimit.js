import prisma from './prisma'

export async function checkAdGenerationLimit(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) throw new Error("User not found.")

  const limits = {
    FREE: 5,
    PRO: 50,
  }

  const limit = limits[user.plan]
  if (user.adsGenerated >= limit) {
    throw new Error("You have reached your monthly ad generation limit. Please upgrade your plan.")
  }
}

export async function incrementAdCount(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      adsGenerated: {
        increment: 1,
      },
    },
  })
} 