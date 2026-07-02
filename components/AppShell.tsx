'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface AppShellProps {
  children: ReactNode
  user?: {
    firstName: string
    lastName: string
    avatarUrl?: string | null
    parserName?: string | null
  }
}

const navItems = [
  { href: '/home', label: 'Home', icon: '⌂' },
  { href: '/discover', label: 'Discover', icon: '◎' },
  { href: '/groups', label: 'Groups', icon: '⬡' },
  { href: '/messages', label: 'Messages', icon: '✉' },
  { href: '/profile', label: 'Profile', icon: '◉' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
]

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      {/* Desktop sidebar layout */}
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-logo">The Parser</span>
          </div>

          {user && (
            <div className="sidebar-user">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="sidebar-avatar"
                />
              ) : (
                <div className="sidebar-avatar sidebar-avatar--placeholder">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              )}
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {user.firstName} {user.lastName}
                </span>
                {user.parserName && (
                  <span className="sidebar-user-parser">{user.parserName}</span>
                )}
              </div>
            </div>
          )}

          <nav className="sidebar-nav">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item${pathname === href || pathname?.startsWith(href + '/') ? ' sidebar-nav-item--active' : ''}`}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">{icon}</span>
                <span className="sidebar-nav-label">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-logout btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`mobile-nav-item${pathname === href || pathname?.startsWith(href + '/') ? ' mobile-nav-item--active' : ''}`}
          >
            <span className="mobile-nav-icon" aria-hidden="true">{icon}</span>
            <span className="mobile-nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
