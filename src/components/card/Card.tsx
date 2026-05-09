import type { ColorTheme } from "@/db/schema";
import { THEMES } from "./themes";

export type CardVariant = "story" | "post";

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

const VARIANT_CLASS: Record<CardVariant, string> = {
  story: "aspect-[9/16] max-w-[420px]",
  post: "aspect-square max-w-[480px]",
};

export function Card({
  data,
  variant = "story",
  watermark = true,
  className,
}: Props) {
  const theme = THEMES[data.colorTheme];

  return (
    <article
      data-card-id={data.id}
      data-variant={variant}
      className={[
        "relative w-full overflow-hidden rounded-3xl shadow-2xl",
        theme.gradient,
        theme.text,
        VARIANT_CLASS[variant],
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
              <p className={`text-xs font-mono uppercase tracking-[0.2em] ${theme.subtext}`}>
                @{data.nickname}
              </p>
              <p
                className={`mt-1 line-clamp-2 text-sm italic leading-snug ${theme.subtext}`}
              >
                &ldquo;{data.vibeCaption}&rdquo;
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${theme.subtext}`}>
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
