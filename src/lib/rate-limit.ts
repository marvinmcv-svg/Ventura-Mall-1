/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Single-instance (no Redis) — sufficient for a single-server deployment.
 * For multi-instance/multi-server, swap this for @upstash/ratelimit + Redis.
 *
 * Uses a sliding window: tracks request timestamps per key and evicts old ones.
 * Memory is bounded by MAX_KEYS; oldest entries are pruned when the limit is hit.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10000;

interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Check whether a key is within its rate limit.
 * @param key    Identifier (usually IP + route, e.g. "1.2.3.4:login")
 * @param limit  Max requests allowed in the window
 * @param windowMs  Window size in milliseconds
 * @returns ok=false if the limit is exceeded
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  // Prune the map if it's grown too large (cheap LRU-ish guard)
  if (buckets.size > MAX_KEYS) {
    for (const k of buckets.keys()) {
      const b = buckets.get(k);
      if (!b || b.timestamps.length === 0 || b.timestamps[b.timestamps.length - 1] < cutoff) {
        buckets.delete(k);
      }
      if (buckets.size <= MAX_KEYS * 0.8) break;
    }
  }

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  // Drop timestamps outside the window
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    return {
      ok: false,
      limit,
      remaining: 0,
      resetMs: oldest + windowMs - now,
    };
  }

  bucket.timestamps.push(now);
  return {
    ok: true,
    limit,
    remaining: limit - bucket.timestamps.length,
    resetMs: windowMs,
  };
}

/** Extract the client IP from a request, accounting for common proxy headers. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
