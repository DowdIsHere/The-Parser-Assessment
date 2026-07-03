'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  // Profile (username + image)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) {
          setDisplayName(d.user.firstName || '')
          setAvatarUrl(d.user.avatarUrl || null)
        }
      })
      .finally(() => setLoadingProfile(false))
  }, [])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Image must be under 2 MB.')
      return
    }
    setProfileError(null)
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)
    if (!displayName.trim()) {
      setProfileError('Please enter a name.')
      return
    }
    setProfileSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: displayName.trim(), avatarUrl }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to update profile.')
      }
      setProfileSuccess(true)
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setProfileSaving(false)
    }
  }

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  const [signingOut, setSigningOut] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(false)

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }

    setPwSaving(true)
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to update password.')
      }
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setPwSaving(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/login')
    }
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Settings</h1>

      <section className="settings-section card">
        <h2 className="settings-title">Profile</h2>
        {loadingProfile ? (
          <p className="settings-description">Loading…</p>
        ) : (
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Profile image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-inset)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                      {displayName ? displayName[0].toUpperCase() : '?'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.85rem' }} />
                  {avatarUrl && (
                    <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px', alignSelf: 'flex-start' }} onClick={() => setAvatarUrl(null)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <span className="form-hint">Square images look best. Max 2 MB.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="displayName">Username</label>
              <input
                id="displayName"
                type="text"
                className="form-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                placeholder="The name shown on your profile"
              />
              <span className="form-hint">This is the name that appears on your Parser profile.</span>
            </div>

            {profileError && <p className="error-message">{profileError}</p>}
            {profileSuccess && <p className="success-message">Profile updated.</p>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                {profileSaving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="settings-section card">
        <h2 className="settings-title">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              className="form-input"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <span className="form-hint">Minimum 8 characters</span>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {pwError && <p className="error-message">{pwError}</p>}
          {pwSuccess && <p className="success-message">Password updated successfully.</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </section>

      <section className="settings-section card">
        <h2 className="settings-title">Account</h2>
        <p className="settings-description">
          Sign out of your Parser account on this device.
        </p>
        <button
          className="btn btn-danger"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </section>
    </div>
  )
}
