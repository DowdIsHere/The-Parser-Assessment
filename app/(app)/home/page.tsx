'use client'

import { useEffect, useRef, useState } from 'react'

interface Post {
  id: string
  content: string
  createdAt: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
  author: {
    id: string
    firstName: string
    lastName: string
    parserName?: string | null
    avatarUrl?: string | null
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function loadPosts() {
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to load posts')
      const data = await res.json()
      setPosts(data.posts ?? data)
    } catch (err) {
      setError('Could not load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleShare() {
    if (!draft.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft.trim() }),
      })
      if (!res.ok) throw new Error('Failed to post')
      setDraft('')
      await loadPosts()
    } catch {
      setError('Could not share post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLike(postId: string, likedByMe: boolean) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: likedByMe ? 'DELETE' : 'POST',
      })
      if (!res.ok) return
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likedByMe: !likedByMe, likeCount: p.likeCount + (likedByMe ? -1 : 1) }
            : p
        )
      )
    } catch {
      // silent
    }
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Home</h1>

      <div className="compose-box">
        <textarea
          ref={textareaRef}
          className="compose-textarea"
          placeholder="What are you parsing today?"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={3}
        />
        <div className="compose-actions">
          <button
            className="btn btn-primary"
            onClick={handleShare}
            disabled={submitting || !draft.trim()}
          >
            {submitting ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="empty-state">No posts yet. Be the first to share something.</p>
      ) : (
        <div className="post-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  {post.author.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="post-avatar"
                    />
                  ) : (
                    <div className="post-avatar post-avatar--placeholder">
                      {post.author.firstName[0]}{post.author.lastName[0]}
                    </div>
                  )}
                  <div className="post-author-info">
                    <span className="post-author-name">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                    {post.author.parserName && (
                      <span className="parser-badge">{post.author.parserName}</span>
                    )}
                  </div>
                </div>
                <time className="post-time" dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button
                  className={`post-action-btn${post.likedByMe ? ' post-action-btn--active' : ''}`}
                  onClick={() => handleLike(post.id, post.likedByMe)}
                  aria-label={post.likedByMe ? 'Unlike' : 'Like'}
                >
                  <span aria-hidden="true">♥</span>
                  <span>{post.likeCount}</span>
                </button>
                <span className="post-action-btn post-action-btn--static">
                  <span aria-hidden="true">✦</span>
                  <span>{post.commentCount}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
