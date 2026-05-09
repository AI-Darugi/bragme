import { bumpCheers, getCardById } from "@/lib/cards-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Per IP+card lockout. In-memory, ephemeral, single-region. A user
// who cleared their session can still re-cheer up to once per window
// per server instance — good enough for v1, swap for Vercel KV /
// Upstash + a daily window in production.
const VOTED = new Map<string, number>();
const WINDOW_MS = 24 * 60 * 60 * 1000;

function ipFor(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

function alreadyCheered(ip: string, cardId: string): boolean {
  const key = `${ip}::${cardId}`;
  const ts = VOTED.get(key);
  if (ts && Date.now() - ts < WINDOW_MS) return true;
  VOTED.set(key, Date.now());
  return false;
}

function fail(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    card_id?: unknown;
  } | null;
  if (!body || typeof body.card_id !== "string" || !body.card_id) {
    return fail("BAD_REQUEST", "Missing card_id.", 400);
  }
  const cardId = body.card_id;

  const ip = ipFor(request);
  if (alreadyCheered(ip, cardId)) {
    return fail(
      "ALREADY_CHEERED",
      "You already cheered this one. Spread the love elsewhere.",
      409,
    );
  }

  try {
    // Verify the card exists before bumping (saves a noisy UPDATE on
    // an unknown id, plus gives the client a clean 404).
    const card = await getCardById(cardId);
    if (!card) {
      return fail("NOT_FOUND", "Card not found.", 404);
    }

    const newCount = await bumpCheers(cardId);
    return Response.json({
      cheersCount: newCount ?? card.cheersCount + 1,
    });
  } catch (err) {
    console.error("[cheer] db error", err);
    return fail("DB_FAILED", "Couldn't cheer right now. Try again?", 500);
  }
}
