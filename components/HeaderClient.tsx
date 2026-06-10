'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'

interface HeaderClientProps {
  isLoggedIn?: boolean
  isAdmin?: boolean
  userEmail?: string
}

export default function HeaderClient({
  isLoggedIn = false,
  isAdmin = false,
  userEmail,
}: HeaderClientProps) {
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
            className="px-4 py-2 text-gray-300 hover:text-white transition text-sm"
          >
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

          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-sm"
            >
              Admin
            </Link>
          )}

          <Link
            href="/problems"
            className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition text-sm"
          >
            Report
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700">
              <span className="text-sm text-gray-400">{userEmail}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-slate-900 transition text-sm"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
