import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const connections = await prisma.connection.findMany({
    where: { OR: [{ userId: user.id }, { connectedId: user.id }] },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } },
      connected: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } },
    },
  })
  return NextResponse.json({ connections })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { connectedId } = await req.json()
  if (!connectedId) return NextResponse.json({ error: 'connectedId required.' }, { status: 400 })

  const conn = await prisma.connection.upsert({
    where: { userId_connectedId: { userId: user.id, connectedId } },
    create: { userId: user.id, connectedId, status: 'pending' },
    update: { status: 'pending' },
  })
  return NextResponse.json({ connection: conn }, { status: 201 })
}
