// Simple in-memory rate limiter.
//
// NOTE: This lives in module scope, so limits are enforced per running server
// instance and reset on redeploy/restart. It is meant as a lightweight guard
// against accidental floods (e.g. double-submits) and basic abuse — not as a
// distributed, production-grade rate limiter. For that, back it with a shared
// store such as Upstash Redis.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  // Seconds until the window resets (only meaningful when blocked).
  retryAfter: number
}

/**
 * Records a hit for `key` and reports whether it is within the allowed budget.
 *
 * @param key        Unique bucket identifier (e.g. "create-issue").
 * @param limit      Max number of allowed hits within the window.
 * @param windowMs   Window size in milliseconds.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: limit - entry.count,
    retryAfter: 0,
  }
}

// Opportunistically drop expired buckets so the map doesn't grow unbounded.
function sweep() {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) store.delete(key)
  }
}

// Run a periodic sweep when available (skipped in edge/serverless cold paths).
if (typeof setInterval === 'function') {
  const timer = setInterval(sweep, 60_000)
  // Don't keep the process alive just for cleanup.
  if (typeof timer === 'object' && timer && 'unref' in timer) {
    ;(timer as { unref: () => void }).unref()
  }
}
