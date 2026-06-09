'use client'

import Link from 'next/link'

interface SuggestionCardProps {
  issue: any
  isResolved: boolean
  isPending: boolean
}

export default function SuggestionCard({
  issue,
  isResolved,
  isPending,
}: SuggestionCardProps) {
  const bodyPreview = issue.body
    .split('\n')[0]
    .substring(0, 100)
    .trim()
    .concat(issue.body.length > 100 ? '...' : '')

  return (
    <Link href={`/issues/${issue.number}`}>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition group cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
              #{issue.number}: {issue.title}
            </h3>
          </div>
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

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{bodyPreview}</p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex gap-2">
            <span>👍 {issue.reactions?.['+1'] || 0}</span>
          </div>
          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}
