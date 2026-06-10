// This module talks to the GitHub API using a backend-only token. The
// `server-only` import guarantees it can never be bundled into client code,
// which would otherwise leak GITHUB_PAT to the browser.
import 'server-only'

const REPO = 'hsxtheemperor/Civil-Governance'
const API_BASE = 'https://api.github.com'
const PAT = process.env.GITHUB_PAT

if (!PAT) {
  console.error('[CJP] GITHUB_PAT environment variable is not set')
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  labels: Array<{ name: string }>
  created_at: string
  user: { login: string }
  reactions: { '+1': number }
  state: 'open' | 'closed'
}

export interface GitHubFile {
  name: string
  path: string
  type: string
  download_url?: string
  size?: number
}

export interface GitHubContent {
  content: string
  encoding: string
  sha: string
}

export const getHeaders = () => ({
  'Accept': 'application/vnd.github.v3+json',
  ...(PAT ? { 'Authorization': `Bearer ${PAT}` } : {}),
})

export async function getIssues() {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/issues?state=all&sort=created&direction=desc&labels=cjp-issue`,
      { headers: getHeaders() }
    )

    if (response.status === 401) {
      throw new Error('Invalid or expired token. Please update your PAT in Settings.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to fetch issues')

    return (await response.json()) as GitHubIssue[]
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw error
  }
}

export async function createIssue(
  title: string,
  body: string,
  labels: string[] = []
) {
  try {
    const response = await fetch(`${API_BASE}/repos/${REPO}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, body, labels }),
    })

    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to create issue')

    return (await response.json()) as GitHubIssue
  } catch (error) {
    console.error('Error creating issue:', error)
    throw error
  }
}

export async function addReaction(
  issueNumber: number,
  reaction: '+1' = '+1'
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/issues/${issueNumber}/reactions`,
      {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Accept': 'application/vnd.github.squirrel-girl-preview+json',
        },
        body: JSON.stringify({ content: reaction }),
      }
    )

    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to add reaction')

    return true
  } catch (error) {
    console.error('Error adding reaction:', error)
    throw error
  }
}

export async function getDebateLogs() {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/debates`,
      { headers: getHeaders() }
    )

    if (response.status === 404) {
      return []
    }
    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to fetch debate logs')

    const data = await response.json()
    return Array.isArray(data) ? data.filter(f => f.type === 'file') : []
  } catch (error) {
    console.error('Error fetching debate logs:', error)
    throw error
  }
}

export async function getDebateLogContent(
  filename: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/debates/${filename}`,
      { headers: getHeaders() }
    )

    if (response.status === 404) {
      throw new Error('Debate log not found.')
    }
    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to fetch debate log')

    const data = await response.json() as GitHubContent
    return Buffer.from(data.content, (data.encoding as BufferEncoding) || 'base64').toString('utf-8')
  } catch (error) {
    console.error('Error fetching debate log content:', error)
    throw error
  }
}

export async function getFileContent(
  filepath: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/${filepath}`,
      { headers: getHeaders() }
    )

    if (response.status === 404) {
      return null
    }
    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to fetch file')

    const data = await response.json() as GitHubContent
    return Buffer.from(data.content, (data.encoding as BufferEncoding) || 'base64').toString('utf-8')
  } catch (error) {
    console.error('Error fetching file:', error)
    throw error
  }
}

export async function getCoCSuggestions() {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/issues?state=all&sort=created&direction=desc&labels=coc-suggestion`,
      { headers: getHeaders() }
    )

    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to fetch CoC suggestions')

    return (await response.json()) as GitHubIssue[]
  } catch (error) {
    console.error('Error fetching CoC suggestions:', error)
    throw error
  }
}

export async function createCoCsuggestion(
  title: string,
  body: string,
  currentCoC: string
) {
  try {
    const fullBody = `## Suggested Change\n${body}\n\n## Current CoC Section\n${currentCoC}`
    const response = await fetch(`${API_BASE}/repos/${REPO}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        body: fullBody,
        labels: ['coc-suggestion'],
      }),
    })

    if (response.status === 401) {
      throw new Error('Invalid or expired token.')
    }
    if (response.status === 403) {
      throw new Error('Rate limit reached. Try again in a few minutes.')
    }
    if (!response.ok) throw new Error('Failed to create suggestion')

    return (await response.json()) as GitHubIssue
  } catch (error) {
    console.error('Error creating CoC suggestion:', error)
    throw error
  }
}
