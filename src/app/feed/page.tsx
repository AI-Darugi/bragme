import Link from "next/link";
import { FeedGrid } from "@/components/FeedGrid";
import { RewardedAdGate } from "@/components/RewardedAdGate";
import { listFeed } from "@/lib/cards-store";

export const metadata = {
  title: "Feed",
  description: "Strangers, mid-glow-up. Anonymous brag cards from the internet.",
};

// Always render fresh — feed must reflect new cards immediately.
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  // TODO(post-MVP): wire IntersectionObserver client-side load-more
  // hitting /api/feed?cursor=…. For v1 the first page (20 cards) is plenty.
  const { cards } = await listFeed();

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
          {cards.length === 0 ? (
            <>
              Nothing here yet —{" "}
              <Link
                href="/"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                be the first to spill →
              </Link>
            </>
          ) : (
            <>
              End of feed —{" "}
              <Link
                href="/"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                add yours →
              </Link>
            </>
          )}
        </p>
      </RewardedAdGate>
    </main>
  );
}
