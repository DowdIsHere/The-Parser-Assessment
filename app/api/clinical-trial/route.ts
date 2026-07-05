import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public clinical-trial enrollment endpoint (no auth — practitioners apply
// before having an account). Stores the application for manual review.
export async function POST(req: NextRequest) {
  try {
    const { name, credentials, email, practiceType, message } = await req.json()

    if (!name?.trim() || !credentials?.trim() || !email?.trim() || !practiceType?.trim()) {
      return NextResponse.json({ ok: false, error: 'Name, credentials, email, and practice type are required.' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }

    await prisma.clinicalTrialSignup.create({
      data: {
        name: name.trim().slice(0, 200),
        credentials: credentials.trim().slice(0, 200),
        email: email.trim().toLowerCase().slice(0, 200),
        practiceType: practiceType.trim().slice(0, 100),
        message: (message || '').trim().slice(0, 2000) || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[clinical-trial]', err)
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
