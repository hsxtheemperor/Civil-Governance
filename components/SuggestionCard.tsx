'use client'

import { GitHubIssue } from '@/lib/github'
import { formatDistanceToNow } from 'date-fns'

interface SuggestionCardProps {
  issue: GitHubIssue
  stageLabel: string
  onVote: (issueNumber: number) => Promise<void>
}

export function SuggestionCard({
  issue,
  stageLabel,
  onVote,
}: SuggestionCardProps) {
  const handleVoteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await onVote(issue.number)
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const bodyPreview = issue.body
    .split('\n')[0]
    .substring(0, 100)
    .trim()
    .concat(issue.body.length > 100 ? '...' : '')

  const createdDate = new Date(issue.created_at)
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-accent transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {issue.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            {bodyPreview}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-amber-900 text-amber-200 rounded-full text-xs font-medium">
              {stageLabel}
            </span>
            {issue.labels.map((label) => (
              <span
                key={label.name}
                className="inline-block px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-xs"
              >
                {label.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>by {issue.user.login}</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        <button
          onClick={handleVoteClick}
          className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-foreground hover:bg-slate-700 hover:border-accent transition whitespace-nowrap"
        >
          👍 {issue.reactions['+1'] || 0}
        </button>
      </div>
    </div>
  )
}
