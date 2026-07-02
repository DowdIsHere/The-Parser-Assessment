import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor') ?? undefined
  const take = 20

  const posts = await prisma.post.findMany({
    where: { groupId: null },
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { userId: user.id }, select: { id: true } },
    },
  })

  const hasMore = posts.length > take
  if (hasMore) posts.pop()

  return NextResponse.json({ posts, nextCursor: hasMore ? posts[posts.length - 1].id : null })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { content, imageUrl } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content is required.' }, { status: 400 })

  const post = await prisma.post.create({
    data: { content: content.slice(0, 2000), imageUrl: imageUrl || null, authorId: user.id },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, parserName: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
