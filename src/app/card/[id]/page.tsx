import type { Metadata } from "next";
import { CardDetail } from "@/components/card/CardDetail";
import { CardClientView } from "@/components/card/CardClientView";
import { MoreLikeThis } from "@/components/card/MoreLikeThis";
import { getCardById, listFeed } from "@/lib/cards-store";

type RouteParams = { id: string };
type RouteSearch = { premium?: string };

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

export default async function CardPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<RouteSearch>;
}) {
  const { id } = await params;
  const { premium } = await searchParams;
  const watermark = !premium;
  const premiumUrl = process.env.LEMON_PREMIUM_URL ?? null;
  const card = await getCardById(id);

  // Same-theme recommendations — excluded the current card, capped at 4.
  // Skipped when the card isn't in DB/MOCK (e.g. a freshly-generated
  // session-only card whose detail comes from sessionStorage).
  const related = card
    ? (await listFeed({ theme: card.colorTheme })).cards
        .filter((c) => c.id !== id)
        .slice(0, 4)
    : [];

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
      {card && related.length > 0 && (
        <MoreLikeThis cards={related} theme={card.colorTheme} />
      )}
    </main>
  );
}
