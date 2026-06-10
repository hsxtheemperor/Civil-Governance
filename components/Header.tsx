'use client'

import Link from 'next/link'
import { Home, FileWarning } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-2xl font-bold text-white">
              CJP Community Platform
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              By the people. For the people. Documented.
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 text-gray-300 hover:text-white transition text-sm"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Home
          </Link>
          <Link
            href="/issues"
            className="px-4 py-2 text-gray-300 hover:text-white transition text-sm"
          >
            Issues
          </Link>
          <Link
            href="/coc-suggestions"
            className="px-4 py-2 text-gray-300 hover:text-white transition text-sm"
          >
            CoC
          </Link>
          <Link
            href="/terms-of-suggestions"
            className="px-4 py-2 text-gray-300 hover:text-white transition text-sm"
          >
            Terms
          </Link>
          <Link
            href="/problems"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition text-sm"
          >
            <FileWarning className="w-4 h-4" aria-hidden="true" />
            Report
          </Link>
        </nav>
      </div>
    </header>
  )
}
