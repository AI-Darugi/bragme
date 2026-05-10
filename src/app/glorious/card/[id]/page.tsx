import type { Metadata } from "next";
import { CardDetail } from "@/components/card/CardDetail";
import { CardClientView } from "@/components/card/CardClientView";
import { LineageView } from "@/components/card/LineageView";
import { MoreLikeThis } from "@/components/card/MoreLikeThis";
import { CardCheatSheet } from "@/components/glorious/CardCheatSheet";
import { GloriousNav } from "@/components/glorious/GloriousNav";
import { getCardById, getLineage, listFeed } from "@/lib/cards-store";

type RouteParams = { id: string };
type RouteSearch = { premium?: string };

export const metadata: Metadata = {
  title: "카드 상세 · 한국어 미리보기",
  robots: { index: false, follow: false },
};

export default async function GloriousCardPage({
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

  const related = card
    ? (await listFeed({ theme: card.colorTheme })).cards
        .filter((c) => c.id !== id)
        .slice(0, 4)
    : [];
  const lineage = card ? await getLineage(id) : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-12 px-6 py-12">
      <GloriousNav />

      <CardCheatSheet />

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
