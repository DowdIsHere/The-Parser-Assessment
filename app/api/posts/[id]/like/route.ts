import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    await prisma.like.create({ data: { userId: user.id, postId: params.id } })
    return NextResponse.json({ liked: true })
  } catch {
    await prisma.like.delete({ where: { userId_postId: { userId: user.id, postId: params.id } } })
    return NextResponse.json({ liked: false })
  }
}
