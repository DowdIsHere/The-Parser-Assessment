'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LifeStage = 'established-adult' | 'young-adult' | 'younger' | ''

const LIFE_STAGES: { value: LifeStage; label: string; description: string }[] = [
  {
    value: 'established-adult',
    label: 'Established Adult',
    description: 'You have life experience and a settled sense of self.',
  },
  {
    value: 'young-adult',
    label: 'Young Adult (18–25)',
    description: 'You\'re building your identity and exploring your path.',
  },
  {
    value: 'younger',
    label: 'Younger (under 18)',
    description: 'You\'re developing your perspectives and discovering yourself.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [lifeStage, setLifeStage] = useState<LifeStage>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function completeOnboarding() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingComplete: true }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      router.push('/home')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">
        Parser <span style={{ color: 'var(--accent)' }}>Frame™</span>
      </div>
      <div className="auth-logo-sub">by J.D. Mercer</div>

      {step === 1 && (
        <>
          <h1 className="auth-title">Welcome — let's get started</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
            Which best describes your life stage?
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {LIFE_STAGES.map((stage) => (
              <label
                key={stage.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 16px',
                  border: `1.5px solid ${lifeStage === stage.value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-card)',
                  background: lifeStage === stage.value ? 'var(--accent-soft)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <input
                  type="radio"
                  name="lifeStage"
                  value={stage.value}
                  checked={lifeStage === stage.value}
                  onChange={() => setLifeStage(stage.value)}
                  style={{ marginTop: '3px', accentColor: 'var(--accent)' }}
                />
                <span>
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {stage.label}
                  </span>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                    {stage.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <button
            className="btn btn-primary auth-submit"
            disabled={!lifeStage}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="auth-title">Ready to discover your parser type?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
            The Parser Assessment takes about 10 minutes and reveals how you naturally process and interpret the world.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/assessment" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Take the Assessment
            </Link>

            <button
              className="btn btn-secondary auth-submit"
              onClick={completeOnboarding}
              disabled={loading}
              style={{ marginTop: 0 }}
            >
              {loading ? 'Saving…' : 'Skip for now'}
            </button>
          </div>

          <p className="auth-switch" style={{ marginTop: '16px' }}>
            <button
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
            >
              ← Back
            </button>
          </p>
        </>
      )}
    </div>
  )
}
