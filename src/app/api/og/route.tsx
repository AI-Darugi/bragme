import { ImageResponse } from "next/og";
import { getCardById } from "@/lib/cards-store";
import type { ColorTheme } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ImageResponse-friendly gradients (no Tailwind, no external fonts).
const OG_THEMES: Record<
  ColorTheme,
  { bg: string; text: string; chip: string; accent: string }
> = {
  sunset: {
    bg: "linear-gradient(135deg,#ff7eb3 0%,#ff758c 45%,#ff8c42 100%)",
    text: "#ffffff",
    chip: "rgba(255,255,255,0.18)",
    accent: "rgba(255,255,255,0.85)",
  },
  ocean: {
    bg: "linear-gradient(135deg,#22d3ee 0%,#3b82f6 50%,#312e81 100%)",
    text: "#ffffff",
    chip: "rgba(255,255,255,0.18)",
    accent: "rgba(207,250,254,0.9)",
  },
  forest: {
    bg: "linear-gradient(135deg,#bef264 0%,#22c55e 50%,#065f46 100%)",
    text: "#ffffff",
    chip: "rgba(0,0,0,0.22)",
    accent: "rgba(236,253,245,0.92)",
  },
  lavender: {
    bg: "linear-gradient(135deg,#c4b5fd 0%,#a855f7 50%,#4c1d95 100%)",
    text: "#ffffff",
    chip: "rgba(255,255,255,0.18)",
    accent: "rgba(243,232,255,0.9)",
  },
  peach: {
    bg: "linear-gradient(135deg,#fde68a 0%,#fda4af 50%,#fb7185 100%)",
    text: "#1c1917",
    chip: "rgba(255,255,255,0.55)",
    accent: "rgba(28,25,23,0.75)",
  },
  mono: {
    bg: "linear-gradient(135deg,#27272a 0%,#0a0a0a 60%,#000000 100%)",
    text: "#ffffff",
    chip: "rgba(255,255,255,0.10)",
    accent: "#d4d4d8",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const card = await getCardById(id);
  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  const theme = OG_THEMES[card.colorTheme];
  const chips = card.bragPoints.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: theme.bg,
          color: theme.text,
          padding: 60,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 5,
              fontFamily: "monospace",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            BragMe
          </div>
          <div style={{ fontSize: 96, lineHeight: 1 }}>{card.emoji}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            gap: 24,
            marginTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 1080,
            }}
          >
            {card.title}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {chips.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontSize: 28,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: theme.chip,
                  alignSelf: "flex-start",
                  maxWidth: 1080,
                }}
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 18,
                fontFamily: "monospace",
                opacity: 0.7,
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              @{card.nickname}
            </div>
            <div
              style={{
                fontSize: 30,
                fontStyle: "italic",
                color: theme.accent,
                maxWidth: 900,
              }}
            >
              &ldquo;{card.vibeCaption}&rdquo;
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              opacity: 0.55,
              letterSpacing: 5,
            }}
          >
            BRAGME.APP
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
