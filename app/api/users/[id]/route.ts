import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, firstName: true, lastName: true, avatarUrl: true, bio: true, parserName: true, parserCode: true, spatialAxis: true, temporalAxis: true, referenceAxis: true, lifeStage: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  return NextResponse.json({ user })
}
