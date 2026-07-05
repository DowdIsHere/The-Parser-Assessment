import { NextResponse } from 'next/server'

// Lightweight liveness probe for the Railway healthcheck. Deliberately has NO
// dependencies on env vars, the database, or the session — it returns 200 as
// long as the Next.js server is up, so a missing DATABASE_URL/JWT_SECRET can't
// make the deploy fail its healthcheck.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ ok: true, status: 'healthy' })
}
