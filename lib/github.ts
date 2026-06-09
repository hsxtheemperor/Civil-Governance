const REPO = 'hsxtheemperor/Code-Of-Conduct'
const API_BASE = 'https://api.github.com'

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  labels: Array<{ name: string }>
  created_at: string
  user: { login: string }
  reactions: { '+1': number }
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
}

export const getHeaders = (pat: string | null) => ({
  'Accept': 'application/vnd.github.v3+json',
  ...(pat ? { 'Authorization': `Bearer ${pat}` } : {}),
})

export async function getIssues(pat: string | null) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/issues?state=open&sort=created&direction=desc`,
      { headers: getHeaders(pat) }
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
  pat: string,
  title: string,
  body: string
) {
  try {
    const response = await fetch(`${API_BASE}/repos/${REPO}/issues`, {
      method: 'POST',
      headers: getHeaders(pat),
      body: JSON.stringify({ title, body }),
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
  pat: string,
  issueNumber: number,
  reaction: '+1'
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/issues/${issueNumber}/reactions`,
      {
        method: 'POST',
        headers: {
          ...getHeaders(pat),
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

export async function getDebateLogs(pat: string | null) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/debate-logs`,
      { headers: getHeaders(pat) }
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
  pat: string | null,
  filename: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/debate-logs/${filename}`,
      { headers: getHeaders(pat) }
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
    return Buffer.from(data.content, data.encoding).toString('utf-8')
  } catch (error) {
    console.error('Error fetching debate log content:', error)
    throw error
  }
}

export async function getFileContent(
  pat: string | null,
  filepath: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/${filepath}`,
      { headers: getHeaders(pat) }
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
    return Buffer.from(data.content, data.encoding).toString('utf-8')
  } catch (error) {
    console.error('Error fetching file:', error)
    throw error
  }
}
