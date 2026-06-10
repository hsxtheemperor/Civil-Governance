'use client'

import { useState } from 'react'
import { acceptRequest, rejectRequest } from '@/lib/github'

interface AdminRequestCardProps {
  request: any
  status: 'pending' | 'accepted' | 'rejected'
}

export default function AdminRequestCard({
  request,
  status,
}: AdminRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAccept = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await acceptRequest(request.number, request.title, request.body)
      setSuccess('Request accepted and converted to problem!')
      setTimeout(() => window.location.reload(), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to accept request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await rejectRequest(request.number, rejectionReason)
      setSuccess('Request rejected')
      setTimeout(() => window.location.reload(), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reject request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">
            #{request.number}: {request.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">{request.body}</p>
          <p className="text-gray-400 text-xs">
            Submitted by: {request.user.login} on{' '}
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
            status === 'pending'
              ? 'bg-yellow-900 text-yellow-100'
              : status === 'accepted'
              ? 'bg-green-900 text-green-100'
              : 'bg-red-900 text-red-100'
          }`}
        >
          {status === 'pending'
            ? '⏳ Pending'
            : status === 'accepted'
            ? '✓ Accepted'
            : '✗ Rejected'}
        </span>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded p-3 text-red-100 text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 rounded p-3 text-green-100 text-sm mb-4">
          {success}
        </div>
      )}

      {status === 'pending' && (
        <div className="space-y-3">
          {!showRejectForm ? (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Processing...' : '✓ Accept'}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
              >
                ✗ Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected (terms violation, duplicate, etc.)"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={isLoading || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Processing...' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false)
                    setRejectionReason('')
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-slate-600 text-gray-300 rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'rejected' && request.body?.includes('Admin Decision') && (
        <div className="bg-slate-700 rounded p-4 text-sm text-gray-300">
          <p className="font-semibold text-red-300 mb-2">Rejection Reason:</p>
          <p>{request.body.split('**Reason:** ')[1]?.split('\n')[0]}</p>
        </div>
      )}
    </div>
  )
}
