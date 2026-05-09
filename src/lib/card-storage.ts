import type { CardData } from "@/components/card/Card";

const KEY = (id: string) => `bragme:card:${id}`;
const RAW_KEY = (id: string) => `bragme:raw:${id}`;
const CREATED_KEY = "bragme:created";

export function saveCard(card: CardData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY(card.id), JSON.stringify(card));
  } catch {
    // sessionStorage may be disabled / quota exceeded; ignore.
  }
}

export function loadCard(id: string): CardData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY(id));
    if (!raw) return null;
    return JSON.parse(raw) as CardData;
  } catch {
    return null;
  }
}

/**
 * Persist the user's original raw_story alongside the generated card so
 * the refine flow can re-call /api/generate without round-tripping to
 * the database. Only ever holds the active session's stories.
 */
export function saveRawStory(id: string, raw: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RAW_KEY(id), raw);
  } catch {
    // ignore
  }
}

export function loadRawStory(id: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(RAW_KEY(id));
  } catch {
    return null;
  }
}

/**
 * Track which card ids the user actually *created* this session — distinct
 * from cards they merely viewed (those also end up in sessionStorage via
 * CardDetail's hydration write-back). Powers the /mine page.
 */
export function markCreated(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = listCreatedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      sessionStorage.setItem(CREATED_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export function listCreatedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CREATED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}
