import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionUser } from '@/lib/session'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  const user = await getSessionUser()

  const { profileName, lifeStage } = await req.json()
  const origin = req.headers.get('origin') || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Parser Profile™ — Full Analysis',
            description: profileName ? `${profileName} (${lifeStage || 'adult'})` : 'Full Parser Profile Report',
          },
          unit_amount: 2900,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/assessment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/assessment`,
    metadata: {
      userId: user?.id || '',
      profileName: profileName || '',
      lifeStage: lifeStage || 'established',
    },
  })

  return NextResponse.json({ url: session.url })
}
