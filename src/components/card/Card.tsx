import type { ColorTheme } from "@/db/schema";
import { THEMES, type ThemeDef } from "./themes";

export type CardVariant = "story" | "post" | "photocard" | "polaroid";

export type CardData = {
  id: string;
  nickname: string;
  title: string;
  bragPoints: string[];
  vibeCaption: string;
  emoji: string;
  colorTheme: ColorTheme;
  cheersCount: number;
};

type Props = {
  data: CardData;
  variant?: CardVariant;
  watermark?: boolean;
  className?: string;
};

export function Card({
  data,
  variant = "story",
  watermark = true,
  className,
}: Props) {
  const theme = THEMES[data.colorTheme];

  if (variant === "photocard") {
    return (
      <PhotocardLayout
        data={data}
        theme={theme}
        watermark={watermark}
        className={className}
      />
    );
  }
  if (variant === "polaroid") {
    return (
      <PolaroidLayout
        data={data}
        theme={theme}
        watermark={watermark}
        className={className}
      />
    );
  }
  return (
    <DefaultLayout
      data={data}
      theme={theme}
      variant={variant}
      watermark={watermark}
      className={className}
    />
  );
}

type LayoutProps = {
  data: CardData;
  theme: ThemeDef;
  watermark: boolean;
  className?: string;
};

const DEFAULT_ASPECT: Record<"story" | "post", string> = {
  story: "aspect-[9/16] max-w-[420px]",
  post: "aspect-square max-w-[480px]",
};

function DefaultLayout({
  data,
  theme,
  variant,
  watermark,
  className,
}: LayoutProps & { variant: "story" | "post" }) {
  return (
    <article
      data-card-id={data.id}
      data-variant={variant}
      className={[
        "relative w-full overflow-hidden rounded-3xl shadow-2xl",
        theme.gradient,
        theme.text,
        DEFAULT_ASPECT[variant],
        className ?? "",
      ].join(" ")}
    >
      <div className="flex h-full flex-col px-7 py-8 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-80">
            BragMe
          </span>
          <span className="text-3xl leading-none" aria-hidden>
            {data.emoji}
          </span>
        </header>

        <div className="mt-6 flex-1">
          <h2 className="font-sans text-2xl font-semibold leading-[1.15] tracking-tight sm:text-3xl">
            {data.title}
          </h2>

          <ul className="mt-5 space-y-2.5">
            {data.bragPoints.map((point, i) => (
              <li
                key={i}
                className={[
                  "rounded-full px-3.5 py-2 text-sm leading-snug",
                  theme.chip,
                ].join(" ")}
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-6">
          <div className={`h-px w-full ${theme.divider}`} />
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-mono uppercase tracking-[0.2em] ${theme.subtext}`}
              >
                @{data.nickname}
              </p>
              <p
                className={`mt-1 line-clamp-2 text-sm italic leading-snug ${theme.subtext}`}
              >
                &ldquo;{data.vibeCaption}&rdquo;
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${theme.subtext}`}
              >
                cheers
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {data.cheersCount}
              </span>
            </div>
          </div>

          {watermark && (
            <p
              className={`mt-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] ${theme.subtext}`}
            >
              bragme.app
            </p>
          )}
        </footer>
      </div>
    </article>
  );
}

/**
 * K-pop-style photocard: thin white frame around the gradient. The inside
 * is the same content as the story variant but a touch tighter (3 brag
 * points max so it doesn't overflow the frame).
 */
function PhotocardLayout({ data, theme, watermark, className }: LayoutProps) {
  const points = data.bragPoints.slice(0, 3);
  return (
    <article
      data-card-id={data.id}
      data-variant="photocard"
      className={[
        "relative w-full max-w-[420px] aspect-[9/16] rounded-2xl bg-white p-3 shadow-2xl",
        className ?? "",
      ].join(" ")}
    >
      <div
        className={[
          "h-full w-full overflow-hidden rounded-xl",
          theme.gradient,
          theme.text,
        ].join(" ")}
      >
        <div className="flex h-full flex-col px-5 py-6">
          <header className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-80">
              BragMe
            </span>
            <span className="text-2xl leading-none" aria-hidden>
              {data.emoji}
            </span>
          </header>
          <div className="mt-4 flex-1">
            <h2 className="font-sans text-xl font-semibold leading-[1.15] tracking-tight">
              {data.title}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {points.map((point, i) => (
                <li
                  key={i}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs leading-snug",
                    theme.chip,
                  ].join(" ")}
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <footer className="mt-4">
            <div className={`h-px w-full ${theme.divider}`} />
            <div className="mt-3">
              <p
                className={`font-mono text-[9px] uppercase tracking-[0.2em] ${theme.subtext}`}
              >
                @{data.nickname}
              </p>
              <p
                className={`mt-1 line-clamp-2 text-xs italic leading-snug ${theme.subtext}`}
              >
                &ldquo;{data.vibeCaption}&rdquo;
              </p>
            </div>
            {watermark && (
              <p
                className={`mt-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] ${theme.subtext}`}
              >
                bragme.app
              </p>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}

/**
 * Vintage Polaroid: 1:1 gradient "photo" up top, white caption strip
 * below with the vibe caption + handle. Slight rotation gives it the
 * "stuck on a fridge" feel.
 */
function PolaroidLayout({ data, theme, watermark, className }: LayoutProps) {
  return (
    <article
      data-card-id={data.id}
      data-variant="polaroid"
      className={[
        "relative w-full max-w-[440px] -rotate-1 rounded-md bg-white p-3 pb-2 shadow-2xl",
        className ?? "",
      ].join(" ")}
    >
      <div
        className={[
          "aspect-square w-full overflow-hidden rounded-sm",
          theme.gradient,
          theme.text,
        ].join(" ")}
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-7xl leading-none" aria-hidden>
            {data.emoji}
          </span>
          <h2 className="font-sans text-2xl font-semibold leading-[1.1] tracking-tight">
            {data.title}
          </h2>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.3em] ${theme.subtext}`}
          >
            BragMe
          </span>
        </div>
      </div>
      <div className="px-1 pt-3 pb-1 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          @{data.nickname}
        </p>
        <p className="mt-1 text-sm italic leading-snug text-zinc-700">
          &ldquo;{data.vibeCaption}&rdquo;
        </p>
        {watermark && (
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-400">
            bragme.app
          </p>
        )}
      </div>
    </article>
  );
}
