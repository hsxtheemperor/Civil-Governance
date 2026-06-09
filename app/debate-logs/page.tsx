'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getDebateLogs, GitHubFile } from '@/lib/github'

export default function DebateLogsPage() {
  const [pat, setPat] = useState<string | null>(null)
  const [logs, setLogs] = useState<GitHubFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedPat = localStorage.getItem('github_pat')
    if (!storedPat) {
      router.push('/settings')
      return
    }

    setPat(storedPat)
    fetchLogs(storedPat)
  }, [router])

  const fetchLogs = async (token: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getDebateLogs(token)
      setLogs(data.sort((a, b) => b.name.localeCompare(a.name)))
    } catch (err: any) {
      if (err.message.includes('404')) {
        setLogs([])
      } else {
        setError(err.message || 'Failed to load debate logs')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateFromFilename = (filename: string) => {
    // Try to extract date from filename like "debate-2024-01-15.md"
    const match = filename.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return new Date(`${match[1]}-${match[2]}-${match[3]}`)
    }
    return null
  }

  const formatTitle = (filename: string) => {
    return filename
      .replace('.md', '')
      .replace(/[-_]/g, ' ')
      .replace(/^\d{4}\s\d{2}\s\d{2}\s/, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (!pat) return null

  return (
    <>
      <Header showSettings={true} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold text-foreground mb-8">Debate Logs</h2>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No debate logs yet. They'll appear here once added to the repository.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {logs.map((log) => {
                const date = formatDateFromFilename(log.name)
                const title = formatTitle(log.name)

                return (
                  <Link key={log.path} href={`/debate-logs/${log.name}`}>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-accent transition cursor-pointer">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {title}
                      </h3>
                      {date && (
                        <p className="text-gray-400 text-sm">
                          {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
