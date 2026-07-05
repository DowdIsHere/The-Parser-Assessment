import Link from 'next/link'
import { PARSERS } from '@/lib/parsersManifest'

export const metadata = { title: 'The 27 Parsers | Parser Frame™' }

export default function ParsersIndexPage() {
  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">The Framework</p>
          <h1 className="mkt-h1">The 27 Parsers</h1>
          <p className="mkt-lead">
            Every mind filters the world through three axes — how you see (abstract vs. concrete),
            when you live (past, present, future), and who you center (self, other, balanced).
            Twenty-seven combinations. Find the one that reads like you.
          </p>
          <div className="mkt-hero-actions">
            <Link href="/assessment" className="btn btn-primary">Discover Yours — 3 Questions</Link>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {PARSERS.map((p) => (
              <Link
                key={p.slug}
                href={`/parsers/${p.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-card)',
                  padding: '24px',
                  textDecoration: 'none',
                  transition: 'border-color .2s, box-shadow .2s, transform .2s',
                }}
                className="parser-index-card"
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-strong)', marginBottom: '8px' }}>{p.code}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>{p.name}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>{p.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
