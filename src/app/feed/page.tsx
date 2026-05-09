import Link from "next/link";
import { FeedGrid } from "@/components/FeedGrid";
import { FeedTabs } from "@/components/FeedTabs";
import { RewardedAdGate } from "@/components/RewardedAdGate";
import { listFeed, type FeedSort } from "@/lib/cards-store";

export const metadata = {
  title: "Feed",
  description: "Strangers, mid-glow-up. Anonymous brag cards from the internet.",
};

// Always render fresh — feed must reflect new cards immediately.
export const dynamic = "force-dynamic";

type SearchParams = { sort?: string };

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort: FeedSort = sortParam === "trending" ? "trending" : "latest";
  const { cards } = await listFeed({ sort });

  const subhead =
    sort === "trending"
      ? "The cards strangers couldn't stop cheering for."
      : "Click any card to read the lore behind it.";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-12">
      <header className="mb-6 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          public · anonymous
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Strangers, mid-glow-up.
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{subhead}</p>
      </header>

      <FeedTabs active={sort} />

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
              {sort === "trending"
                ? "Top of the heap."
                : "End of feed —"}{" "}
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
