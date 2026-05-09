// In-memory IP rate limiter — ephemeral, per-instance. Fine for the
// pre-DB phase; production should swap to Vercel KV / Upstash Redis so
// the bucket survives a cold start and is shared across regions.

const WINDOW_MS = 60_000;
const buckets = new Map<string, number>();
let lastSweep = 0;

function sweep(now: number) {
  // O(n) cleanup at most once per window — keeps the Map from growing
  // unbounded if traffic spikes and entries don't naturally roll over.
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [key, ts] of buckets) {
    if (now - ts > WINDOW_MS) buckets.delete(key);
  }
}

export type RateResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function checkRate(key: string): RateResult {
  const now = Date.now();
  sweep(now);
  const last = buckets.get(key);
  if (last && now - last < WINDOW_MS) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((WINDOW_MS - (now - last)) / 1000)),
    };
  }
  buckets.set(key, now);
  return { ok: true };
}
