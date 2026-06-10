// Input validation utilities
const MAX_TITLE_LENGTH = 200
const MAX_BODY_LENGTH = 5000
const MAX_REASON_LENGTH = 1000

// Patterns that indicate an attempt to inject executable markup. We reject
// rather than silently strip so the user understands why their input failed.
const XSS_PATTERNS: RegExp[] = [
  /<\s*script/i,
  /<\s*\/\s*script/i,
  /<\s*iframe/i,
  /<\s*img[^>]*on\w+\s*=/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /on\w+\s*=\s*["']?[^"']*["']?/i, // inline event handlers e.g. onclick=
]

export function containsXss(input: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(input))
}

export function validateIssueTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' }
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title must be under ${MAX_TITLE_LENGTH} characters` }
  }
  if (title.length < 10) {
    return { valid: false, error: 'Title must be at least 10 characters' }
  }
  if (containsXss(title)) {
    return { valid: false, error: 'Title contains disallowed markup or scripts' }
  }
  return { valid: true }
}

export function validateIssueBody(body: string): { valid: boolean; error?: string } {
  if (!body || body.trim().length === 0) {
    return { valid: false, error: 'Description is required' }
  }
  if (body.length > MAX_BODY_LENGTH) {
    return { valid: false, error: `Description must be under ${MAX_BODY_LENGTH} characters` }
  }
  if (body.length < 20) {
    return { valid: false, error: 'Description must be at least 20 characters' }
  }
  if (containsXss(body)) {
    return { valid: false, error: 'Description contains disallowed markup or scripts' }
  }
  return { valid: true }
}

export function validateReason(reason: string): { valid: boolean; error?: string } {
  if (!reason || reason.trim().length === 0) {
    return { valid: false, error: 'Reason is required' }
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return { valid: false, error: `Reason must be under ${MAX_REASON_LENGTH} characters` }
  }
  return { valid: true }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
