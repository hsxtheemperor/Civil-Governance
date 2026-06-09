'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsOfSuggestionsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Suggestions</h1>
          <p className="text-gray-400">
            Guidelines for submitting suggestions, complaints, and improvements to the CJP Community Platform
          </p>
        </div>

        <div className="markdown bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Code of Conduct Suggestions</h2>
            <p className="text-gray-300 mb-3">
              All suggestions for changes to the Code of Conduct will be reviewed by moderators and community members.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Suggestions must be constructive and respectful</li>
              <li>Include clear reasoning for proposed changes</li>
              <li>Reference specific sections of the current CoC</li>
              <li>Avoid duplicate suggestions - check existing ones first</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Acceptance Criteria</h2>
            <p className="text-gray-300 mb-3">
              Suggestions may be accepted and merged into the official CoC if they:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Receive community support through voting</li>
              <li>Are approved by platform moderators</li>
              <li>Don't violate these Terms of Suggestions</li>
              <li>Align with the platform's values and mission</li>
              <li>Include proper documentation and context</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Rejection Reasons</h2>
            <p className="text-gray-300 mb-3">
              Suggestions will be rejected and permanently removed if they:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Contain hate speech, discrimination, or harassment</li>
              <li>Promote illegal activities or violence</li>
              <li>Violate privacy or intellectual property rights</li>
              <li>Are spam, off-topic, or intentionally disruptive</li>
              <li>Contain explicit or adult content</li>
              <li>Attempt to circumvent platform rules or security</li>
              <li>Lack substantive content or clear reasoning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Community Voting</h2>
            <p className="text-gray-300 mb-3">
              All community members can vote on suggestions using reactions. Anonymous voting ensures fair and unbiased evaluation of each proposal.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Use thumbs up (👍) to show support for a suggestion</li>
              <li>Vote is anonymous and cannot be traced to your identity</li>
              <li>You can change or withdraw your vote at any time</li>
              <li>Vote early and vote often - all votes count equally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Moderation and Appeals</h2>
            <p className="text-gray-300 mb-3">
              Moderators review all suggestions and make final decisions on acceptance or rejection. All decisions will be documented publicly with reasons.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Rejected suggestions remain in the repository with rejection reasons</li>
              <li>Appeals can be submitted if you believe a decision was unfair</li>
              <li>Appeals are reviewed by a different moderator</li>
              <li>Final moderation decisions are binding</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Data Retention</h2>
            <p className="text-gray-300 mb-3">
              All suggestions, including rejected ones, are stored permanently on GitHub for transparency and historical record.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Accepted suggestions are merged into the official CoC</li>
              <li>Rejected suggestions remain marked with rejection reason</li>
              <li>Pending suggestions remain open until moderator decision</li>
              <li>All data is publicly accessible and auditable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Prohibited Content</h2>
            <p className="text-gray-300 mb-3">
              The following content is strictly prohibited in all suggestions and will result in permanent removal:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Hate speech or discriminatory language</li>
              <li>Personal attacks, doxxing, or harassment</li>
              <li>Threats or incitement to violence</li>
              <li>Sexual or explicit content</li>
              <li>Commercial spam or self-promotion</li>
              <li>Misinformation or disinformation</li>
              <li>Intellectual property infringement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Changes to These Terms</h2>
            <p className="text-gray-300 mb-3">
              The CJP Community Platform reserves the right to update these Terms of Suggestions at any time. Users will be notified of major changes through the platform.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-600">
            <p className="text-gray-400 text-sm">
              By submitting a suggestion, you agree to abide by these Terms of Suggestions and the Code of Conduct. All submissions are subject to review and moderation.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link
            href="/coc-suggestions"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Browse CoC Suggestions
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
