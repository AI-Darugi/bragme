"use client";

type Props = {
  prompt: string;
  label: string;
};

const FILL_EVENT = "bragme:fill";

export function DailyPrompt({ prompt, label }: Props) {
  function fill() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(FILL_EVENT, { detail: prompt }));
    document
      .getElementById("spill")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
        {label}
      </span>
      <button
        type="button"
        onClick={fill}
        className="max-w-md rounded-2xl px-3 py-1.5 text-pretty font-serif text-base italic leading-snug text-foreground/85 transition-colors hover:bg-foreground/5 hover:text-foreground sm:text-lg"
      >
        &ldquo;{prompt}&rdquo;
      </button>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">
        click to use
      </span>
    </div>
  );
}
