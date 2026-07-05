'use client'

import { useEffect, useState } from 'react'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  read: boolean
  sender?: { id: string; firstName: string; lastName: string; avatarUrl?: string | null; parserName?: string | null }
  receiver?: { id: string; firstName: string; lastName: string; avatarUrl?: string | null; parserName?: string | null }
}

interface Thread {
  userId: string
  name: string
  parserName: string | null
  lastMessage: string
  lastAt: string
}

export default function MessagesPage() {
  const [sent, setSent] = useState<Message[]>([])
  const [received, setReceived] = useState<Message[]>([])
  const [me, setMe] = useState<{ id: string } | null>(null)
  const [selected, setSelected] = useState<Thread | null>(null)
  const [thread, setThread] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
    ]).then(([me, msgs]) => {
      setMe(me.user)
      setSent(msgs.sent || [])
      setReceived(msgs.received || [])
      setLoading(false)
    })
  }, [])

  const threads = (() => {
    if (!me) return []
    const map = new Map<string, Thread>()
    ;[...sent, ...received].forEach(m => {
      const other = m.senderId === me.id ? m.receiver : m.sender
      if (!other) return
      const existing = map.get(other.id)
      const at = m.createdAt
      if (!existing || at > existing.lastAt) {
        map.set(other.id, {
          userId: other.id,
          name: `${other.firstName} ${other.lastName}`.trim(),
          parserName: other.parserName || null,
          lastMessage: m.content,
          lastAt: at,
        })
      }
    })
    return [...map.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt))
  })()

  async function openThread(t: Thread) {
    setSelected(t)
    const res = await fetch(`/api/messages/${t.userId}`)
    const data = await res.json()
    setThread(data.messages || [])
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim() || !selected || !me) return
    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: selected.userId, content: draft }),
    })
    const data = await res.json()
    if (data.message) {
      setThread(t => [...t, data.message])
      setDraft('')
    }
    setSending(false)
  }

  if (loading) return <div className="page-content"><div className="skel-block" style={{ height: '300px', borderRadius: 'var(--r-card)' }} /></div>

  return (
    <div className="messages-layout">
      <aside className="conversations-list">
        {threads.map(t => (
          <div key={t.userId} className={`conversation-item${selected?.userId === t.userId ? ' active' : ''}`} onClick={() => openThread(t)}>
            <p className="conversation-name">{t.name}{t.parserName && <span style={{ color: 'var(--accent)', fontSize: '0.75rem', marginLeft: '6px' }}>{t.parserName}</span>}</p>
            <p className="conversation-preview">{t.lastMessage}</p>
          </div>
        ))}
        {threads.length === 0 && <p style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>No conversations yet.</p>}
      </aside>

      <div className="chat-area">
        {selected ? (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{selected.name}</div>
            <div className="chat-messages">
              {thread.map(m => (
                <div key={m.id} className={`chat-msg${m.senderId === me?.id ? ' mine' : ''}`}>
                  <div className="chat-msg-bubble">{m.content}</div>
                </div>
              ))}
            </div>
            <form className="chat-input-area" onSubmit={sendMessage}>
              <input className="chat-input" placeholder="Message…" value={draft} onChange={e => setDraft(e.target.value)} />
              <button type="submit" className="btn btn-primary" disabled={sending} style={{ padding: '10px 18px' }}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Select a conversation
          </div>
        )}
      </div>
    </div>
  )
}
