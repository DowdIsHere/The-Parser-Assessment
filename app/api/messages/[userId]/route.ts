import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: params.userId },
        { senderId: params.userId, receiverId: user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  })

  await prisma.message.updateMany({
    where: { senderId: params.userId, receiverId: user.id, read: false },
    data: { read: true },
  })

  return NextResponse.json({ messages })
}
