import { createClient } from '@/lib/supabase/server'
import { getRequests } from '@/lib/github'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminRequestCard from '@/components/AdminRequestCard'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch pending requests
  let requests = []
  let error = null

  try {
    requests = await getRequests()
  } catch (err: any) {
    error = err.message
  }

  const pendingRequests = requests.filter(
    (r) => !r.labels.some((l) => l.name === 'accepted' || l.name === 'rejected')
  )
  const acceptedRequests = requests.filter((r) =>
    r.labels.some((l) => l.name === 'accepted')
  )
  const rejectedRequests = requests.filter((r) =>
    r.labels.some((l) => l.name === 'rejected')
  )

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Review and approve problem submissions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Logged in as: {user.email}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 mb-8">
            {error}
          </div>
        )}

        {/* Pending Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Pending Requests ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
              <p className="text-gray-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <AdminRequestCard
                  key={request.id}
                  request={request}
                  status="pending"
                />
              ))}
            </div>
          )}
        </section>

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-green-400">
              Accepted ({acceptedRequests.length})
            </h2>
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <AdminRequestCard
                  key={request.id}
                  request={request}
                  status="accepted"
                />
              ))}
            </div>
          </section>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-red-400">
              Rejected ({rejectedRequests.length})
            </h2>
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <AdminRequestCard
                  key={request.id}
                  request={request}
                  status="rejected"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
