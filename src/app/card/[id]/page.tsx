import type { Metadata } from "next";
import { CardDetail } from "@/components/card/CardDetail";
import { CardClientView } from "@/components/card/CardClientView";
import { LineageView } from "@/components/card/LineageView";
import { MoreLikeThis } from "@/components/card/MoreLikeThis";
import { getCardById, getLineage, listFeed } from "@/lib/cards-store";
import { COLOR_THEMES, type ColorTheme } from "@/db/schema";

type RouteParams = { id: string };
type RouteSearch = { premium?: string; theme?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);

  if (!card) {
    return {
      title: "Brag card",
      description: "Spill your mess. We'll find your magic.",
    };
  }

  const description = card.vibeCaption;
  return {
    title: card.title,
    description,
    openGraph: {
      title: card.title,
      description,
      images: [{ url: `/api/og?id=${id}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: card.title,
      description,
      images: [`/api/og?id=${id}`],
    },
  };
}

function pickThemeOverride(value: string | undefined): ColorTheme | null {
  if (!value) return null;
  return (COLOR_THEMES as readonly string[]).includes(value)
    ? (value as ColorTheme)
    : null;
}

export default async function CardPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<RouteSearch>;
}) {
  const { id } = await params;
  const { premium, theme: themeParam } = await searchParams;
  const watermark = !premium;
  const premiumUrl = process.env.LEMON_PREMIUM_URL ?? null;
  const themeOverride = pickThemeOverride(themeParam);

  const baseCard = await getCardById(id);
  // ?theme=ocean → render the card with that gradient regardless of
  // its real colorTheme. Useful for "what if it was a different vibe"
  // shareable previews. The original card in DB is unchanged.
  const card =
    baseCard && themeOverride
      ? { ...baseCard, colorTheme: themeOverride }
      : baseCard;

  const related = card
    ? (await listFeed({ theme: card.colorTheme })).cards
        .filter((c) => c.id !== id)
        .slice(0, 4)
    : [];

  const lineage = card ? await getLineage(id) : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-16 px-6 py-12">
      {card ? (
        <CardDetail
          data={card}
          watermark={watermark}
          premiumUrl={premiumUrl}
        />
      ) : (
        <CardClientView
          id={id}
          watermark={watermark}
          premiumUrl={premiumUrl}
        />
      )}
      {card && lineage && <LineageView lineage={lineage} />}
      {card && related.length > 0 && (
        <MoreLikeThis cards={related} theme={card.colorTheme} />
      )}
    </main>
  );
}
