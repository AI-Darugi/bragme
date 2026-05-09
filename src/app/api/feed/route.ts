import { listFeed, type FeedSort } from "@/lib/cards-store";
import { COLOR_THEMES, type ColorTheme } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const sortParam = searchParams.get("sort");
  const themeParam = searchParams.get("theme");

  const sort: FeedSort = sortParam === "trending" ? "trending" : "latest";
  const theme: ColorTheme | null =
    themeParam && (COLOR_THEMES as readonly string[]).includes(themeParam)
      ? (themeParam as ColorTheme)
      : null;

  try {
    const page = await listFeed({ cursor, sort, theme });
    return Response.json(page);
  } catch (err) {
    console.error("[feed] db error", err);
    return Response.json(
      { error: { code: "DB_FAILED", message: "Couldn't load the feed." } },
      { status: 500 },
    );
  }
}
