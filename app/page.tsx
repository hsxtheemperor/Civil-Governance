'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getFileContent } from '@/lib/github'
import Link from 'next/link'

export default function HomePage() {
  const [pat, setPat] = useState<string | null>(null)
  const [description, setDescription] = useState('')
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
    fetchDescription(storedPat)
  }, [router])

  const fetchDescription = async (token: string) => {
    try {
      setIsLoading(true)
      const content = await getFileContent(token, 'README.md')
      if (content) {
        // Extract first paragraph
        const lines = content.split('\n').filter(line => line.trim())
        const descLine = lines.find(line => !line.startsWith('#') && line.trim().length > 0)
        setDescription(descLine || 'A civic participation platform powered by GitHub.')
      }
    } catch (err) {
      console.error('Error fetching description:', err)
      setError('Failed to load description')
    } finally {
      setIsLoading(false)
    }
  }

  if (!pat) return null

  return (
    <>
      <Header showSettings={true} />

      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
              Welcome to CJP Community Platform
            </h2>
            {isLoading ? (
              <div className="h-24 bg-slate-800 rounded animate-pulse" />
            ) : (
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                {description || 'A civic participation platform powered by GitHub.'}
              </p>
            )}
          </section>

          {/* Navigation Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/suggestions">
              <div className="group bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-accent transition cursor-pointer h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-slate-900 text-xl font-bold group-hover:scale-110 transition">
                    💡
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Suggestions</h3>
                <p className="text-gray-400">
                  Share ideas and vote on community suggestions.
                </p>
              </div>
            </Link>

            <Link href="/debate-logs">
              <div className="group bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-accent transition cursor-pointer h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-slate-900 text-xl font-bold group-hover:scale-110 transition">
                    📝
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Debate Logs</h3>
                <p className="text-gray-400">
                  Read documented discussions and community dialogue.
                </p>
              </div>
            </Link>

            <Link href="/code-of-conduct">
              <div className="group bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-accent transition cursor-pointer h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-slate-900 text-xl font-bold group-hover:scale-110 transition">
                    ⚖️
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Code of Conduct</h3>
                <p className="text-gray-400">
                  Our shared values and community guidelines.
                </p>
              </div>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
