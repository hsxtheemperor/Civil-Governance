'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 border border-red-500 text-red-400 rounded-lg font-semibold hover:bg-red-500 hover:text-slate-900 transition text-sm"
    >
      Logout
    </button>
  )
}
