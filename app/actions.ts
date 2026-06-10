'use server'

import {
  getIssues,
  createIssue,
  addReaction,
  getDebateLogs,
  getDebateLogContent,
  getFileContent,
  getCoCSuggestions,
  createCoCsuggestion,
  type GitHubIssue,
  type GitHubFile,
} from '@/lib/github'
import { validateIssueTitle, validateIssueBody, sanitizeInput } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'

// Path to the canonical Code of Conduct in the data repo. The file is named
// with uppercase letters, so referencing it correctly matters (GitHub paths
// are case-sensitive).
const COC_PATH = 'CODE-OF-CONDUCT.md'

// Note: the project compiles with `strict: false`, so discriminated-union
// narrowing on a literal `ok` flag is unreliable. We use a flat shape with
// optional fields and check `result.ok` explicitly at the call site.
export interface ActionResult<T = void> {
  ok: boolean
  data?: T
  error?: string
}

// ── Reads ────────────────────────────────────────────────────────────────

export async function fetchIssues(): Promise<ActionResult<GitHubIssue[]>> {
  try {
    return { ok: true, data: await getIssues() }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to load issues.') }
  }
}

export async function fetchDebateLogs(): Promise<ActionResult<GitHubFile[]>> {
  try {
    return { ok: true, data: (await getDebateLogs()) as GitHubFile[] }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to load debate logs.') }
  }
}

export async function fetchDebateLogContent(
  filename: string
): Promise<ActionResult<string>> {
  try {
    return { ok: true, data: await getDebateLogContent(filename) }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to load debate log.') }
  }
}

export async function fetchCoC(): Promise<ActionResult<string | null>> {
  try {
    return { ok: true, data: await getFileContent(COC_PATH) }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to load Code of Conduct.') }
  }
}

export async function fetchCoCSuggestions(): Promise<ActionResult<GitHubIssue[]>> {
  try {
    return { ok: true, data: await getCoCSuggestions() }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to load suggestions.') }
  }
}

// ── Writes (validated + rate limited) ──────────────────────────────────────

export async function submitProblem(
  title: string,
  description: string
): Promise<ActionResult<{ number: number }>> {
  const titleCheck = validateIssueTitle(title)
  if (!titleCheck.valid) return { ok: false, error: titleCheck.error! }

  const bodyCheck = validateIssueBody(description)
  if (!bodyCheck.valid) return { ok: false, error: bodyCheck.error! }

  const limit = rateLimit('submit-problem', 5, 60_000)
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many submissions. Try again in ${limit.retryAfter}s.`,
    }
  }

  try {
    const issue = await createIssue(
      sanitizeInput(title),
      sanitizeInput(description),
      ['pending']
    )
    return { ok: true, data: { number: issue.number } }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to submit problem.') }
  }
}

export async function submitCoCSuggestion(
  title: string,
  affectedSection: string,
  body: string
): Promise<ActionResult<{ number: number }>> {
  const titleCheck = validateIssueTitle(title)
  if (!titleCheck.valid) return { ok: false, error: titleCheck.error! }

  const bodyCheck = validateIssueBody(body)
  if (!bodyCheck.valid) return { ok: false, error: bodyCheck.error! }

  if (!affectedSection.trim()) {
    return { ok: false, error: 'Please specify which section of the CoC this affects.' }
  }

  const limit = rateLimit('submit-coc-suggestion', 5, 60_000)
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many submissions. Try again in ${limit.retryAfter}s.`,
    }
  }

  try {
    const fullBody = `## Affected Section\n${sanitizeInput(affectedSection)}\n\n## Suggested Change\n${sanitizeInput(body)}`
    const issue = await createCoCsuggestion(sanitizeInput(title), fullBody, '')
    return { ok: true, data: { number: issue.number } }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to create suggestion.') }
  }
}

export async function voteOnIssue(
  issueNumber: number
): Promise<ActionResult<void>> {
  const limit = rateLimit(`vote-${issueNumber}`, 10, 60_000)
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many votes. Try again in ${limit.retryAfter}s.`,
    }
  }

  try {
    await addReaction(issueNumber)
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: errorMessage(err, 'Failed to vote.') }
  }
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}
