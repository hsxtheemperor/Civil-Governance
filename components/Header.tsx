import { createClient } from '@/lib/supabase/server'
import HeaderClient from '@/components/HeaderClient'

export default async function HeaderWithAuth() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    isAdmin = profile?.is_admin ?? false
  }

  return (
    <HeaderClient
      isLoggedIn={!!user}
      isAdmin={isAdmin}
      userEmail={user?.email}
    />
  )
}
