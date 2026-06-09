import Link from 'next/link'
import { getIssues, getCoCSuggestions, getDebateLogs, getFileContent, GitHubIssue, GitHubFile } from '@/lib/github'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import SuggestionCard from '@/components/SuggestionCard'

// Revalidate the CoC content at most once per hour to avoid GitHub API rate limits.
// If you need real-time updates, remove this and rely on on-demand revalidation instead.
export const revalidate = 3600

export default async function HomePage() {
  // Fetch all data in parallel; failures are handled gracefully via allSettled
  const [issuesResult, suggestionsResult, debatesResult, cocResult] =
    await Promise.allSettled([
      getIssues(),
      getCoCSuggestions(),
      getDebateLogs(),
      getFileContent('code-of-conduct.md'),
    ])

  const allIssues: GitHubIssue[] =
    issuesResult.status === 'fulfilled' ? issuesResult.value : []
  const allSuggestions: GitHubIssue[] =
    suggestionsResult.status === 'fulfilled' ? suggestionsResult.value : []
  const debateLogs: GitHubFile[] =
    debatesResult.status === 'fulfilled' ? (debatesResult.value as GitHubFile[]) : []
  const cocContent: string | null =
    cocResult.status === 'fulfilled' ? cocResult.value : null

  // Derive issue categories from labels
  const pendingIssues = allIssues.filter(i =>
    i.labels.some(l => l.name === 'pending')
  )
  const acceptedIssues = allIssues.filter(i =>
    i.labels.some(l => l.name === 'accepted')
  )
  const resolvedIssues = acceptedIssues.filter(i =>
    debateLogs.some((d: GitHubFile) => d.name === `issue-${i.number}.md`)
  )

  // Top 3 issues by vote count for the homepage highlight
  const topIssues = [...acceptedIssues]
    .sort((a, b) => (b.reactions['+1'] ?? 0) - (a.reactions['+1'] ?? 0))
    .slice(0, 3)

  const stats = [
    { label: 'Total Issues',   value: allIssues.length,                           color: 'text-white' },
    { label: 'Pending Review', value: pendingIssues.length,                        color: 'text-yellow-400' },
    { label: 'Open & Voting',  value: acceptedIssues.length - resolvedIssues.length, color: 'text-amber-400' },
    { label: 'Resolved',       value: resolvedIssues.length,                       color: 'text-green-400' },
  ]

  return (
    <>
      {/* Markdown prose styles — scoped to .markdown, keeps Tailwind clean */}
      <style>{`
        .markdown h1 { font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .markdown h2 { font-size: 1.25rem; font-weight: 700; color: #fff; margin-top: 2rem; margin-bottom: 0.5rem; }
        .markdown h3 { font-size: 1rem; font-weight: 600; color: #fbbf24; margin-top: 1.25rem; margin-bottom: 0.25rem; }
        .markdown p  { color: #d1d5db; line-height: 1.75; margin-bottom: 0.75rem; }
        .markdown hr { border-color: #334155; margin: 1.5rem 0; }
        .markdown em { color: #94a3b8; font-style: italic; }
        .markdown strong { color: #f8fafc; font-weight: 600; }
        .markdown ul { list-style: disc; padding-left: 1.5rem; color: #d1d5db; margin-bottom: 0.75rem; }
        .markdown li { margin-bottom: 0.25rem; line-height: 1.6; }
        .markdown a  { color: #f59e0b; text-decoration: underline; }
        .markdown a:hover { color: #fbbf24; }
        .markdown code { background: #1e293b; color: #fbbf24; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.875rem; }
        .markdown blockquote { border-left: 3px solid #f59e0b; padding-left: 1rem; color: #94a3b8; margin: 1rem 0; font-style: italic; }
      `}</style>

      <main className="min-h-screen bg-slate-950 text-white">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6 tracking-wide">
              Transparent · Open · Auditable
            </span>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              By the people.{' '}
              <span className="text-amber-400">For the people.</span>
              <br />
              Documented.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              A civic governance platform where community members report problems,
              vote on solutions, and engage in documented debates. All data is
              public, immutable, and auditable.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/problems"
                className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Report a Problem
              </Link>
              <Link
                href="/issues"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition border border-slate-700"
              >
                Browse Issues
              </Link>
              <Link
                href="/coc-suggestions"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition border border-slate-700"
              >
                Suggest CoC Change
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center"
              >
                <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Issues ───────────────────────────────────────────── */}
        {topIssues.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">🔥 Top Issues</h2>
              <Link
                href="/issues"
                className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition"
              >
                View All →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {topIssues.map(issue => {
                const isResolved = debateLogs.some(
                  (d: GitHubFile) => d.name === `issue-${issue.number}.md`
                )
                const isPending = issue.labels.some(l => l.name === 'pending')
                return (
                  <SuggestionCard
                    key={issue.id}
                    issue={issue}
                    isResolved={isResolved}
                    isPending={isPending}
                  />
                )
              })}
            </div>
          </section>
        )}

        {/* ── How It Works ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-14">
          <h2 className="text-2xl font-bold text-white mb-6">⚙️ How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Report',   desc: 'Submit a problem. It is labeled pending and awaits moderator review.' },
              { step: '02', title: 'Review',   desc: 'Moderators accept or reject with a documented reason — all public.' },
              { step: '03', title: 'Vote',     desc: 'Community votes on accepted issues. Top issues rise to the surface.' },
              { step: '04', title: 'Resolve',  desc: 'A debate log is published, the issue is closed, and the record stands.' },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6"
              >
                <div className="text-amber-500 font-mono text-sm font-bold mb-2">{step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Code of Conduct ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📜 Code of Conduct</h2>
            <div className="flex items-center gap-4">
              {allSuggestions.length > 0 && (
                <span className="text-gray-500 text-sm">
                  {allSuggestions.length} active suggestion
                  {allSuggestions.length !== 1 ? 's' : ''} from the community
                </span>
              )}
              <Link
                href="/coc-suggestions"
                className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition"
              >
                Suggest a Change →
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            {cocContent ? (
              <MarkdownRenderer content={cocContent} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  The Code of Conduct could not be loaded right now.
                </p>
                <Link
                  href="/coc-suggestions"
                  className="text-amber-500 hover:text-amber-400 text-sm font-semibold underline transition"
                >
                  View community suggestions instead →
                </Link>
              </div>
            )}
          </div>

          {/* Debate logs callout */}
          {debateLogs.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-4">
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{debateLogs.length}</span>{' '}
                resolved debate{debateLogs.length !== 1 ? 's' : ''} on record — all publicly auditable.
              </p>
              <Link
                href="/debate-logs"
                className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition whitespace-nowrap ml-4"
              >
                View Debates →
              </Link>
            </div>
          )}
        </section>

      </main>
    </>
  )
}