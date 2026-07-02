import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const groups = await prisma.group.findMany({
    where: { OR: [{ isPrivate: false }, { members: { some: { userId: user.id } } }] },
    include: { _count: { select: { members: true } }, members: { where: { userId: user.id }, select: { role: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ groups })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { name, description, isPrivate } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

  const group = await prisma.group.create({
    data: {
      name: name.slice(0, 100),
      description: description?.slice(0, 500) || null,
      isPrivate: !!isPrivate,
      members: { create: { userId: user.id, role: 'admin' } },
    },
  })
  return NextResponse.json({ group }, { status: 201 })
}
