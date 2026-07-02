import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { MAX_LENGTHS } from '@/lib/validation'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const body = await req.json()
  const allowed = ['firstName', 'lastName', 'bio', 'avatarUrl', 'parserName', 'parserCode',
    'spatialAxis', 'temporalAxis', 'referenceAxis', 'lifeStage', 'assessmentType', 'onboardingComplete']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {
      if (typeof body[key] === 'string' && MAX_LENGTHS[key as keyof typeof MAX_LENGTHS]) {
        data[key] = body[key].slice(0, MAX_LENGTHS[key as keyof typeof MAX_LENGTHS])
      } else {
        data[key] = body[key]
      }
    }
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data })
  return NextResponse.json({ success: true, user: updated })
}
