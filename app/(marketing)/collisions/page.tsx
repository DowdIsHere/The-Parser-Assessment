import Link from 'next/link'

export const metadata = { title: 'Collisions | Parser Frame™' }

const SYNERGIES = [
  {
    label: 'Professional',
    title: 'When Architects Run the Meeting',
    setup: 'The Architect maps the strategy. The Catalyst keeps disrupting it. Neither understands why the other is exhausting.',
    cols: [
      { name: 'Architect', desc: 'Needs structure to execute', color: '#9A7B2E' },
      { name: 'Catalyst', desc: 'Needs freedom to create', color: '#6B8F5E' },
    ],
    payoff: 'The Architect builds the container. The Catalyst fills it with the unexpected. Together: structured innovation.',
  },
  {
    label: 'Parenting',
    title: 'Parenting Collisions',
    setup: 'The Counselor listens first. The Pioneer acts first. The child watches two very different problem-solving styles collide.',
    cols: [
      { name: 'Counselor', desc: 'Processes through connection', color: '#9A7B2E' },
      { name: 'Pioneer', desc: 'Processes through action', color: '#7B6EA6' },
    ],
    payoff: 'The Counselor gives the child language for their feelings. The Pioneer gives them the courage to act on them.',
  },
  {
    label: 'Couples',
    title: 'Two Filters, One Relationship',
    setup: 'The Strategist plans the future. The Wanderer lives in the present. The tension isn\'t incompatibility — it\'s untranslated difference.',
    cols: [
      { name: 'Strategist', desc: 'Security through preparation', color: '#9A7B2E' },
      { name: 'Wanderer', desc: 'Security through presence', color: '#C4714A' },
    ],
    payoff: 'The Strategist learns to release some control. The Wanderer learns to honor some structure. The relationship deepens.',
  },
  {
    label: 'Social',
    title: 'The Room They\'re Both In',
    setup: 'The Surveyor reads the room. The Anchor holds steady within it. One adapts constantly. One never moves.',
    cols: [
      { name: 'Surveyor', desc: 'Maps social terrain instinctively', color: '#9A7B2E' },
      { name: 'Anchor', desc: 'Creates safety for others', color: '#4A8B8B' },
    ],
    payoff: 'The Surveyor brings awareness. The Anchor brings stability. Together they make a room where people relax.',
  },
]

export default function CollisionsPage() {
  return (
    <main>
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <p className="mkt-eyebrow">Cognitive Collisions</p>
          <h1 className="mkt-h1">Why Some People<br />Just Don't Click</h1>
          <p className="mkt-lead">
            Every relationship friction has a cognitive explanation. Not a personality flaw — a filter difference.
            Parser profiles reveal the exact gap, and how to work with it.
          </p>
          <div className="mkt-hero-actions">
            <Link href="/assessment" className="btn btn-primary">Discover Your Filter</Link>
            <Link href="/individual" className="btn btn-secondary">See Analysis Options</Link>
          </div>
        </div>
      </section>

      {SYNERGIES.map((s) => (
        <section key={s.label} className="mkt-section" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mkt-section-inner">
            <p className="mkt-eyebrow">{s.label}</p>
            <h2 className="mkt-h2">{s.title}</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '32px', lineHeight: '1.7' }}>{s.setup}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {s.cols.map((c) => (
                <div key={c.name} style={{ background: 'var(--bg-card)', border: `2px solid ${c.color}33`, borderRadius: 'var(--r-card)', padding: '24px', borderTop: `4px solid ${c.color}` }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: c.color }}>{c.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', background: 'var(--accent-soft)', borderLeft: '3px solid var(--accent)', padding: '16px 20px', borderRadius: '0 10px 10px 0' }}>
              {s.payoff}
            </p>
          </div>
        </section>
      ))}

      <section className="mkt-section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--border)' }}>
        <div className="mkt-section-inner" style={{ textAlign: 'center' }}>
          <h2 className="mkt-h2">Know Your Filter First</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.7' }}>
            Before you can understand the collision, you need to understand your half of it.
            The assessment takes 2 minutes.
          </p>
          <Link href="/assessment" className="btn btn-primary">Take the Free Assessment</Link>
        </div>
      </section>
    </main>
  )
}
