import Link from "next/link";
import { FeedCard } from "@/components/FeedCard";
import { GloriousNav } from "@/components/glorious/GloriousNav";
import { type Reaction } from "@/components/card/Card";
import { THEMES } from "@/components/card/themes";
import { getGlobalStats, type GlobalStats } from "@/lib/cards-store";

export const metadata = {
  title: "통계 · 한국어 미리보기",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const REACTION_TO_TOTAL_KEY: Record<
  Reaction,
  keyof GlobalStats["totalReactions"]
> = {
  cheer: "cheer",
  unhinged: "unhinged",
  facts: "facts",
  "felt-that": "feltThat",
};

const REACTIONS_KO: Array<{
  id: Reaction;
  emoji: string;
  label: string;
}> = [
  { id: "cheer", emoji: "🥂", label: "응원" },
  { id: "unhinged", emoji: "🔥", label: "광기" },
  { id: "facts", emoji: "💯", label: "팩트" },
  { id: "felt-that", emoji: "🥲", label: "공감" },
];

const THEME_LABEL_KO: Record<string, string> = {
  sunset: "선셋",
  ocean: "오션",
  forest: "포레스트",
  lavender: "라벤더",
  peach: "피치",
  mono: "모노",
};

export default async function GloriousStatsPage() {
  const stats = await getGlobalStats();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <GloriousNav />

      <header className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          통계 · 실시간
        </span>
        <h1 className="mt-2 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          숫자로 보는 BragMe.
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          새로고침할 때마다 갱신돼요 — 별도 분석 도구는 안 붙였습니다.
        </p>
      </header>

      <section className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 text-center sm:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          쏟아진 카드
        </p>
        <p className="mt-3 text-7xl font-semibold tabular-nums sm:text-8xl">
          {stats.totalCards.toLocaleString()}
        </p>
        {stats.totalCards === 0 && (
          <p className="mt-4 text-sm text-muted">
            아직 비어있어요 —{" "}
            <Link
              href="/glorious"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              가장 먼저 쏟아내기 →
            </Link>
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-muted">
          받은 반응
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REACTIONS_KO.map((r) => {
            const count = stats.totalReactions[REACTION_TO_TOTAL_KEY[r.id]];
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-center"
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {r.emoji}
                </span>
                <p className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">
                  {count.toLocaleString()}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {r.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {stats.topTheme && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-muted">
            가장 인기 있는 바이브
          </h2>
          <div className="flex items-center gap-5 rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
            <div
              className={[
                "h-16 w-16 shrink-0 rounded-full ring-1 ring-foreground/15",
                THEMES[stats.topTheme.theme].gradient,
              ].join(" ")}
              aria-hidden
            />
            <div>
              <p className="text-2xl font-semibold sm:text-3xl">
                {THEME_LABEL_KO[stats.topTheme.theme] ?? stats.topTheme.theme}
              </p>
              <p className="text-sm text-muted">
                카드 {stats.topTheme.count.toLocaleString()}장 ·{" "}
                <Link
                  href={`/glorious/feed?theme=${stats.topTheme.theme}`}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  전부 보기 →
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {stats.topCard && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-muted">
            가장 응원 받은 카드
          </h2>
          <div className="mx-auto w-full max-w-sm">
            <FeedCard data={stats.topCard} />
          </div>
        </section>
      )}
    </main>
  );
}
