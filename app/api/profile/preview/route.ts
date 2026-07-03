import { NextRequest, NextResponse } from 'next/server'
import { getProfileData, LifeStage } from '@/lib/profiles'

// Public teaser endpoint: returns a preview slice of a parser profile for a
// given archetype name + life stage (used by the assessment teaser screens,
// before purchase). Only teaser-safe fields are returned.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''
  const stage = (searchParams.get('stage') || 'adult') as LifeStage

  const data = getProfileData(name, stage)
  if (!data) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })

  const firstSuperpower = Array.isArray(data.superpowers) ? data.superpowers[0] : null

  return NextResponse.json({
    preview: {
      name: data.name,
      code: data.code,
      ageStage: data.ageStage ?? stage,
      tagline: data.tagline ?? null,
      overview: data.overview ?? null,
      phrase: data.phrase ?? data.tagline ?? null,
      firstStrength: firstSuperpower ? { title: firstSuperpower.title, description: firstSuperpower.description } : null,
      superpowerCount: Array.isArray(data.superpowers) ? data.superpowers.length : 0,
      watchOutCount: Array.isArray(data.watchOuts) ? data.watchOuts.length : 0,
    },
  })
}
