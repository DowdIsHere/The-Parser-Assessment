import Link from 'next/link'

export const metadata = {
  title: 'Parser Frame™ — Discover How You Parse the World',
  description: 'Every mind filters the world differently. Discover your Parser in three questions.',
}

const ENTRY_POINTS = [
  { href: '/parsers', label: 'The 27 Parsers', blurb: 'Browse every cognitive archetype and find the one that reads like you.' },
  { href: '/individual', label: 'Individual', blurb: 'Your full Parser profile — how you see, decide, and move through the world.' },
  { href: '/couples', label: 'Couples', blurb: 'Two filters, one relationship. See where you converge and where you collide.' },
  { href: '/parents', label: 'Parents', blurb: "Understand how your child's mind naturally works — ages 7–17." },
]

export default function LandingPage() {
  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">Parser Frame™ · by J.D. Mercer</p>
          <h1 className="mkt-h1">Discover How You<br />Parse the World</h1>
          <p className="mkt-lead">
            Your mind filters reality before you ever think a thought — what you notice, when you live,
            who you center. Three questions begin to reveal that filter. No account required to start.
          </p>
          <div className="mkt-hero-actions">
            <Link href="/assessment" className="btn btn-primary">Take the Assessment — 3 Questions</Link>
            <Link href="/parsers" className="btn btn-secondary">Explore the 27 Parsers</Link>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {ENTRY_POINTS.map((e) => (
              <Link key={e.href} href={e.href} className="parser-index-card" style={{ display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: '26px', textDecoration: 'none', transition: 'border-color .2s, box-shadow .2s, transform .2s' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{e.label}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{e.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="mkt-section-inner">
          <h2 className="mkt-h2">Already have an account?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Sign in to reach your profile, your people, and the rest of the Parser community.
          </p>
          <Link href="/login" className="btn btn-secondary">Sign in</Link>
        </div>
      </section>
    </main>
  )
}
