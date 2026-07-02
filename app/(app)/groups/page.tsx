'use client'

import { useEffect, useState } from 'react'

interface Group {
  id: string
  name: string
  description: string | null
  isPrivate: boolean
  _count: { members: number }
  members: { role: string }[]
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/groups').then(r => r.json()).then(d => {
      setGroups(d.groups || [])
      setLoading(false)
    })
  }, [])

  async function createGroup(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (data.group) {
      setGroups(g => [data.group, ...g])
      setName('')
    }
    setCreating(false)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Groups</h1>
        <p className="page-sub">Connect with people who share your parser profile.</p>
      </div>

      <form onSubmit={createGroup} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <input
          className="chat-input"
          style={{ flex: 1, borderRadius: '12px' }}
          placeholder="Create a new group…"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? 'Creating…' : 'Create'}
        </button>
      </form>

      {loading ? (
        <div className="skel-block" style={{ height: '200px', borderRadius: 'var(--r-card)' }} />
      ) : (
        <div className="groups-grid">
          {groups.map(g => (
            <div key={g.id} className="group-card">
              <p className="group-name">{g.name}</p>
              {g.description && <p className="group-desc">{g.description}</p>}
              <p className="group-meta">{g._count.members} member{g._count.members !== 1 ? 's' : ''} · {g.isPrivate ? 'Private' : 'Open'}</p>
              {g.members.length > 0 && (
                <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {g.members[0].role === 'admin' ? 'Admin' : 'Member'}
                </span>
              )}
            </div>
          ))}
          {groups.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>No groups yet. Create one above.</p>
          )}
        </div>
      )}
    </div>
  )
}
