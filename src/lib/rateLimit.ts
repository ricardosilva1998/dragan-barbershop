// In-process sliding-window rate limiter keyed by IP.
// Suitable for a single-instance deployment (SQLite/Railway single dyno).
// If the app ever scales horizontally, replace with a Redis-backed limiter.

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

// Periodically purge expired entries so the map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) store.delete(key);
  }
}, 60_000);
