/**
 * Rate limiter — 60 requests per minute per IP.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 * Falls back to an in-process sliding-window Map when Upstash is not configured.
 */

const WINDOW_MS = 60_000
const MAX_REQUESTS = 60

// ── In-memory fallback ──────────────────────────────────────────────────────

type WindowEntry = { timestamps: number[] }
const memoryStore = new Map<string, WindowEntry>()

function checkMemoryLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const entry = memoryStore.get(ip) ?? { timestamps: [] }

  entry.timestamps = entry.timestamps.filter(t => t > windowStart)

  if (entry.timestamps.length >= MAX_REQUESTS) {
    memoryStore.set(ip, entry)
    return false
  }

  entry.timestamps.push(now)
  memoryStore.set(ip, entry)
  return true
}

// ── Upstash path (lazy-init) ────────────────────────────────────────────────

let upstashLimiter: { limit: (id: string) => Promise<{ success: boolean }> } | null = null

async function getUpstashLimiter() {
  if (upstashLimiter) return upstashLimiter

  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const { Redis }     = await import('@upstash/redis')
  const { Ratelimit } = await import('@upstash/ratelimit')

  const redis = new Redis({ url, token })
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '60 s'),
    analytics: false,
  })
  return upstashLimiter
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function rateLimit(ip: string): Promise<boolean> {
  const limiter = await getUpstashLimiter()
  if (limiter) {
    const { success } = await limiter.limit(ip)
    return success
  }
  return checkMemoryLimit(ip)
}
