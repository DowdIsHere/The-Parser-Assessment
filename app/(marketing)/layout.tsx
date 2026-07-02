import type { ReactNode } from 'react'
import Link from 'next/link'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="mkt-header">
        <div className="mkt-header-inner">
          <Link href="/" className="mkt-logo">
            <span className="mkt-logo-name">Parser Frame™</span>
            <span className="mkt-logo-sub">by J.D. Mercer</span>
          </Link>
          <nav className="mkt-nav">
            <Link href="/collisions" className="mkt-nav-link">Collisions</Link>
            <Link href="/individual" className="mkt-nav-link">Individual</Link>
            <Link href="/couples" className="mkt-nav-link">Couples</Link>
            <Link href="/assessment" className="btn btn-primary mkt-nav-cta">Take the Assessment</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mkt-footer">
        <div className="mkt-footer-inner">
          <p className="mkt-footer-brand">Parser Frame™ <span>by J.D. Mercer</span></p>
          <p className="mkt-footer-copy">© 2024 The Cognition Block. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
