import type { CardData } from "@/components/card/Card";

const KEY = (id: string) => `bragme:card:${id}`;

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
