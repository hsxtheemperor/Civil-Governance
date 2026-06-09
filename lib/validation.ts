// Input validation utilities
const MAX_TITLE_LENGTH = 200
const MAX_BODY_LENGTH = 5000
const MAX_REASON_LENGTH = 1000

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
