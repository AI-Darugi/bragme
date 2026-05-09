import { FeedCard } from "./FeedCard";
import type { CardData } from "@/components/card/Card";

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
        <FeedCard key={card.id} data={card} />
      ))}
    </div>
  );
}
