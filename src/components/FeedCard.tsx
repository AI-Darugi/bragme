"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, type CardData } from "@/components/card/Card";
import { loadCard } from "@/lib/card-storage";
import { loadCheerCount } from "@/lib/cheer-storage";

type Props = {
  data: CardData;
};

/**
 * Feed thumbnail. SSRs the raw `data.cheersCount` for SEO + first paint,
 * then on mount syncs from sessionStorage so a card the user just cheered
 * (or themed/emoji'd) on /card/[id] reflects back here without a refresh.
 */
export function FeedCard({ data }: Props) {
  const [snapshot, setSnapshot] = useState<CardData>(data);

  useEffect(() => {
    const stored = loadCard(data.id);
    const storedCount = loadCheerCount(data.id);
    setSnapshot({
      ...data,
      colorTheme: stored?.colorTheme ?? data.colorTheme,
      emoji: stored?.emoji ?? data.emoji,
      cheersCount: storedCount ?? data.cheersCount,
    });
  }, [data]);

  return (
    <Link
      href={`/card/${data.id}`}
      className="mb-6 block break-inside-avoid transition-transform hover:-translate-y-1"
    >
      <Card data={snapshot} variant="story" watermark={false} />
    </Link>
  );
}
