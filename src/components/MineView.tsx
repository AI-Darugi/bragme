"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FeedCard } from "./FeedCard";
import type { CardData } from "./card/Card";
import { listCreatedIds, loadCard } from "@/lib/card-storage";

type State =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "ready"; cards: CardData[] };

export function MineView() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const ids = listCreatedIds();
    const cards: CardData[] = [];
    // Walk newest-first — markCreated appends, so reverse the list.
    for (let i = ids.length - 1; i >= 0; i--) {
      const card = loadCard(ids[i]);
      if (card) cards.push(card);
    }
    setState(cards.length ? { kind: "ready", cards } : { kind: "empty" });
  }, []);

  if (state.kind === "loading") {
    return (
      <p className="py-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
        loading your session…
      </p>
    );
  }

  if (state.kind === "empty") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-base text-muted">
          You haven&apos;t made a card this session.
        </p>
        <Link
          href="/"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          Spill it →
        </Link>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {state.cards.map((card) => (
        <FeedCard key={card.id} data={card} />
      ))}
    </div>
  );
}
