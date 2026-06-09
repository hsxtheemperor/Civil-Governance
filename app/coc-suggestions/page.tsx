'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCoCSuggestions } from '@/lib/github'

export default function CoCSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  useEffect(() => {
    loadSuggestions()
  }, [])

  async function loadSuggestions() {
    try {
      setLoading(true)
      const data = await getCoCSuggestions()
      setSuggestions(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
      setError(null)
    } catch (err) {
      console.error('[CJP] Error loading CoC suggestions:', err)
      setError('Failed to load suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredSuggestions = suggestions.filter(s => {
    if (filter === 'all') return true
    if (filter === 'pending') return s.state === 'open'
    if (filter === 'accepted') return s.labels.some(l => l.name === 'accepted')
    if (filter === 'rejected') return s.labels.some(l => l.name === 'rejected')
    return true
  })

  const pendingCount = suggestions.filter(s => s.state === 'open').length
  const acceptedCount = suggestions.filter(s => s.labels.some(l => l.name === 'accepted')).length
  const rejectedCount = suggestions.filter(s => s.labels.some(l => l.name === 'rejected')).length

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Code of Conduct Suggestions</h1>
          <p className="text-gray-400 mb-6">
            Community members can suggest improvements to our Code of Conduct. All suggestions are publicly visible and voted on by the community.
          </p>
          
          <Link
            href="/coc-suggestions/new"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            + Suggest a Change
          </Link>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-blue-400">{suggestions.length}</div>
            <p className="text-gray-300 mt-2">Total Suggestions</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-yellow-400">{pendingCount}</div>
            <p className="text-gray-300 mt-2">Pending Review</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-green-400">{acceptedCount}</div>
            <p className="text-gray-300 mt-2">Accepted</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-red-400">{rejectedCount}</div>
            <p className="text-gray-300 mt-2">Rejected</p>
          </div>
        </section>

        {/* Filters */}
        <section className="flex gap-2 mb-8 flex-wrap">
          {['all', 'pending', 'accepted', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-gray-300 border border-slate-700 hover:border-blue-500'
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {/* Suggestions List */}
        <section>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading suggestions...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-gray-400 mb-4">
                {filter === 'all'
                  ? 'No suggestions yet. Be the first to suggest a change!'
                  : `No ${filter} suggestions found.`}
              </p>
              {filter === 'all' && (
                <Link
                  href="/coc-suggestions/new"
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Suggest First Change
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSuggestions.map(suggestion => {
                const isAccepted = suggestion.labels.some(l => l.name === 'accepted')
                const isRejected = suggestion.labels.some(l => l.name === 'rejected')
                const status = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'pending'

                return (
                  <Link
                    key={suggestion.id}
                    href={`/coc-suggestions/${suggestion.number}`}
                  >
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition group">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold group-hover:text-blue-400 transition">
                            #{suggestion.number}: {suggestion.title}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          status === 'accepted'
                            ? 'bg-green-900 text-green-100'
                            : status === 'rejected'
                            ? 'bg-red-900 text-red-100'
                            : 'bg-yellow-900 text-yellow-100'
                        }`}>
                          {status === 'accepted' ? '✓ Accepted' : status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{suggestion.body}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>👍 {suggestion.reactions?.['+1'] || 0} votes</span>
                        <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
