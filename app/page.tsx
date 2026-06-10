'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getIssues, getDebateLogs, getCoCSuggestions, getFileContent } from '@/lib/github'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export default function HomePage() {
  const [issues, setIssues] = useState<any[]>([])
  const [debateLogs, setDebateLogs] = useState<Set<number>>(new Set())
  const [cocSuggestions, setCocSuggestions] = useState<any[]>([])
  const [coc, setCoC] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [issuesData, logsData, suggestionsData, cocData] = await Promise.all([
        getIssues(),
        getDebateLogs(),
        getCoCSuggestions(),
        getFileContent('code-of-conduct.md')
      ])
      
      setIssues(issuesData)
      setCocSuggestions(suggestionsData)
      if (cocData) setCoC(cocData)
      
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
      console.error('[CJP] Error loading data:', err)
      setError('Failed to load data. Please check GitHub configuration.')
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
          <div className="flex gap-4 flex-wrap mb-8">
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
            <Link
              href="/coc-suggestions"
              className="px-6 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-slate-900 transition"
            >
              Suggest CoC Changes
            </Link>
          </div>

          {/* Code of Conduct Display */}
          {coc && (
            <div className="mb-12 bg-gradient-to-r from-blue-900 to-slate-800 border border-blue-700 rounded-lg p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Code of Conduct</h2>
                  <p className="text-blue-200 text-sm">Our shared values and community guidelines</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/coc-suggestions" className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm">
                    Suggest Changes
                  </Link>
                  <Link href="/terms-of-suggestions" className="px-4 py-2 border border-blue-400 text-blue-300 rounded-lg font-semibold hover:bg-blue-400 hover:text-slate-900 transition text-sm">
                    Terms
                  </Link>
                </div>
              </div>
              <div className="markdown bg-slate-900 bg-opacity-50 rounded p-6 text-sm text-gray-300 max-h-96 overflow-y-auto border border-slate-700">
                <MarkdownRenderer content={coc} />
              </div>
              <div className="mt-4 text-sm text-blue-200">
                <p>💡 See something that needs improvement? <Link href="/coc-suggestions/new" className="underline hover:text-blue-100">Submit a suggestion</Link></p>
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
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
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-4xl font-bold text-blue-400">{cocSuggestions.length}</div>
            <p className="text-gray-300 mt-2">CoC Suggestions</p>
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
