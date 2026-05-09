import { getCardById } from "@/lib/cards-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  try {
    const card = await getCardById(id);
    if (!card) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Card not found." } },
        { status: 404 },
      );
    }
    return Response.json({ card });
  } catch (err) {
    console.error("[card] db error", err);
    return Response.json(
      { error: { code: "DB_FAILED", message: "Couldn't load that card." } },
      { status: 500 },
    );
  }
}
