'use client'

import { useEffect, useState } from 'react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  bio?: string | null
  parserName?: string | null
  parserCode?: string | null
  spatialAxis?: string | null
  temporalAxis?: string | null
  referenceAxis?: string | null
  avatarUrl?: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '' })

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then(data => {
        setProfile(data.user ?? data)
        const u = data.user ?? data
        setForm({ firstName: u.firstName, lastName: u.lastName, bio: u.bio ?? '' })
      })
      .catch(() => setError('Could not load profile.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      const data = await res.json()
      setProfile(data.user ?? data)
      setEditing(false)
    } catch {
      setError('Could not save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-content"><p className="loading-text">Loading profile…</p></div>

  if (!profile) return <div className="page-content"><p className="error-message">{error ?? 'Profile not found.'}</p></div>

  const axes = [
    { label: 'Spatial', value: profile.spatialAxis },
    { label: 'Temporal', value: profile.temporalAxis },
    { label: 'Reference', value: profile.referenceAxis },
  ].filter(a => a.value)

  return (
    <div className="page-content">
      <h1 className="page-title">My Profile</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="profile-card card">
        <div className="profile-header">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar--placeholder">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
          )}
          <div className="profile-meta">
            <h2 className="profile-name">{profile.firstName} {profile.lastName}</h2>
            {profile.parserName && (
              <span className="parser-badge parser-badge--lg">{profile.parserName}</span>
            )}
            {profile.parserCode && (
              <code className="parser-code">{profile.parserCode}</code>
            )}
          </div>
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {profile.bio && !editing && (
          <p className="profile-bio">{profile.bio}</p>
        )}

        {axes.length > 0 && (
          <div className="profile-axes">
            {axes.map(({ label, value }) => (
              <span key={label} className="axis-chip">
                <span className="axis-chip-label">{label}</span>
                <span className="axis-chip-value">{value}</span>
              </span>
            ))}
          </div>
        )}

        {editing && (
          <div className="profile-edit-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  className="form-input"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  className="form-input"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                className="form-input form-textarea"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Tell others about yourself…"
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
