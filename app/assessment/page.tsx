'use client'
import { useState } from 'react'
import Link from 'next/link'

type Screen = 'intro' | 'questions' | 'phraseGate' | 'age' | 'teaser' | 'payment' | 'success'

const QUESTIONS = [
  { id: 1, axis: 'Spatial', text: 'When you walk into a new space, what do you notice first?', options: ['The layout and how people move through it', 'The people and their expressions', 'The vibe or energy of the room', 'The details — textures, lighting, objects'] },
  { id: 2, axis: 'Temporal', text: 'When planning something important, you naturally…', options: ['Build a detailed timeline and work backward from the deadline', 'Focus on the next immediate step and adjust as you go', 'Think about the big vision first, then figure out the steps', 'Go with what feels right in the moment'] },
  { id: 3, axis: 'Reference', text: 'When you need to make a difficult decision, you primarily…', options: ['Research what experts or data say', 'Ask people you trust and respect', 'Trust your gut and past experience', 'Think about what aligns with your values'] },
  { id: 4, axis: 'Spatial', text: 'In a meeting, you tend to…', options: ['Mentally map where everyone stands on the issue', 'Watch for emotional undercurrents', 'Focus on the big picture being discussed', 'Take detailed notes on specifics'] },
  { id: 5, axis: 'Temporal', text: 'Your relationship with deadlines is…', options: ['I set my own earlier ones to stay ahead', 'Deadlines sharpen my focus at the last minute', 'I prefer open-ended timelines', 'I work in bursts of deep focus'] },
  { id: 6, axis: 'Reference', text: 'When someone challenges your view, you…', options: ['Look for evidence to support or revise your position', 'Consider how the person relates to you', 'Go back to your core principles', 'Feel it out — does their argument resonate?'] },
  { id: 7, axis: 'Spatial', text: 'Your workspace is usually…', options: ['Organized by function — everything has a place', 'Personalized with meaningful objects', 'Minimal — distractions are the enemy', 'Creative chaos that only makes sense to you'] },
  { id: 8, axis: 'Temporal', text: 'You learn best when…', options: ['There is a clear structure and sequence', 'You can explore freely and connect ideas', 'You dive in and learn by doing', 'Someone walks you through it step by step'] },
  { id: 9, axis: 'Reference', text: 'You feel most confident when you…', options: ['Have data or research backing you up', 'Have the support of people you respect', 'Are following your own instincts', 'Know your actions align with your values'] },
  { id: 10, axis: 'Spatial', text: 'When giving directions, you…', options: ['Use landmarks and visual cues', 'Give turn-by-turn street instructions', 'Draw or sketch a map', 'Describe how it feels to navigate the route'] },
  { id: 11, axis: 'Temporal', text: 'You handle unexpected changes best by…', options: ['Quickly restructuring your plan', 'Staying calm and pivoting in the moment', 'Needing time to process before moving forward', 'Reframing the change as a new opportunity'] },
  { id: 12, axis: 'Reference', text: 'When evaluating a new idea, you ask…', options: ['What does the research say?', 'What do people I respect think?', 'What does my experience tell me?', 'Does this feel right?'] },
  { id: 13, axis: 'Spatial', text: 'In a group project, you naturally take the role of…', options: ['Organizer — I map out who does what', 'Connector — I keep everyone aligned', 'Visionary — I see where we should go', 'Executor — I make sure things get done'] },
  { id: 14, axis: 'Temporal', text: 'Your energy across a day tends to be…', options: ['Consistent — I pace myself deliberately', 'Front-loaded — I am sharpest in the morning', 'Back-loaded — I hit my stride later', 'Irregular — it depends on what excites me'] },
  { id: 15, axis: 'Reference', text: 'When you reflect on a past decision, you judge it by…', options: ['Whether the outcome matched the data available', 'Whether the people affected were okay with it', 'Whether it felt right at the time', 'Whether it aligned with who you are'] },
]

const PROFILES: Record<string, { name: string; phrase: string; overview: string; strength: string; learn: string; secret: string }> = {
  STR: { name: 'Architect', phrase: 'You build mental blueprints before anyone else has even read the brief.', overview: 'You process the world through structure, sequence, and precedent — a rare combination that lets you design systems that actually hold up under pressure.', strength: 'You can hold the full map in your head while executing the next step with precision.', learn: 'Your challenge is releasing control when collaboration requires ambiguity.', secret: 'You already know the answer — you just want the data to confirm it.' },
  STr: { name: 'Strategist', phrase: 'You see three moves ahead while others are still reading the board.', overview: 'Spatial clarity meets temporal discipline in a way that makes you exceptional at long-horizon planning and execution.', strength: 'You turn vision into timelines without losing the bigger picture.', learn: 'You can underweight human factors when optimizing for outcomes.', secret: 'You work best alone, even when you pretend otherwise.' },
  StR: { name: 'Surveyor', phrase: 'You understand space before you understand people in it.', overview: 'You read environments and validate decisions through experience and values — a grounded, perceptive combination.', strength: 'You notice what others miss and act from a stable internal compass.', learn: 'Temporal planning feels like a cage — but it can be a tool.', secret: 'You trust your instincts more than you admit.' },
  Str: { name: 'Pioneer', phrase: 'You move first and map the territory as you go.', overview: 'Spatial awareness combined with spontaneity and self-reliance makes you a natural trailblazer.', strength: 'You navigate uncertainty without freezing — and you bring others with you.', learn: 'The cost of moving fast is sometimes leaving people behind.', secret: 'You are more afraid of stagnation than failure.' },
  sTR: { name: 'Counselor', phrase: 'You hold the room together without anyone knowing you are doing it.', overview: 'Temporal consistency and external reference make you the person others anchor to in turbulent moments.', strength: 'You know when to listen, when to validate, and when to redirect.', learn: 'You sometimes defer when your own instincts are wiser.', secret: 'You need more solitude than you let on.' },
  sTr: { name: 'Catalyst', phrase: 'You change the energy in a room the moment you enter it.', overview: 'You move quickly, trust people, and pull action out of inertia — a rare kind of social momentum.', strength: 'You make things happen by making people feel seen.', learn: 'Not every fire needs to be lit by you.', secret: 'You are more sensitive to rejection than your confidence suggests.' },
  stR: { name: 'Anchor', phrase: 'People return to you because you are always where you said you would be.', overview: 'Grounded in values and validated by experience, you offer others the rare gift of reliable presence.', strength: 'You are steady in chaos without being rigid.', learn: 'Your resistance to change is sometimes wisdom — and sometimes fear.', secret: 'The things you say you do not care about are the ones that matter most.' },
  str: { name: 'Wanderer', phrase: 'You have always known that the map is not the territory.', overview: 'You move by feel, trust yourself above all else, and resist systems that flatten nuance.', strength: 'You find connections no one else sees because you are not constrained by their frameworks.', learn: 'Commitment is not the enemy of freedom.', secret: 'You know exactly what you want — you just do not say it.' },
}

function computeProfile(answers: Record<number, number>) {
  const axes: Record<string, number[]> = { Spatial: [1,4,7,10,13], Temporal: [2,5,8,11,14], Reference: [3,6,9,12,15] }
  const scores: Record<string, number> = {}
  for (const [axis, ids] of Object.entries(axes)) {
    scores[axis] = ids.reduce((sum, id) => sum + (answers[id] !== undefined ? 4 - answers[id] : 0), 0)
  }
  const code = (scores.Spatial >= 15 ? 'S' : 's') + (scores.Temporal >= 15 ? 'T' : 't') + (scores.Reference >= 15 ? 'R' : 'r')
  return { ...PROFILES[code], code }
}

function calibrationPhrase(answers: Record<number, number>) {
  const spatialAns = answers[1]
  if (spatialAns === 0) return 'You see the whole room before anyone speaks.'
  if (spatialAns === 1) return 'You read people faster than you read rooms.'
  if (spatialAns === 2) return 'You sense the energy of a space before you map it.'
  return 'You notice what others walk past.'
}

const bg = '#FAF7F0'
const accent = '#9A7B2E'
const displayFont = "'Cormorant Garamond', Georgia, serif"
const uiFont = "'Plus Jakarta Sans', sans-serif"
const card: React.CSSProperties = { background: '#FFFDF9', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 18, padding: 32, maxWidth: 560, width: '100%', margin: '0 auto' }
const primaryBtn: React.CSSProperties = { background: 'linear-gradient(180deg,#B8922A,#9A7B2E)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: uiFont, fontSize: 15 }
const secondaryBtn: React.CSSProperties = { background: '#F2ECE0', color: '#1E1813', border: '1px solid rgba(60,45,25,0.12)', borderRadius: 12, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: uiFont, fontSize: 14 }
const wrap: React.CSSProperties = { minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: uiFont }

export default function AssessmentPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [lifeStage, setLifeStage] = useState<'young' | 'established' | null>(null)
  const [profile, setProfile] = useState<ReturnType<typeof computeProfile> | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredOpt, setHoveredOpt] = useState<number | null>(null)

  const q = QUESTIONS[currentQ]

  function handleAnswer(optIdx: number) {
    const newAnswers = { ...answers, [q.id]: optIdx }
    setAnswers(newAnswers)
    if (currentQ === 2) {
      setTimeout(() => setScreen('phraseGate'), 200)
      return
    }
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => { setCurrentQ(currentQ + 1); setHoveredOpt(null) }, 200)
    } else {
      const p = computeProfile(newAnswers)
      setProfile(p)
      setScreen('age')
    }
  }

  function continueFromPhrase() {
    setCurrentQ(3)
    setHoveredOpt(null)
    setScreen('questions')
  }

  function handleAge(stage: 'young' | 'established') {
    setLifeStage(stage)
    const p = computeProfile(answers)
    setProfile(p)
    if (Object.keys(answers).length < 15) {
      setCurrentQ(3)
      setScreen('questions')
    } else {
      setScreen('teaser')
    }
  }

  async function handleUnlock() {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileName: profile?.name, lifeStage }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  if (screen === 'intro') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>The Parser</div>
        <h1 style={{ fontFamily: displayFont, fontSize: 42, fontWeight: 600, color: '#1E1813', margin: '0 0 16px', lineHeight: 1.15 }}>Discover How You<br />Parse the World</h1>
        <p style={{ color: '#5C4A30', fontSize: 16, lineHeight: 1.7, margin: '0 0 32px' }}>15 questions. No right answers. A profile built on how you actually think — not how you wish you did.</p>
        <button style={primaryBtn} onClick={() => setScreen('questions')}>Begin Assessment</button>
        <p style={{ color: '#9A8A70', fontSize: 12, marginTop: 16 }}>Takes about 4 minutes</p>
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
              <span style={{ fontSize: 12, color: '#9A8A70', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{q.axis}</span>
              <span style={{ fontSize: 12, color: '#9A8A70' }}>{currentQ + 1} / {QUESTIONS.length}</span>
            </div>
            <h2 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 600, color: '#1E1813', margin: '0 0 28px', lineHeight: 1.3 }}>{q.text}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i
                const hovered = hoveredOpt === i
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
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
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'phraseGate') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(154,123,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 22 }}>◈</div>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 12 }}>Early Signal</div>
        <h2 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 500, color: '#1E1813', margin: '0 0 20px', lineHeight: 1.35, fontStyle: 'italic' }}>"{calibrationPhrase(answers)}"</h2>
        <p style={{ color: '#5C4A30', fontSize: 15, lineHeight: 1.7, margin: '0 0 32px' }}>Your first three answers reveal a pattern. Complete the remaining 12 questions to unlock your full Parser profile.</p>
        <button style={primaryBtn} onClick={continueFromPhrase}>Continue Assessment →</button>
      </div>
    </div>
  )

  if (screen === 'age') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>One Last Thing</div>
        <h2 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: '#1E1813', margin: '0 0 12px' }}>Which stage of life are you in?</h2>
        <p style={{ color: '#5C4A30', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px' }}>Your profile is calibrated differently depending on where you are in life.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ ...secondaryBtn, minWidth: 180 }} onClick={() => handleAge('young')}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Young Adult</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Ages 18 – 29</div>
          </button>
          <button style={{ ...secondaryBtn, minWidth: 180 }} onClick={() => handleAge('established')}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Adult</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Ages 30+</div>
          </button>
        </div>
      </div>
    </div>
  )

  if (screen === 'teaser' && profile) return (
    <div style={wrap}>
      <div style={{ maxWidth: 580, width: '100%', margin: '0 auto' }}>
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 10 }}>Your Parser Profile</div>
          <h1 style={{ fontFamily: displayFont, fontSize: 48, fontWeight: 700, color: '#1E1813', margin: '0 0 12px' }}>The {profile.name}</h1>
          <p style={{ color: '#5C4A30', fontSize: 16, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{profile.phrase}</p>
        </div>
        {[
          { label: 'Overview', content: profile.overview },
          { label: 'Core Strength', content: profile.strength },
          { label: 'What You\'re Learning', content: '████████████████████████████', blur: true },
          { label: 'Your Hidden Pattern', content: '████████████████████████████', blur: true },
        ].map(({ label, content, blur }) => (
          <div key={label} style={{ ...card, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
            {blur && <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(6px)', background: 'rgba(250,247,240,0.6)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
              <span style={{ fontSize: 20 }}>🔒</span>
            </div>}
            <div style={{ fontFamily: displayFont, fontSize: 11, letterSpacing: 2, color: accent, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <p style={{ color: '#3C2D19', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{content}</p>
          </div>
        ))}
        <div style={{ ...card, background: 'linear-gradient(135deg,#FFF8E8,#FAF0D0)', textAlign: 'center', marginTop: 8 }}>
          <h3 style={{ fontFamily: displayFont, fontSize: 24, color: '#1E1813', margin: '0 0 10px' }}>Unlock Your Full Profile</h3>
          <p style={{ color: '#5C4A30', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>Get your complete Parser report — all 8 sections, your compatibility map, and your decision-making signature.</p>
          <button style={{ ...primaryBtn, fontSize: 16, padding: '15px 36px' }} onClick={() => setScreen('payment')}>Unlock Full Profile — $19</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'payment') return (
    <div style={wrap}>
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 16 }}>Secure Checkout</div>
        <h2 style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: '#1E1813', margin: '0 0 12px' }}>Unlock The {profile?.name}</h2>
        <p style={{ color: '#5C4A30', fontSize: 15, lineHeight: 1.6, margin: '0 0 28px' }}>One payment. Lifetime access to your full Parser profile report.</p>
        <div style={{ background: '#F2ECE0', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          {['Complete 8-section profile report', 'Decision-making signature analysis', 'Compatibility and friction map', 'Your cognitive edge in work and life'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14, color: '#3C2D19' }}>
              <span style={{ color: accent, fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
        <button style={{ ...primaryBtn, fontSize: 16, padding: '15px 40px', width: '100%', opacity: loading ? 0.7 : 1 }} onClick={handleUnlock} disabled={loading}>
          {loading ? 'Redirecting to Stripe…' : 'Pay $19 — Unlock Now'}
        </button>
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
