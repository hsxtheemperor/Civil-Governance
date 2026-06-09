'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getIssues, getDebateLogs } from '@/lib/github'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [issues, setIssues] = useState<any[]>([])
  const [debateLogs, setDebateLogs] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [issuesData, logsData] = await Promise.all([
        getIssues(),
        getDebateLogs()
      ])
      
      setIssues(issuesData)
      
      // Extract issue numbers from debate log filenames
      const resolvedIssues = new Set(
        logsData
          .map(f => f.name)
          .filter(name => name.match(/^issue-\d+/))
          .map(name => parseInt(name.match(/\d+/)?.[0] || '0'))
      )
      setDebateLogs(resolvedIssues)
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading data:', err)
      setError('Failed to load issues. Check GitHub PAT configuration.')
    } finally {
      setLoading(false)
    }
  }

  const acceptedIssues = issues.filter(i => i.labels.some(l => l.name === 'accepted'))
  const resolvedIssues = acceptedIssues.filter(i => debateLogs.has(i.number))
  const openVoting = acceptedIssues.filter(i => !debateLogs.has(i.number))
  const pendingModeration = issues.filter(i => !i.labels.some(l => l.name === 'accepted'))

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-5xl font-bold mb-4 text-balance">CJP Community Platform</h1>
          <p className="text-xl text-gray-300 mb-8">
            By the people. For the people. Documented.
          </p>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Report problems affecting our community. Moderators review and approve submissions. 
            The community votes anonymously to prioritize issues. Debates are documented and published.
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/problems"
              className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Report a Problem
            </Link>
            <Link
              href="/issues"
              className="px-6 py-3 border border-amber-500 text-amber-500 rounded-lg font-semibold hover:bg-amber-500 hover:text-slate-900 transition"
            >
              View All Issues
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-amber-500">{issues.length}</div>
            <p className="text-gray-300 mt-2">Total Issues</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-yellow-400">{pendingModeration.length}</div>
            <p className="text-gray-300 mt-2">Pending Review</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-orange-400">{openVoting.length}</div>
            <p className="text-gray-300 mt-2">Open & Voting</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-green-400">{resolvedIssues.length}</div>
            <p className="text-gray-300 mt-2">Resolved</p>
          </div>
        </section>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {/* Recent Issues */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Recent Issues</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <p className="text-gray-400 mb-4">No issues yet. Be the first to report a problem!</p>
              <Link
                href="/problems"
                className="inline-block px-6 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Report First Problem
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {issues.slice(0, 8).map((issue) => {
                const isResolved = debateLogs.has(issue.number)
                const isAccepted = issue.labels.some(l => l.name === 'accepted')
                const isPending = !isAccepted
                
                return (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.number}`}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-amber-400 transition line-clamp-2">
                        #{issue.number}: {issue.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        isResolved
                          ? 'bg-green-900 text-green-100'
                          : isPending
                          ? 'bg-yellow-900 text-yellow-100'
                          : 'bg-orange-900 text-orange-100'
                      }`}>
                        {isResolved ? '✓ Resolved' : isPending ? '⏳ Pending' : '🗳️ Voting'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{issue.body}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>👍 {issue.reactions?.['+1'] || 0} votes</span>
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
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
