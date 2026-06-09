'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDebateLogs } from '@/lib/github'

export default function DebateLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      setLoading(true)
      const data = await getDebateLogs()
      setLogs(data.sort((a, b) => b.name.localeCompare(a.name)))
      setError(null)
    } catch (err: any) {
      console.error('[v0] Error loading debate logs:', err)
      if (!err.message.includes('404')) {
        setError('Failed to load debate logs')
      }
    } finally {
      setLoading(false)
    }
  }

  const getIssueNumber = (filename: string) => {
    const match = filename.match(/^issue-(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  const formatTitle = (filename: string) => {
    const match = filename.match(/^issue-(\d+)/)
    if (match) {
      return `Issue #${match[1]} Debate Log`
    }
    return filename.replace('.md', '').replace(/[-_]/g, ' ')
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Debate Logs</h1>
        <p className="text-gray-400 mb-8">
          Read documented discussions and resolution debates for resolved issues.
        </p>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading debate logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-gray-400">
              No debate logs yet. They appear when issues are resolved.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => {
              const issueNumber = getIssueNumber(log.name)
              const title = formatTitle(log.name)

              return (
                <div key={log.path}>
                  {issueNumber ? (
                    <Link href={`/issues/${issueNumber}`}>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition group cursor-pointer">
                        <h3 className="text-lg font-bold group-hover:text-amber-400 transition">
                          {title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2">
                          Click to view issue and debate
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p className="text-gray-400 text-sm mt-2">{log.name}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
