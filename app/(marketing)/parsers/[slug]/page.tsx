import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PARSERS, getParserSummary } from '@/lib/parsersManifest'
import { getProfileData } from '@/lib/profiles'

export function generateStaticParams() {
  return PARSERS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getParserSummary(params.slug)
  return { title: s ? `${titleCase(s.name)} — The Parsers | Parser Frame™` : 'Parser | Parser Frame™' }
}

function titleCase(name: string) {
  return name.charAt(0) + name.slice(1).toLowerCase()
}

function Prose({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div style={{ marginBottom: '28px' }}>
      <p className="mkt-eyebrow" style={{ color: 'var(--accent-strong)', marginBottom: '10px' }}>{label}</p>
      {text.split('\n\n').map((para, i) => (
        <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '12px' }}>{para}</p>
      ))}
    </div>
  )
}

export default function ParserDetailPage({ params }: { params: { slug: string } }) {
  const summary = getParserSummary(params.slug)
  const profile = getProfileData(params.slug, 'adult')
  if (!summary || !profile) notFound()

  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <Link href="/parsers" style={{ color: 'var(--gold-pale)', fontSize: '0.85rem', textDecoration: 'none' }}>← All 27 Parsers</Link>
          <p className="mkt-eyebrow" style={{ marginTop: '16px' }}>{summary.code}</p>
          <h1 className="mkt-h1">{titleCase(summary.name)}</h1>
          <p className="mkt-lead" style={{ fontStyle: 'italic' }}>{summary.tagline}</p>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner" style={{ maxWidth: '760px' }}>
          {profile.phrase && (
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.4, color: 'var(--text-primary)', borderLeft: '3px solid var(--accent)', paddingLeft: '20px', marginBottom: '36px', fontStyle: 'italic' }}>
              {profile.phrase}
            </p>
          )}

          <Prose label="Who You Are" text={profile.overview} />

          {Array.isArray(profile.strengths) && profile.strengths.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <p className="mkt-eyebrow" style={{ color: 'var(--accent-strong)', marginBottom: '14px' }}>What Comes Naturally</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {profile.strengths.map((s: { title: string; description: string }, i: number) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{s.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Prose label="How You Learn" text={profile.howYouLearn} />
          <Prose label="How You Communicate" text={profile.howYouCommunicate} />
          <Prose label="Your Hidden Superpower" text={profile.hiddenSuperpower} />
          <Prose label="Your Blind Spot" text={profile.blindSpot} />

          {Array.isArray(profile.challenges) && profile.challenges.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <p className="mkt-eyebrow" style={{ color: 'var(--accent-strong)', marginBottom: '14px' }}>Your Natural Challenges</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {profile.challenges.map((c: { title: string; challenge: string; remedy: string }, i: number) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{c.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '8px' }}>{c.challenge}</p>
                    {c.remedy && <p style={{ color: 'var(--accent-strong)', fontSize: '0.88rem', lineHeight: 1.6 }}><strong>Remedy:</strong> {c.remedy}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(profile.topCareers) && profile.topCareers.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <p className="mkt-eyebrow" style={{ color: 'var(--accent-strong)', marginBottom: '14px' }}>Where This Wiring Leads</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {profile.topCareers.map((c: { title: string; description: string }, i: number) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{c.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mkt-section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--border)' }}>
        <div className="mkt-section-inner" style={{ textAlign: 'center' }}>
          <h2 className="mkt-h2">Is This You?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            The only way to know your Parser is to take the assessment. It starts with three questions.
          </p>
          <Link href="/assessment" className="btn btn-primary">Take the Assessment</Link>
        </div>
      </section>
    </main>
  )
}
