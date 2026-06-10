'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getIssues, getDebateLogs } from '@/lib/github'
import HeaderClient from '@/components/HeaderClient'
import Footer from '@/components/Footer'
import SuggestionCard from '@/components/SuggestionCard'

export default function IssuesPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [debateLogs, setDebateLogs] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'all' | 'pending' | 'voting' | 'resolved'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIssues()
  }, [])

  async function loadIssues() {
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
      console.error('[v0] Error loading issues:', err)
      setError('Failed to load issues. Check GitHub PAT configuration.')
    } finally {
      setLoading(false)
    }
  }

  const getIssueStatus = (issue: any) => {
    const isAccepted = issue.labels.some((l: any) => l.name === 'accepted')
    const isResolved = debateLogs.has(issue.number)

    if (isResolved) return 'resolved'
    if (isAccepted) return 'voting'
    return 'pending'
  }

  const filteredIssues = issues.filter(issue => {
    const status = getIssueStatus(issue)
    if (filter === 'all') return true
    return status === filter
  })

  const sortedIssues = filteredIssues.sort(
    (a, b) => (b.reactions?.['+1'] || 0) - (a.reactions?.['+1'] || 0)
  )

  const stats = {
    all: issues.length,
    pending: issues.filter(i => getIssueStatus(i) === 'pending').length,
    voting: issues.filter(i => getIssueStatus(i) === 'voting').length,
    resolved: issues.filter(i => getIssueStatus(i) === 'resolved').length,
  }

  return (
    <>
      <HeaderClient />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between gap-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Issues</h1>
            <p className="text-gray-400">
              Vote on issues to prioritize community needs. Resolved issues have debate logs.
            </p>
          </div>
          <Link
            href="/problems"
            className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition whitespace-nowrap"
          >
            Report New Issue
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'pending', 'voting', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === tab
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({stats[tab]})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading issues...</p>
          </div>
        ) : sortedIssues.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-gray-400 mb-4">
              {filter === 'all'
                ? 'No issues yet. Be the first to report a problem!'
                : `No ${filter} issues at this time.`}
            </p>
            <Link
              href="/problems"
              className="inline-block px-6 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedIssues.map(issue => (
              <SuggestionCard
                key={issue.id}
                issue={issue}
                isResolved={debateLogs.has(issue.number)}
                isPending={!issue.labels.some((l: any) => l.name === 'accepted')}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
