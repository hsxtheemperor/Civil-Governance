'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchCoCSuggestions, voteOnIssue } from '@/app/actions'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export default function CoCSuggestionDetailPage() {
  const params = useParams()
  const number = parseInt(params.number as string)
  
  const [suggestion, setSuggestion] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    loadSuggestion()
  }, [number])

  async function loadSuggestion() {
    try {
      setLoading(true)
      const result = await fetchCoCSuggestions()
      if (!result.ok) {
        setError(result.error)
        return
      }
      const found = result.data.find(s => s.number === number)

      if (!found) {
        setError('Suggestion not found')
        return
      }

      setSuggestion(found)
      setError(null)
    } catch (err) {
      console.error('[CJP] Error loading suggestion:', err)
      setError('Failed to load suggestion')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    try {
      setVoting(true)
      const result = await voteOnIssue(number)
      if (!result.ok) {
        setError(result.error)
        return
      }
      // Reload to get updated vote count
      await loadSuggestion()
    } catch (err) {
      console.error('[CJP] Error voting:', err)
      setError('Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <p className="text-gray-400">Loading suggestion...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !suggestion) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-4">
            {error || 'Suggestion not found'}
          </div>
          <Link href="/coc-suggestions" className="text-blue-400 hover:text-blue-300">
            ← Back to Suggestions
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const isAccepted = suggestion.labels.some(l => l.name === 'accepted')
  const isRejected = suggestion.labels.some(l => l.name === 'rejected')
  const rejectionReason = suggestion.body.match(/## Rejection Reason\n([\s\S]*?)(?=##|$)/)?.[1]?.trim()
  const status = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'pending'

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <Link href="/coc-suggestions" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Suggestions
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">#{suggestion.number}: {suggestion.title}</h1>
              <p className="text-gray-400">
                Submitted by {suggestion.user.login} on {new Date(suggestion.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap h-fit ${
              status === 'accepted'
                ? 'bg-green-900 text-green-100'
                : status === 'rejected'
                ? 'bg-red-900 text-red-100'
                : 'bg-yellow-900 text-yellow-100'
            }`}>
              {status === 'accepted' ? '✓ Accepted' : status === 'rejected' ? '✗ Rejected' : '⏳ Pending Review'}
            </span>
          </div>

          {/* Voting Section */}
          <div className="flex items-center gap-4 py-6 border-y border-slate-700">
            <button
              onClick={handleVote}
              disabled={voting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              👍 {suggestion.reactions?.['+1'] || 0} {voting ? 'Voting...' : 'Upvote'}
            </button>
            <p className="text-gray-400">
              {suggestion.reactions?.['+1'] || 0} community members support this suggestion
            </p>
          </div>

          {/* Content */}
          <div className="mt-6">
            <div className="markdown text-gray-300">
              <MarkdownRenderer content={suggestion.body} />
            </div>
          </div>

          {/* Rejection Reason */}
          {isRejected && rejectionReason && (
            <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
              <h3 className="text-red-100 font-bold mb-2">Rejection Reason:</h3>
              <p className="text-red-100">{rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">About This Suggestion</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-white capitalize">{status}</p>
              </div>
              <div>
                <p className="text-gray-400">Votes</p>
                <p className="text-white">{suggestion.reactions?.['+1'] || 0} upvotes</p>
              </div>
              <div>
                <p className="text-gray-400">Author</p>
                <p className="text-white">{suggestion.user.login}</p>
              </div>
              <div>
                <p className="text-gray-400">Created</p>
                <p className="text-white">{new Date(suggestion.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Next Steps</h3>
            <p className="text-gray-300 text-sm mb-4">
              {status === 'pending' && 'This suggestion is being reviewed by moderators. Community votes help prioritize reviews.'}
              {status === 'accepted' && 'This suggestion has been accepted and merged into the Code of Conduct.'}
              {status === 'rejected' && 'This suggestion was rejected. See the rejection reason above for details.'}
            </p>
            <div className="space-y-2">
              <Link
                href="/coc-suggestions"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 transition"
              >
                View All Suggestions
              </Link>
              <Link
                href="/terms-of-suggestions"
                className="block px-4 py-2 border border-slate-600 text-gray-300 rounded-lg font-semibold text-center hover:border-slate-400 transition"
              >
                Terms of Suggestions
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
