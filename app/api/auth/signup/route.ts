import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()
    if (!email || !password || !firstName) {
      return NextResponse.json({ success: false, error: 'Email, password, and first name are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with that email already exists.' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hash,
        firstName: firstName.trim(),
        lastName: (lastName || '').trim(),
      },
    })

    createSession(user.id)
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, firstName: user.firstName, onboardingComplete: false },
    })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
