import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 })
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        parserName: user.parserName,
        parserCode: user.parserCode,
        spatialAxis: user.spatialAxis,
        temporalAxis: user.temporalAxis,
        referenceAxis: user.referenceAxis,
        lifeStage: user.lifeStage,
        assessmentType: user.assessmentType,
        onboardingComplete: user.onboardingComplete,
      },
    })
  } catch (err) {
    console.error('[me]', err)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
