import { Card } from "@/components/card/Card";
import { MOCK_CARDS } from "@/lib/mock";
import { COLOR_THEMES } from "@/db/schema";

export const metadata = { title: "Theme preview" };

export default function PreviewPage() {
  // Pick the first card per theme for an even gallery.
  const samples = COLOR_THEMES.map(
    (t) => MOCK_CARDS.find((c) => c.colorTheme === t) ?? MOCK_CARDS[0],
  );

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
      <header className="mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          internal · /preview
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Theme & layout preview
        </h1>
        <p className="mt-2 text-sm text-muted">
          One card per theme, both the 9:16 story variant and the 1:1 post
          variant. PNG export is wired separately on the result page.
        </p>
      </header>

      <section className="space-y-16">
        {samples.map((card) => (
          <div key={card.colorTheme}>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {card.colorTheme}
            </h2>
            <div className="flex flex-wrap items-start gap-8">
              <Card data={card} variant="story" />
              <Card data={card} variant="post" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
