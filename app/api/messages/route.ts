import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  // Get latest message per conversation partner
  const sent = await prisma.message.findMany({
    where: { senderId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { receiver: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } } },
  })
  const received = await prisma.message.findMany({
    where: { receiverId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } } },
  })

  return NextResponse.json({ sent, received })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { receiverId, content } = await req.json()
  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: 'receiverId and content are required.' }, { status: 400 })
  }

  const msg = await prisma.message.create({
    data: { senderId: user.id, receiverId, content: content.slice(0, 2000) },
  })
  return NextResponse.json({ message: msg }, { status: 201 })
}
