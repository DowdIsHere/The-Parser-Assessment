import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ authenticated: false })
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email, firstName: user.firstName },
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
