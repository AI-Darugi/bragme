import Link from "next/link";
import { FeedGrid } from "@/components/FeedGrid";
import { RewardedAdGate } from "@/components/RewardedAdGate";
import { MOCK_CARDS } from "@/lib/mock";

export const metadata = {
  title: "Feed",
  description: "Strangers, mid-glow-up. Anonymous brag cards from the internet.",
};

export default function FeedPage() {
  // TODO(step 8/9): replace MOCK_CARDS with cursor-paginated Drizzle query
  // SELECT … FROM cards WHERE is_public ORDER BY created_at DESC LIMIT 20.
  // Wire IntersectionObserver-based load-more on the client.
  const cards = MOCK_CARDS;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-12">
      <header className="mb-8 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          public · anonymous
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Strangers, mid-glow-up.
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Click any card to read the lore behind it.
        </p>
      </header>

      <RewardedAdGate>
        <FeedGrid cards={cards} />
        <p className="mt-12 text-center text-sm text-muted">
          End of feed —{" "}
          <Link
            href="/"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            be the first to spill →
          </Link>
        </p>
      </RewardedAdGate>
    </main>
  );
}
