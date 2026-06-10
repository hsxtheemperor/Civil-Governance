'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitProblem } from '@/app/actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProblemsPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await submitProblem(title, description)

      if (!result.ok) {
        setError(result.error)
        return
      }

      setSuccess(true)
      setTitle('')
      setDescription('')

      setTimeout(() => {
        router.push('/issues')
      }, 2000)
    } catch (err) {
      console.error('[v0] Error submitting problem:', err)
      setError('Failed to submit problem. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Report a Problem</h1>
        <p className="text-gray-400 mb-8">
          Describe an issue affecting our community. Your submission will be reviewed by moderators.
        </p>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          {success && (
            <div className="mb-6 bg-green-900 border border-green-700 rounded-lg p-4 text-green-100">
              ✓ Problem submitted successfully! Redirecting to issues...
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4 text-red-100">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Problem Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Briefly describe the problem..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and clear about the issue
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the problem:&#10;- What is the issue?&#10;- Who does it affect?&#10;- Why is it important?&#10;- Any suggested solutions?"
              rows={8}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Markdown formatting is supported
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Problem'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:border-gray-500 transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        <section className="mt-16 bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-4">Guidelines</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">•</span>
              <span>Focus on community-wide problems, not personal issues</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">•</span>
              <span>Provide specific details and context</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">•</span>
              <span>Check existing issues before submitting duplicates</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">•</span>
              <span>Follow our Code of Conduct</span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
