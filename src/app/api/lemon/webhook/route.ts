import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lemon Squeezy webhook skeleton.
 *
 * Set up: dashboard → Settings → Webhooks → add endpoint
 *   {YOUR_DOMAIN}/api/lemon/webhook
 *   secret: LEMON_WEBHOOK_SECRET (any random string)
 *   events: order_created (premium card unlock)
 *
 * Custom data flows in via the checkout URL we generate in PremiumCta:
 *   ?checkout[custom][card_id]=<uuid>
 * Lemon echoes that under `event.meta.custom_data.card_id`.
 *
 * TODO when going live: on `order_created`, mark the card premium in DB
 * (add a `premium boolean` column or a separate `premium_unlocks` table)
 * + send the buyer back to /card/[id]?premium=<token> with a token we can
 * verify on the result page.
 */
export async function POST(request: Request) {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { error: { code: "WEBHOOK_NOT_CONFIGURED" } },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-signature");
  if (!signature) {
    return Response.json(
      { error: { code: "MISSING_SIGNATURE" } },
      { status: 401 },
    );
  }

  const body = await request.text();
  if (!verifySignature(secret, signature, body)) {
    return Response.json(
      { error: { code: "BAD_SIGNATURE" } },
      { status: 401 },
    );
  }

  let event: unknown;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json(
      { error: { code: "BAD_BODY" } },
      { status: 400 },
    );
  }

  const eventName =
    (event as { meta?: { event_name?: string } })?.meta?.event_name ?? "?";
  const customData = (event as { meta?: { custom_data?: unknown } })?.meta
    ?.custom_data;

  console.log("[lemon] received", eventName, customData);

  // TODO(premium): switch on eventName, persist premium unlock for card_id.
  return Response.json({ ok: true, received: eventName });
}

function verifySignature(secret: string, signature: string, body: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const digest = hmac.digest("hex");
  if (signature.length !== digest.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(digest, "utf8"),
    );
  } catch {
    return false;
  }
}
