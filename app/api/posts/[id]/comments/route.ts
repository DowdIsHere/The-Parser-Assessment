import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: 'asc' },
    include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } } },
  })
  return NextResponse.json({ comments })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content is required.' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: { content: content.slice(0, 1000), postId: params.id, authorId: user.id },
    include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } } },
  })
  return NextResponse.json({ comment }, { status: 201 })
}
