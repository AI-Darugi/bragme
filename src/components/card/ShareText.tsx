"use client";

import { useMemo, useState } from "react";
import type { CardData } from "./Card";

type Props = {
  data: CardData;
};

function buildShareText(data: CardData): string {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://bragme.app";
  return [
    `${data.emoji} ${data.title}`,
    `“${data.vibeCaption}”`,
    `${baseUrl}/card/${data.id}`,
  ].join("\n");
}

export function ShareText({ data }: Props) {
  const text = useMemo(() => buildShareText(data), [data]);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard is best-effort; fail silently if denied.
    }
  }

  return (
    <div className="space-y-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Share text
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background transition-opacity hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
        {text}
      </pre>
    </div>
  );
}
