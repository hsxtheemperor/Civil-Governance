'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getFileContent } from '@/lib/github'

export default function TermsOfSuggestionsPage() {
  const [termsContent, setTermsContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTerms()
  }, [])

  async function loadTerms() {
    try {
      setLoading(true)
      const content = await getFileContent('terms-of-suggestions.md')
      if (content) {
        setTermsContent(content)
      } else {
        setError('Terms of Suggestions document not found in repository')
      }
    } catch (err) {
      console.error('[CJP] Error loading terms:', err)
      setError('Failed to load Terms of Suggestions. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Suggestions</h1>
          <p className="text-gray-400">
            Guidelines for submitting suggestions, complaints, and improvements to the CJP Community Platform
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading Terms of Suggestions...</p>
          </div>
        ) : termsContent ? (
          <div className="markdown bg-slate-800 border border-slate-700 rounded-lg p-8">
            <MarkdownRenderer content={termsContent} />
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">Terms of Suggestions document not available</p>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/coc-suggestions"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Browse CoC Suggestions
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
