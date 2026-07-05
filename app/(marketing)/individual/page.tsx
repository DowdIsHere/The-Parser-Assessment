import Link from 'next/link'

export const metadata = { title: 'Individual Analysis | Parser Frame™' }

export default function IndividualPage() {
  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">Individual Analysis</p>
          <h1 className="mkt-h1">Your Parser Profile,<br />Fully Decoded</h1>
          <p className="mkt-lead">
            A deep-read of your cognitive filter — how you process space, time, and authority —
            delivered as a written analysis personal to you.
          </p>
          <div className="mkt-hero-actions">
            <Link href="/assessment" className="btn btn-primary">Take the Free Assessment</Link>
            <Link href="/collisions" className="btn btn-secondary">See Collision Patterns</Link>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner mkt-pricing-card">
          <p className="mkt-eyebrow">Individual Report</p>
          <h2 className="mkt-h2">Full Parser Analysis</h2>
          <div className="price-row">
            <span className="price-main">$29</span>
            <span className="price-was">$49</span>
          </div>
          <ul className="package-list">
            <li>Complete written analysis of your Parser profile</li>
            <li>Spatial, Temporal &amp; Reference axis breakdown</li>
            <li>How your filter shapes relationships, work, and decisions</li>
            <li>Collision patterns — who clashes with you and why</li>
            <li>Life-stage adjusted interpretation</li>
          </ul>
          <Link href="/assessment" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
            Start with the Free Assessment
          </Link>
          <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already completed the assessment?{' '}
            <Link href="/profile" style={{ color: 'var(--accent)' }}>View your results</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
