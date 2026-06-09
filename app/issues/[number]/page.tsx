'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getIssues, addReaction, getDebateLogContent, getDebateLogs } from '@/lib/github'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export default function IssuePage() {
  const params = useParams()
  const issueNumber = parseInt(params.number as string)

  const [issue, setIssue] = useState<any>(null)
  const [debateContent, setDebateContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIssue()
  }, [issueNumber])

  async function loadIssue() {
    try {
      setLoading(true)
      const [issuesData, logsData] = await Promise.all([
        getIssues(),
        getDebateLogs()
      ])

      const foundIssue = issuesData.find(i => i.number === issueNumber)
      if (!foundIssue) throw new Error('Issue not found')

      setIssue(foundIssue)

      // Check if there's a debate log for this issue
      const debateLog = logsData.find(f => f.name === `issue-${issueNumber}.md`)
      if (debateLog) {
        const content = await getDebateLogContent(`issue-${issueNumber}.md`)
        setDebateContent(content)
      }

      setError(null)
    } catch (err) {
      console.error('[v0] Error loading issue:', err)
      setError('Failed to load issue. Check GitHub PAT configuration.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVote() {
    if (!issue) return

    try {
      setVoting(true)
      await addReaction(issueNumber)
      // Update local state
      setIssue({
        ...issue,
        reactions: {
          ...issue.reactions,
          '+1': (issue.reactions?.['+1'] || 0) + 1
        }
      })
    } catch (err) {
      console.error('[v0] Error voting:', err)
      setError('Failed to vote. Try again later.')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading issue...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!issue) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-red-100">
            {error || 'Issue not found'}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isAccepted = issue.labels.some((l: any) => l.name === 'accepted')
  const isResolved = debateContent !== null

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-4xl font-bold">#{issueNumber}: {issue.title}</h1>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
              isResolved
                ? 'bg-green-900 text-green-100'
                : !isAccepted
                ? 'bg-yellow-900 text-yellow-100'
                : 'bg-orange-900 text-orange-100'
            }`}>
              {isResolved ? '✓ Resolved' : !isAccepted ? '⏳ Pending Review' : '🗳️ Open for Voting'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>Created by @{issue.user.login}</span>
            <span>•</span>
            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={issue.body} />
              </div>
            </div>

            {/* Debate Log */}
            {debateContent && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
                <h2 className="text-xl font-bold mb-4">Debate Log</h2>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={debateContent} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Vote Box */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-500 mb-2">
                  {issue.reactions?.['+1'] || 0}
                </div>
                <p className="text-gray-400 mb-4">Community Votes</p>
                {!isResolved && (
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className="w-full px-4 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {voting ? 'Voting...' : '👍 Vote for This'}
                  </button>
                )}
                {isResolved && (
                  <div className="px-4 py-3 bg-green-900 text-green-100 rounded-lg font-semibold text-center">
                    ✓ Issue Resolved
                  </div>
                )}
              </div>
            </div>

            {/* Status Box */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mt-4">
              <h3 className="font-bold text-gray-300 mb-4">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Moderation</span>
                  <span className={`text-sm font-semibold ${isAccepted ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isAccepted ? '✓ Accepted' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Resolution</span>
                  <span className={`text-sm font-semibold ${isResolved ? 'text-green-400' : 'text-orange-400'}`}>
                    {isResolved ? '✓ Resolved' : '🗳️ Voting'}
                  </span>
                </div>
              </div>
            </div>

            {/* Labels */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mt-4">
                <h3 className="font-bold text-gray-300 mb-3">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label: any) => (
                    <span
                      key={label.name}
                      className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm"
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
