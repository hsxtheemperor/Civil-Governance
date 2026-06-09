'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getIssues, createIssue, addReaction, GitHubIssue } from '@/lib/github'
import { SuggestionCard } from '@/components/SuggestionCard'
import { NewSuggestionModal } from '@/components/NewSuggestionModal'

export default function SuggestionsPage() {
  const [pat, setPat] = useState<string | null>(null)
  const [issues, setIssues] = useState<GitHubIssue[]>([])
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('recent')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedPat = localStorage.getItem('github_pat')
    if (!storedPat) {
      router.push('/settings')
      return
    }

    setPat(storedPat)
    fetchIssues(storedPat)
  }, [router])

  const fetchIssues = async (token: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getIssues(token)
      setIssues(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (issueNumber: number) => {
    if (!pat) return

    try {
      await addReaction(pat, issueNumber, '+1')
      // Refetch to update vote count
      const data = await getIssues(pat)
      setIssues(data)
    } catch (err: any) {
      setError(err.message || 'Failed to add vote')
    }
  }

  const handleCreateSuggestion = async (title: string, body: string) => {
    if (!pat) return

    try {
      setIsSubmitting(true)
      await createIssue(pat, title, body)
      setShowModal(false)
      // Refresh list
      const data = await getIssues(pat)
      setIssues(data)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create suggestion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSortedIssues = () => {
    const sorted = [...issues]
    if (sortBy === 'votes') {
      sorted.sort((a, b) => (b.reactions['+1'] || 0) - (a.reactions['+1'] || 0))
    }
    return sorted
  }

  const getStageLabel = (issue: GitHubIssue) => {
    const labelMap: Record<string, string> = {
      'open': 'Stage 1: Open',
      'reviewing': 'Stage 2: Under Review',
      'debating': 'Stage 3: Being Debated',
      'archived': 'Stage 6: Archived',
    }

    const label = issue.labels.find(l => labelMap[l.name.toLowerCase()])
    return label ? labelMap[label.name.toLowerCase()] : 'Stage 1: Open'
  }

  if (!pat) return null

  const sortedIssues = getSortedIssues()

  return (
    <>
      <Header showSettings={true} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="text-4xl font-bold text-foreground">Suggestions</h2>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-slate-900 font-semibold rounded-lg transition w-full sm:w-auto"
              >
                + Submit Suggestion
              </button>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 rounded-lg transition ${
                  sortBy === 'recent'
                    ? 'bg-accent text-slate-900 font-semibold'
                    : 'border border-slate-700 text-foreground hover:border-accent'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('votes')}
                className={`px-4 py-2 rounded-lg transition ${
                  sortBy === 'votes'
                    ? 'bg-accent text-slate-900 font-semibold'
                    : 'border border-slate-700 text-foreground hover:border-accent'
                }`}
              >
                Most Voted
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : sortedIssues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No suggestions yet. Be the first to submit one!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedIssues.map((issue) => (
                <SuggestionCard
                  key={issue.id}
                  issue={issue}
                  stageLabel={getStageLabel(issue)}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <NewSuggestionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateSuggestion}
          isSubmitting={isSubmitting}
        />
      )}

      <Footer />
    </>
  )
}
