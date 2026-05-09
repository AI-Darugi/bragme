// Mock cheer state for the UI-first build. Real version replaces these
// helpers with `fetch("/api/cheer", …)` + a server-side IP rate limit.

const VOTED_KEY = (id: string) => `bragme:cheered:${id}`;
const COUNT_KEY = (id: string) => `bragme:cheers:${id}`;

export function hasCheered(id: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(VOTED_KEY(id)) === "1";
}

export function markCheered(id: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(VOTED_KEY(id), "1");
  } catch {
    // sessionStorage may be disabled / quota exceeded
  }
}

export function loadCheerCount(id: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(COUNT_KEY(id));
  if (raw === null) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function saveCheerCount(id: string, count: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(COUNT_KEY(id), String(count));
  } catch {
    // ignore
  }
}
