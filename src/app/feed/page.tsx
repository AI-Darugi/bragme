import Link from "next/link";
import { FeedFilters } from "@/components/FeedFilters";
import { FeedGrid } from "@/components/FeedGrid";
import { FeedSearch } from "@/components/FeedSearch";
import { RewardedAdGate } from "@/components/RewardedAdGate";
import { listFeed, type FeedSort } from "@/lib/cards-store";
import { COLOR_THEMES, type ColorTheme } from "@/db/schema";

export const metadata = {
  title: "Feed",
  description: "Strangers, mid-glow-up. Anonymous brag cards from the internet.",
};

// Always render fresh — feed must reflect new cards immediately.
export const dynamic = "force-dynamic";

type SearchParams = { sort?: string; theme?: string; q?: string };

function pickSort(value: string | undefined): FeedSort {
  return value === "trending" ? "trending" : "latest";
}

function pickTheme(value: string | undefined): ColorTheme | null {
  if (!value) return null;
  return (COLOR_THEMES as readonly string[]).includes(value)
    ? (value as ColorTheme)
    : null;
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    sort: sortParam,
    theme: themeParam,
    q: qParam,
  } = await searchParams;
  const sort = pickSort(sortParam);
  const theme = pickTheme(themeParam);
  const q = qParam?.trim().slice(0, 100) || null;
  const { cards } = await listFeed({ sort, theme, q });

  const subhead = q
    ? `Showing matches for "${q}".`
    : sort === "trending"
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

      <FeedSearch />
      <FeedFilters sort={sort} theme={theme} />

      <RewardedAdGate>
        <FeedGrid cards={cards} />
        <p className="mt-12 text-center text-sm text-muted">
          {cards.length === 0 ? (
            q ? (
              <>
                Nothing matched <span className="font-mono">{q}</span>. Try a
                softer keyword?
              </>
            ) : theme ? (
              <>
                No {theme} cards yet —{" "}
                <Link
                  href="/"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  be the first →
                </Link>
              </>
            ) : (
              <>
                Nothing here yet —{" "}
                <Link
                  href="/"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  be the first to spill →
                </Link>
              </>
            )
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
