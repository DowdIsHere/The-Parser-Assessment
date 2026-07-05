import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })

  const { name1, email1, name2, email2, notes } = await req.json()
  if (!name1 || !email1 || !name2 || !email2) {
    return NextResponse.json({ ok: false, error: 'All required fields must be filled.' }, { status: 400 })
  }

  await prisma.couplesRequest.create({
    data: { userId: user.id, name1, email1, name2, email2, notes: notes || '' },
  })

  return NextResponse.json({ ok: true })
}
