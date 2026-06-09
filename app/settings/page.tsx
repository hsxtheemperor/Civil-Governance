'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [pat, setPat] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedPat = localStorage.getItem('github_pat')
    if (storedPat) {
      router.push('/')
    }
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pat.trim()) {
      setError('Please enter a Personal Access Token')
      return
    }

    setIsLoading(true)

    try {
      // Validate PAT by making a simple API call
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (response.status === 401) {
        setError('Invalid Personal Access Token. Please check and try again.')
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        setError('Failed to validate token. Please try again.')
        setIsLoading(false)
        return
      }

      localStorage.setItem('github_pat', pat)
      router.push('/')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CJP Community Platform
          </h1>
          <p className="text-gray-400 mb-8">Setup your GitHub PAT</p>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="pat" className="block text-sm font-medium text-foreground mb-2">
                GitHub Personal Access Token
              </label>
              <input
                id="pat"
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="ghp_..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-accent transition"
              />
              <p className="text-xs text-gray-400 mt-2">
                Your PAT is stored locally on your device and used to interact with GitHub on your behalf. It never leaves your browser.
              </p>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-slate-900 font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? 'Validating...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
