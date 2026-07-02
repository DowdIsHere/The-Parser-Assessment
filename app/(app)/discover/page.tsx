'use client'

import { useEffect, useState, useCallback } from 'react'

interface DiscoverUser {
  id: string
  firstName: string
  lastName: string
  parserName?: string | null
  parserCode?: string | null
  avatarUrl?: string | null
  isConnected?: boolean
  connectionPending?: boolean
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<Set<string>>(new Set())

  const search = useCallback(async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setUsers(data.users ?? data)
    } catch {
      setError('Could not load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  async function handleConnect(userId: string) {
    setConnecting(prev => new Set(prev).add(userId))
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      })
      if (!res.ok) throw new Error('Connection failed')
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, connectionPending: true } : u)
      )
    } catch {
      setError('Could not send connection request.')
    } finally {
      setConnecting(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Discover</h1>

      <div className="discover-search">
        <input
          className="form-input search-input"
          type="search"
          placeholder="Search by name or parser type…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search users"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-text">Searching…</p>
      ) : users.length === 0 ? (
        <p className="empty-state">
          {query ? 'No parsers found for that search.' : 'Start typing to discover parsers.'}
        </p>
      ) : (
        <div className="discovery-grid">
          {users.map(user => (
            <div key={user.id} className="user-card card">
              <div className="user-card-header">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar user-avatar--placeholder">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
              </div>
              <div className="user-card-body">
                <p className="user-name">{user.firstName} {user.lastName}</p>
                {user.parserName && (
                  <span className="parser-badge">{user.parserName}</span>
                )}
                {user.parserCode && (
                  <code className="parser-code parser-code--sm">{user.parserCode}</code>
                )}
              </div>
              <div className="user-card-footer">
                {user.isConnected ? (
                  <span className="connection-status">Connected</span>
                ) : user.connectionPending ? (
                  <span className="connection-status connection-status--pending">Pending</span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleConnect(user.id)}
                    disabled={connecting.has(user.id)}
                  >
                    {connecting.has(user.id) ? 'Connecting…' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
