import { listFeed } from "@/lib/cards-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");

  try {
    const page = await listFeed(cursor);
    return Response.json(page);
  } catch (err) {
    console.error("[feed] db error", err);
    return Response.json(
      { error: { code: "DB_FAILED", message: "Couldn't load the feed." } },
      { status: 500 },
    );
  }
}
