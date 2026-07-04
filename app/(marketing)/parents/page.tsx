import Link from 'next/link'

export const metadata = { title: 'For Parents | Parser Frame™' }

const AGE_TIERS = [
  {
    label: 'Ages 7–12',
    title: 'The Kid Who Thinks Differently',
    body: "Your child's mind already has a shape. The way they notice, plan, and decide isn't random — it's a filter they were born with. The kids assessment reads that filter in plain, encouraging language a child can understand, plus a \"For Grown-Ups\" note written for you.",
    href: '/kids-assessment',
    cta: 'Start the Kids Assessment',
  },
  {
    label: 'Ages 13–17',
    title: 'The Teen Figuring Out Who They Are',
    body: "Adolescence is when the filter gets loud — identity, friendships, autonomy, the future. The teen edition speaks to your 13–17-year-old as the near-adult they're becoming, and gives you the context to meet them where they actually are.",
    href: '/kids-assessment',
    cta: 'Start the Teen Assessment',
  },
]

export default function ParentsPage() {
  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">For Parents</p>
          <h1 className="mkt-h1">Understand How<br />Your Child Thinks</h1>
          <p className="mkt-lead">
            Not a diagnosis. Not a label. A map of how your child's mind naturally filters the world —
            so you can teach to their wiring instead of against it, and give them language for who they are.
          </p>
          <div className="mkt-hero-actions">
            <Link href="/kids-assessment" className="btn btn-primary">Begin — 3 Questions</Link>
            <Link href="/parsers" className="btn btn-secondary">Explore the 27 Parsers</Link>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {AGE_TIERS.map((t) => (
              <div key={t.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-panel)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                <p className="mkt-eyebrow" style={{ color: 'var(--accent-strong)' }}>{t.label}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 14px', lineHeight: 1.15 }}>{t.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{t.body}</p>
                <Link href={t.href} className="btn btn-primary">{t.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--border)' }}>
        <div className="mkt-section-inner">
          <p className="mkt-eyebrow">Why It Helps</p>
          <h2 className="mkt-h2">Teach to the Wiring, Not Against It</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '28px' }}>
            {[
              { h: 'Fewer power struggles', p: 'When you understand why a child resists a certain kind of task, the friction stops feeling personal — and starts having a solution.' },
              { h: 'Real language for report cards', p: '"Doesn\'t pay attention" becomes "processes big ideas before details." The reframe changes how everyone treats them.' },
              { h: 'A head start on identity', p: 'Kids who understand their own mind early carry that self-knowledge into every hard season that follows.' },
            ].map((c) => (
              <div key={c.h} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: '22px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{c.h}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65 }}>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
