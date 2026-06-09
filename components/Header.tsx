'use client'

import { useRouter } from 'next/navigation'

export function Header({ showSettings = false }: { showSettings?: boolean }) {
  const router = useRouter()

  const handleSettingsClick = () => {
    router.push('/settings')
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            CJP Community Platform
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            By the people. For the people. Documented.
          </p>
        </div>

        {showSettings && (
          <button
            onClick={handleSettingsClick}
            className="px-4 py-2 border border-slate-600 rounded-lg text-foreground hover:bg-slate-800 transition text-sm"
          >
            Settings
          </button>
        )}
      </div>
    </header>
  )
}
