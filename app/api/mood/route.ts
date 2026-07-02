import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const checkins = await prisma.moodCheckin.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  return NextResponse.json({ checkins })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { mood, note } = await req.json()
  if (typeof mood !== 'number' || mood < 1 || mood > 10) {
    return NextResponse.json({ error: 'Mood must be 1–10.' }, { status: 400 })
  }

  const checkin = await prisma.moodCheckin.create({
    data: { userId: user.id, mood, note: note?.slice(0, 500) || null },
  })
  return NextResponse.json({ checkin }, { status: 201 })
}
