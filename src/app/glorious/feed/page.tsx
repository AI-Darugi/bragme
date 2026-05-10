import Link from "next/link";
import { FeedGrid } from "@/components/FeedGrid";
import { FeedFiltersKo } from "@/components/glorious/FeedFiltersKo";
import { GloriousNav } from "@/components/glorious/GloriousNav";
import { RewardedAdGate } from "@/components/RewardedAdGate";
import { listFeed, type FeedSort } from "@/lib/cards-store";
import { COLOR_THEMES, type ColorTheme } from "@/db/schema";

export const metadata = {
  title: "피드 · 한국어 미리보기",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = { sort?: string; theme?: string };

function pickSort(value: string | undefined): FeedSort {
  return value === "trending" ? "trending" : "latest";
}

function pickTheme(value: string | undefined): ColorTheme | null {
  if (!value) return null;
  return (COLOR_THEMES as readonly string[]).includes(value)
    ? (value as ColorTheme)
    : null;
}

export default async function GloriousFeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { sort: sortParam, theme: themeParam } = await searchParams;
  const sort = pickSort(sortParam);
  const theme = pickTheme(themeParam);
  const { cards } = await listFeed({ sort, theme });

  const subhead =
    sort === "trending"
      ? "낯선 사람들이 응원을 멈추지 못한 카드들."
      : "아무 카드나 클릭해서 사연을 읽어보세요.";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-12">
      <GloriousNav />

      <header className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          공개 · 익명
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          낯선 사람들, 한창 빛나는 중.
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{subhead}</p>
        <p className="mt-1 text-xs text-muted/80">
          ※ 카드 본문은 작성자가 입력한 언어(주로 영어)로 표시됩니다.
        </p>
      </header>

      <FeedFiltersKo sort={sort} theme={theme} />

      <RewardedAdGate>
        <FeedGrid cards={cards} />
        <p className="mt-12 text-center text-sm text-muted">
          {cards.length === 0 ? (
            <>
              아직 카드가 없어요 —{" "}
              <Link
                href="/glorious"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                내 첫 카드 만들기 →
              </Link>
            </>
          ) : (
            <>
              {sort === "trending" ? "정상의 카드들." : "끝까지 봤어요."}{" "}
              <Link
                href="/glorious"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                내 카드 추가하기 →
              </Link>
            </>
          )}
        </p>
      </RewardedAdGate>
    </main>
  );
}
