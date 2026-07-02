'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export default function CouplesPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'signedout' | 'signedin'>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name1: '', email1: '', name2: '', email2: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) {
          setUser(d.user)
          setForm(f => ({ ...f, name1: `${d.user.firstName} ${d.user.lastName}`.trim(), email1: d.user.email }))
          setStatus('signedin')
        } else {
          setStatus('signedout')
        }
      })
      .catch(() => setStatus('signedout'))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name1 || !form.email1 || !form.name2 || !form.email2) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/couples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">Couples Analysis</p>
          <h1 className="mkt-h1">Two Filters.<br />One Relationship.</h1>
          <p className="mkt-lead">
            Understand the cognitive collision between you and your partner —
            where your filters diverge, and how to work with that gap rather than against it.
          </p>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner" style={{ maxWidth: '560px' }}>

          {status === 'loading' && (
            <div className="skel-block" style={{ height: '200px', borderRadius: 'var(--r-panel)' }} />
          )}

          {status === 'signedout' && (
            <div className="auth-card" style={{ textAlign: 'center' }}>
              <h2 className="auth-title" style={{ marginBottom: '12px' }}>Request a Couples Analysis</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.95rem' }}>
                Create an account or sign in to submit your couples analysis request.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign Up
                </Link>
                <Link href="/login?next=/couples" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {status === 'signedin' && !submitted && (
            <div className="auth-card">
              <h2 className="auth-title">Couples Analysis Request</h2>
              {error && <div className="auth-error">{error}</div>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={form.name1}
                    onChange={e => setForm(f => ({ ...f, name1: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Your Email</label>
                  <input type="email" value={form.email1} readOnly style={{ opacity: 0.7 }} />
                </div>
                <div className="auth-field">
                  <label>Partner's Name</label>
                  <input
                    type="text"
                    value={form.name2}
                    onChange={e => setForm(f => ({ ...f, name2: e.target.value }))}
                    placeholder="Partner's full name"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Partner's Email</label>
                  <input
                    type="email"
                    value={form.email2}
                    onChange={e => setForm(f => ({ ...f, email2: e.target.value }))}
                    placeholder="partner@example.com"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Anything you'd like us to know…"
                    rows={3}
                    style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '12px 15px', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', resize: 'vertical', width: '100%' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </form>
            </div>
          )}

          {status === 'signedin' && submitted && (
            <div className="auth-card auth-success" style={{ textAlign: 'center' }}>
              <div className="tick">✓</div>
              <h2 className="auth-title">Request Received</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                We'll reach out to both of you within 3–5 business days.
              </p>
              <Link href="/home" className="btn btn-primary">Go to My Profile</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
