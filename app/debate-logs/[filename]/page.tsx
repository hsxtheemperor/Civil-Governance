'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getDebateLogContent } from '@/lib/github'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export default function DebateLogDetailPage() {
  const [pat, setPat] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const filename = params.filename as string

  useEffect(() => {
    const storedPat = localStorage.getItem('github_pat')
    if (!storedPat) {
      router.push('/settings')
      return
    }

    setPat(storedPat)
    fetchContent(storedPat)
  }, [router, filename])

  const fetchContent = async (token: string) => {
    try {
      setIsLoading(true)
      setError('')
      const markdown = await getDebateLogContent(token, filename)
      setContent(markdown)
    } catch (err: any) {
      setError(err.message || 'Failed to load debate log')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTitle = (fn: string) => {
    return fn
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
          <Link href="/debate-logs" className="text-accent hover:text-accent-dark transition mb-6 inline-block">
            ← Back to Debate Logs
          </Link>

          {/* Disclaimer */}
          <div className="bg-amber-900 border border-amber-700 rounded-lg p-4 mb-8">
            <p className="text-amber-200 text-sm">
              ⚠️ The views documented here represent individual community participants. They do not constitute official positions of CJP. This log exists to ensure that the needs and reasoning of the people are heard and preserved.
            </p>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-slate-800 rounded animate-pulse" />
              <div className="h-96 bg-slate-800 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-foreground mb-8">
                {formatTitle(filename)}
              </h1>

              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
