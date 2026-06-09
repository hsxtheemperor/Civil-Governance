'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getFileContent } from '@/lib/github'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

export default function CodeOfConductPage() {
  const [pat, setPat] = useState<string | null>(null)
  const [content, setContent] = useState('')
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
    fetchContent(storedPat)
  }, [router])

  const fetchContent = async (token: string) => {
    try {
      setIsLoading(true)
      setError('')
      const markdown = await getFileContent(token, 'COC.md')
      if (!markdown) {
        setError('Code of Conduct not found in repository')
        return
      }
      setContent(markdown)
    } catch (err: any) {
      setError(err.message || 'Failed to load Code of Conduct')
    } finally {
      setIsLoading(false)
    }
  }

  if (!pat) return null

  return (
    <>
      <Header showSettings={true} />

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
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
                Code of Conduct
              </h1>

              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={content} />
              </div>

              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-gray-400 mb-4">
                  Want to suggest a change to our Code of Conduct?
                </p>
                <Link
                  href="/suggestions"
                  className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-slate-900 font-semibold rounded-lg transition"
                >
                  Open a GitHub Issue
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
