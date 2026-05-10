import Link from "next/link";
import { FeedCard } from "@/components/FeedCard";
import type { CardData } from "./Card";
import type { ColorTheme } from "@/db/schema";

type Props = {
  cards: CardData[];
  theme: ColorTheme;
};

export function MoreLikeThis({ cards, theme }: Props) {
  if (cards.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            more like this
          </span>
          <h2 className="mt-1 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
            More <span className="capitalize">{theme}</span> energy.
          </h2>
        </div>
        <Link
          href={`/feed?theme=${theme}`}
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          all {theme} →
        </Link>
      </header>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-4">
        {cards.map((c) => (
          <FeedCard key={c.id} data={c} />
        ))}
      </div>
    </section>
  );
}
