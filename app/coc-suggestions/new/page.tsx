'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { submitCoCSuggestion, fetchCoC } from '@/app/actions'
import { validateIssueTitle, validateIssueBody } from '@/lib/validation'

export default function NewCoCsuggestionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [affectedSection, setAffectedSection] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cocContent, setCocContent] = useState<string>('')

  const handleLoadCoC = async () => {
    try {
      const result = await fetchCoC()
      if (result.ok && result.data) {
        setCocContent(result.data)
      }
    } catch (err) {
      console.error('[CJP] Error loading CoC:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    const titleValidation = validateIssueTitle(title)
    if (!titleValidation.valid) {
      setError(titleValidation.error || 'Invalid title')
      return
    }

    const bodyValidation = validateIssueBody(body)
    if (!bodyValidation.valid) {
      setError(bodyValidation.error || 'Invalid description')
      return
    }

    if (!affectedSection.trim()) {
      setError('Please specify which section of the CoC this affects')
      return
    }

    try {
      setLoading(true)
      const result = await submitCoCSuggestion(title, affectedSection, body)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push('/coc-suggestions?success=true')
    } catch (err) {
      console.error('[CJP] Error creating suggestion:', err)
      setError(err instanceof Error ? err.message : 'Failed to create suggestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/coc-suggestions" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Suggestions
          </Link>
          <h1 className="text-4xl font-bold mb-4">Suggest a Code of Conduct Change</h1>
          <p className="text-gray-400 mb-6">
            Help improve our Code of Conduct. Your suggestion will be reviewed by moderators and voted on by the community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
              {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-white font-semibold mb-2">
                  Suggestion Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your suggestion in one sentence"
                  maxLength={200}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                />
                <p className="text-gray-400 text-sm mt-1">{title.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Affected Section
                </label>
                <input
                  type="text"
                  value={affectedSection}
                  onChange={(e) => setAffectedSection(e.target.value)}
                  placeholder="e.g., 'Section 3 - Community Conduct'"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Which part of the CoC does this relate to?
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Explain your suggestion, why it's needed, and how it improves the CoC. Be as specific as possible."
                  maxLength={5000}
                  rows={8}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
                />
                <p className="text-gray-400 text-sm mt-1">{body.length}/5000 characters</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Suggestion'}
                </button>
                <Link
                  href="/coc-suggestions"
                  className="px-6 py-3 border border-slate-600 text-gray-300 rounded-lg font-semibold hover:border-slate-400 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* CoC Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Code of Conduct</h3>
                {!cocContent ? (
                  <button
                    onClick={handleLoadCoC}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
                  >
                    View Current CoC
                  </button>
                ) : (
                  <div className="markdown text-sm text-gray-400 max-h-96 overflow-y-auto">
                    {cocContent.split('\n').slice(0, 30).map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                    {cocContent.split('\n').length > 30 && (
                      <p className="text-gray-500 italic mt-4">... (view full CoC on GitHub)</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mt-6">
                <p className="text-blue-100 text-sm">
                  <strong>Tip:</strong> Read the{' '}
                  <Link href="/terms-of-suggestions" className="underline hover:no-underline">
                    Terms of Suggestions
                  </Link>
                  {' '}to understand what suggestions are accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
