import Link from 'next/link'

export const metadata = { title: 'Payment Successful | Parser Frame™' }

export default function AssessmentSuccessPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-page)' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-panel)', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '999px', background: '#E8F4EC', color: '#0E7A52', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px' }}>✓</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '12px' }}>You're Unlocked</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: '1.65' }}>
          Your full Parser Profile is now available. Head to your profile to view your complete analysis.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/profile" className="btn btn-primary" style={{ textAlign: 'center' }}>View My Full Profile</Link>
          <Link href="/home" className="btn btn-secondary" style={{ textAlign: 'center' }}>Go to Home</Link>
        </div>
      </div>
    </main>
  )
}
