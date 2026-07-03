'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Screen = 'intro' | 'questions' | 'age' | 'teaser' | 'payment'

type Dimension = 'spatial' | 'temporal' | 'reference'

const QUESTIONS: { id: number; dimension: Dimension; text: string; options: { label: string; value: number }[] }[] = [
  { id: 1, dimension: 'spatial', text: "You're building something with LEGO. What do you do first?", options: [
    { label: 'Think about what cool thing I want to make', value: 5 },
    { label: 'Picture the finished thing, then start building', value: 4 },
    { label: "Sometimes I plan, sometimes I just start - it depends!", value: 3 },
    { label: 'Look at the pieces and start connecting them', value: 2 },
    { label: 'Follow the instructions step by step', value: 1 },
  ] },
  { id: 2, dimension: 'spatial', text: 'A friend asks for help with homework. What do you usually do?', options: [
    { label: 'Show them exactly how to do the problem', value: 1 },
    { label: 'Walk through the steps with some explanation', value: 2 },
    { label: 'A mix of showing and explaining - whatever they need!', value: 3 },
    { label: 'Explain why it works with some examples', value: 4 },
    { label: 'Help them understand the big idea behind it', value: 5 },
  ] },
  { id: 3, dimension: 'spatial', text: 'When you remember a fun day, what pops into your head first?', options: [
    { label: 'Exactly what I saw, heard, and ate', value: 1 },
    { label: 'Specific moments that happened', value: 2 },
    { label: 'Both the details and the feelings mixed together', value: 3 },
    { label: 'How awesome it felt overall', value: 4 },
    { label: 'The happy feeling and why it was special', value: 5 },
  ] },
  { id: 4, dimension: 'temporal', text: "You didn't do well on a test. What do you think about?", options: [
    { label: 'What I should have studied more', value: 1 },
    { label: 'What went wrong this time', value: 2 },
    { label: "Both what happened and what's next", value: 3 },
    { label: "How I'll do better next time", value: 4 },
    { label: 'My plan for the next test', value: 5 },
  ] },
  { id: 5, dimension: 'temporal', text: "You're planning your birthday party. What's most exciting?", options: [
    { label: 'Doing the same fun stuff that worked last year', value: 1 },
    { label: "Using ideas from parties I've loved before", value: 2 },
    { label: 'Mixing old favorites with new ideas', value: 3 },
    { label: 'Trying some new things with a few favorites', value: 4 },
    { label: 'Dreaming up something totally new and different!', value: 5 },
  ] },
  { id: 6, dimension: 'temporal', text: "In stories and movies, what's your favorite part?", options: [
    { label: "Learning about the characters' history and backstory", value: 1 },
    { label: 'Flashbacks that explain why things are the way they are', value: 2 },
    { label: "What's happening right now in the action", value: 3 },
    { label: 'Hints about what exciting things might happen next', value: 4 },
    { label: 'Imagining what will happen in the future or sequel!', value: 5 },
  ] },
  { id: 7, dimension: 'reference', text: "Your team wins a game! What's your first thought?", options: [
    { label: 'Everyone played so well together!', value: 1 },
    { label: 'The team did great, and I helped!', value: 2 },
    { label: 'We all worked hard and it paid off!', value: 3 },
    { label: 'I played well and so did my teammates!', value: 4 },
    { label: 'Yes! I did awesome!', value: 5 },
  ] },
  { id: 8, dimension: 'reference', text: "There's one slice of pizza left. What do you do?", options: [
    { label: "Grab it - I'm hungry!", value: 5 },
    { label: 'Take it but offer to share half', value: 4 },
    { label: 'Ask if anyone else wants it too', value: 3 },
    { label: 'Offer it to others first, but hope they say no', value: 2 },
    { label: 'Ask who else wants it - I can get food later', value: 1 },
  ] },
  { id: 9, dimension: 'reference', text: 'When picking what game to play with friends, what do you think about?', options: [
    { label: 'What game I want to play most', value: 5 },
    { label: "What I like, but I'll consider what others want", value: 4 },
    { label: 'Finding something everyone will enjoy', value: 3 },
    { label: "What my friends want, but I'll share my ideas", value: 2 },
    { label: 'What would make my friends happiest', value: 1 },
  ] },
]

const ARCHETYPES: Record<string, string> = {
  'high-high-high': 'Visionary', 'high-high-mid': 'Foresighted', 'high-high-low': 'Altruistic',
  'high-mid-high': 'Introspective', 'high-mid-mid': 'Mindful', 'high-mid-low': 'Intuitive',
  'high-low-high': 'Sentimental', 'high-low-mid': 'Reflective', 'high-low-low': 'Idealized',
  'mid-high-high': 'Actualized', 'mid-high-mid': 'Harmonious', 'mid-high-low': 'Collaborative',
  'mid-mid-high': 'Centered', 'mid-mid-mid': 'Equanimous', 'mid-mid-low': 'Empathetic',
  'mid-low-high': 'Integrated', 'mid-low-mid': 'Coherent', 'mid-low-low': 'Reconciled',
  'low-high-high': 'Intentional', 'low-high-mid': 'Resilient', 'low-high-low': 'Reliable',
  'low-mid-high': 'Embodied', 'low-mid-mid': 'Grounded', 'low-mid-low': 'Attuned',
  'low-low-high': 'Sharp', 'low-low-mid': 'Seasoned', 'low-low-low': 'Legacy',
}

function level(pct: number) { return pct < 33 ? 'low' : pct > 66 ? 'high' : 'mid' }

function computeArchetype(answers: Record<number, number>) {
  const dims: Record<Dimension, number[]> = {
    spatial: QUESTIONS.filter(q => q.dimension === 'spatial').map(q => q.id),
    temporal: QUESTIONS.filter(q => q.dimension === 'temporal').map(q => q.id),
    reference: QUESTIONS.filter(q => q.dimension === 'reference').map(q => q.id),
  }
  const levels: Record<Dimension, string> = { spatial: 'mid', temporal: 'mid', reference: 'mid' }
  for (const dim of Object.keys(dims) as Dimension[]) {
    const ids = dims[dim]
    const avg = ids.reduce((s, id) => s + (answers[id] ?? 3), 0) / ids.length
    const percent = ((avg - 1) / 4) * 100
    levels[dim] = level(percent)
  }
  const code = `${levels.spatial}-${levels.temporal}-${levels.reference}`
  return ARCHETYPES[code] || 'Equanimous'
}

const bg = '#FAF7F0'
const accent = '#9A7B2E'
const displayFont = "'Cormorant Garamond', Georgia, serif"
const uiFont = "'Plus Jakarta Sans', sans-serif"
const card: React.CSSProperties = { background: '#FFFDF9', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 18, padding: 32, maxWidth: 560, width: '100%', margin: '0 auto' }
const primaryBtn: React.CSSProperties = { background: 'linear-gradient(180deg,#B8922A,#9A7B2E)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: uiFont, fontSize: 15 }
const secondaryBtn: React.CSSProperties = { background: '#F2ECE0', color: '#1E1813', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 12, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: uiFont, fontSize: 14 }
const wrap: React.CSSProperties = { minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: uiFont }

export default function KidsAssessmentPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [bracket, setBracket] = useState<'7-12' | '13-17' | null>(null)
  const [archetype, setArchetype] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredOpt, setHoveredOpt] = useState<number | null>(null)

  // Auth gate for checkout
  const [signedIn, setSignedIn] = useState(false)
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const stage = bracket === '7-12' ? 'kids' : bracket === '13-17' ? 'teens' : 'kids'

  // Check whether the visitor is already signed in when they reach the pay page.
  useEffect(() => {
    if (screen !== 'payment') return
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setSignedIn(!!d.authenticated))
      .catch(() => setSignedIn(false))
  }, [screen])

  const q = QUESTIONS[currentQ]

  async function goToTeaser(finalAnswers: Record<number, number>, resolvedStage: string) {
    const arche = computeArchetype(finalAnswers)
    setArchetype(arche)
    setScreen('teaser')
    setLoading(true)
    try {
      const res = await fetch('/api/profile/preview?name=' + arche + '&stage=' + resolvedStage)
      const data = await res.json()
      setPreview(data.preview)
    } catch {
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(value: number) {
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    if (currentQ === 2) {
      setTimeout(() => { setScreen('age'); setHoveredOpt(null) }, 200)
      return
    }
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => { setCurrentQ(currentQ + 1); setHoveredOpt(null) }, 200)
    } else {
      goToTeaser(newAnswers, stage)
    }
  }

  function handleAge(value: '7-12' | '13-17') {
    setBracket(value)
    setCurrentQ(3)
    setHoveredOpt(null)
    setScreen('questions')
  }

  async function handleUnlock() {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileName: archetype, lifeStage: stage }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  // Create the account (which signs them in via the session cookie), then
  // continue straight to Stripe checkout.
  async function handleSignupAndPay(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    if (!suName.trim()) { setAuthError('Please enter the name to appear in your profile.'); return }
    if (suPassword.length < 8) { setAuthError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: suName.trim(), email: suEmail.trim(), password: suPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Could not create your account.')
        setLoading(false)
        return
      }
      setSignedIn(true)
      await handleUnlock()
    } catch {
      setAuthError('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (screen === 'intro') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>The Parser · Kids & Teens</div>
        <h1 style={{ fontFamily: displayFont, fontSize: 42, fontWeight: 600, color: '#1E1813', margin: '0 0 16px', lineHeight: 1.15 }}>Discover How You<br />See the World</h1>
        <p style={{ color: '#5C4A30', fontSize: 16, lineHeight: 1.7, margin: '0 0 32px' }}>9 fun questions. No right answers. Find out your amazing thinking superpower — the way you really think!</p>
        <button style={primaryBtn} onClick={() => setScreen('questions')}>Start the Quiz</button>
        <p style={{ color: '#9A8A70', fontSize: 12, marginTop: 16 }}>Takes about 3 minutes</p>
      </div>
    </div>
  )

  if (screen === 'questions') {
    const progress = (currentQ / QUESTIONS.length) * 100
    return (
      <div style={wrap}>
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 4, background: '#F2ECE0' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,#B8922A,#9A7B2E)`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: '#9A8A70', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{q.dimension}</span>
              <span style={{ fontSize: 12, color: '#9A8A70' }}>{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            <h2 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 600, color: '#1E1813', margin: '0 0 28px', lineHeight: 1.3 }}>{q.text}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === opt.value
                const hovered = hoveredOpt === i
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.value)}
                    onMouseEnter={() => setHoveredOpt(i)}
                    onMouseLeave={() => setHoveredOpt(null)}
                    style={{
                      background: selected ? 'rgba(154,123,46,0.08)' : hovered ? 'rgba(154,123,46,0.04)' : '#fff',
                      border: `1.5px solid ${selected ? accent : hovered ? 'rgba(154,123,46,0.4)' : 'rgba(60,45,25,0.12)'}`,
                      borderRadius: 12,
                      padding: '14px 18px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: selected ? '#7A5A1E' : '#2E2010',
                      fontFamily: uiFont,
                      fontSize: 14,
                      fontWeight: selected ? 600 : 400,
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected ? accent : 'rgba(60,45,25,0.2)'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? accent : 'transparent' }}>
                      {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'block' }} />}
                    </span>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'age') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>Quick Question</div>
        <h2 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: '#1E1813', margin: '0 0 12px' }}>How old are you?</h2>
        <p style={{ color: '#5C4A30', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px' }}>Your profile is written differently depending on your age.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ ...secondaryBtn, minWidth: 180 }} onClick={() => handleAge('7-12')}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Kids</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Ages 7 – 12</div>
          </button>
          <button style={{ ...secondaryBtn, minWidth: 180 }} onClick={() => handleAge('13-17')}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Teens</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Ages 13 – 17</div>
          </button>
        </div>
      </div>
    </div>
  )

  if (screen === 'teaser') {
    const growingLabel = stage === 'teens' ? 'Growing Up' : 'When You Grow Up'
    const overviewText: string = preview?.overview || ''
    const overviewParas = overviewText.split(/\n\n+/).slice(0, 2).join('\n\n')
    return (
      <div style={wrap}>
        <div style={{ maxWidth: 580, width: '100%', margin: '0 auto' }}>
          <div style={{ ...card, marginBottom: 20 }}>
            <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 10 }}>Your Thinking Superpower</div>
            <h1 style={{ fontFamily: displayFont, fontSize: 48, fontWeight: 700, color: '#1E1813', margin: '0 0 12px' }}>The {(preview?.name || archetype || '').toUpperCase()}</h1>
            {(preview?.tagline || preview?.phrase) && (
              <p style={{ color: '#5C4A30', fontSize: 16, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{preview?.tagline || preview?.phrase}</p>
            )}
          </div>
          {loading && !preview ? (
            <div style={{ ...card, textAlign: 'center', marginBottom: 12 }}>
              <p style={{ color: '#5C4A30', fontSize: 15, margin: 0 }}>Building your profile…</p>
            </div>
          ) : (
            <>
              {overviewParas && (
                <div style={{ ...card, marginBottom: 12 }}>
                  <div style={{ fontFamily: displayFont, fontSize: 11, letterSpacing: 2, color: accent, textTransform: 'uppercase', marginBottom: 8 }}>Overview</div>
                  {overviewParas.split(/\n\n+/).map((p, i) => (
                    <p key={i} style={{ color: '#3C2D19', fontSize: 15, lineHeight: 1.7, margin: i === 0 ? 0 : '12px 0 0' }}>{p}</p>
                  ))}
                </div>
              )}
              {preview?.firstStrength && (
                <div style={{ ...card, marginBottom: 12 }}>
                  <div style={{ fontFamily: displayFont, fontSize: 11, letterSpacing: 2, color: accent, textTransform: 'uppercase', marginBottom: 8 }}>Core Strength</div>
                  <h3 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 600, color: '#1E1813', margin: '0 0 8px' }}>{preview.firstStrength.title}</h3>
                  <p style={{ color: '#3C2D19', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{preview.firstStrength.description}</p>
                </div>
              )}
              <div style={{ ...card, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(6px)', background: 'rgba(250,247,240,0.6)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
                  <span style={{ fontSize: 20 }}>🔒</span>
                </div>
                <div style={{ fontFamily: displayFont, fontSize: 11, letterSpacing: 2, color: accent, textTransform: 'uppercase', marginBottom: 8 }}>More Superpowers & Watch-Outs</div>
                <p style={{ color: '#3C2D19', fontSize: 15, lineHeight: 1.7, margin: 0 }}>████████████████████████████</p>
                <p style={{ color: '#3C2D19', fontSize: 15, lineHeight: 1.7, margin: '10px 0 0' }}>████████████████ {growingLabel} ████████</p>
              </div>
            </>
          )}
          <div style={{ ...card, background: 'linear-gradient(135deg,#FFF8E8,#FAF0D0)', textAlign: 'center', marginTop: 8 }}>
            <h3 style={{ fontFamily: displayFont, fontSize: 24, color: '#1E1813', margin: '0 0 10px' }}>Unlock Your Full Profile</h3>
            <p style={{ color: '#5C4A30', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>Get all your superpowers, your watch-outs, and your "{growingLabel}" section — the whole picture of how you think.</p>
            <button style={{ ...primaryBtn, fontSize: 16, padding: '15px 36px' }} onClick={() => setScreen('payment')}>Unlock Full Profile — $19</button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'payment') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>Secure Checkout</div>
        <h2 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: '#1E1813', margin: '0 0 12px' }}>Unlock The {archetype}</h2>
        <p style={{ color: '#5C4A30', fontSize: 15, lineHeight: 1.6, margin: '0 0 28px' }}>One payment. Lifetime access to your full Parser profile report.</p>
        <div style={{ background: '#F2ECE0', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          {['Complete profile report', 'All your thinking superpowers', 'Your watch-outs and how to grow', 'Your "' + (stage === 'teens' ? 'Growing Up' : 'When You Grow Up') + '" section'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14, color: '#3C2D19' }}>
              <span style={{ color: accent, fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
        {signedIn ? (
          <button style={{ ...primaryBtn, fontSize: 16, padding: '15px 40px', width: '100%', opacity: loading ? 0.7 : 1 }} onClick={handleUnlock} disabled={loading}>
            {loading ? 'Redirecting to Stripe…' : 'Pay $19 — Unlock Now'}
          </button>
        ) : (
          <form onSubmit={handleSignupAndPay} style={{ textAlign: 'left' }}>
            <p style={{ color: '#5C4A30', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px', textAlign: 'center' }}>
              Create your account to save your profile and unlock the full report.
            </p>
            {authError && (
              <div style={{ background: '#FBEAEA', color: '#B3261E', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 14, textAlign: 'center' }}>{authError}</div>
            )}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3F35', marginBottom: 6 }}>The name to appear in your profile</label>
            <input type="text" value={suName} onChange={(e) => setSuName(e.target.value)} required placeholder="e.g. Jordan"
              style={{ width: '100%', background: '#F2ECE0', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 12, padding: '12px 15px', fontFamily: uiFont, fontSize: 14, marginBottom: 14 }} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3F35', marginBottom: 6 }}>Email</label>
            <input type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"
              style={{ width: '100%', background: '#F2ECE0', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 12, padding: '12px 15px', fontFamily: uiFont, fontSize: 14, marginBottom: 14 }} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3F35', marginBottom: 6 }}>Password <span style={{ color: '#9A8A70', fontWeight: 400 }}>(min 8 chars)</span></label>
            <input type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="••••••••"
              style={{ width: '100%', background: '#F2ECE0', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 12, padding: '12px 15px', fontFamily: uiFont, fontSize: 14, marginBottom: 18 }} />
            <button type="submit" style={{ ...primaryBtn, fontSize: 16, padding: '15px 40px', width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Setting up…' : 'Sign Up & Pay $19'}
            </button>
            <p style={{ color: '#9A8A70', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href={`/login?next=${encodeURIComponent('/kids-assessment')}`} style={{ color: accent, fontWeight: 600 }}>Sign in</Link>
            </p>
          </form>
        )}
        <p style={{ color: '#9A8A70', fontSize: 12, marginTop: 14 }}>Secure payment via Stripe · 30-day money-back guarantee</p>
        <button style={{ ...secondaryBtn, marginTop: 10 }} onClick={() => setScreen('teaser')}>← Back</button>
      </div>
    </div>
  )

  return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <h2 style={{ fontFamily: displayFont, fontSize: 32, color: '#1E1813', margin: '0 0 16px' }}>Something went wrong.</h2>
        <Link href="/" style={{ color: accent }}>Return home</Link>
      </div>
    </div>
  )
}
