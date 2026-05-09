import Link from "next/link";
import { Card, type CardData } from "@/components/card/Card";

type Props = {
  cards: CardData[];
};

export function FeedGrid({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Empty for now. Be the first to spill.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/card/${card.id}`}
          className="mb-6 block break-inside-avoid transition-transform hover:-translate-y-1"
        >
          <Card data={card} variant="story" watermark={false} />
        </Link>
      ))}
    </div>
  );
}
