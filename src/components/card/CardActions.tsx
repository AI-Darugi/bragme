"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import type { CardData, CardVariant } from "./Card";

type Props = {
  data: CardData;
  /** Ref selector for the visible card node, queried via document.querySelector */
  targetSelector: string;
};

const PIXEL_RATIO = 3;

const SHARE_FAILURE = "Couldn't open share. Try the download button instead.";
const DOWNLOAD_FAILURE = "Couldn't bake the PNG. Refresh and try again?";

export function CardActions({ data, targetSelector }: Props) {
  const [busy, setBusy] = useState<CardVariant | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportPng(variant: CardVariant) {
    setBusy(variant);
    setError(null);
    try {
      const node = document.querySelector<HTMLElement>(
        `${targetSelector}[data-variant="${variant}"]`,
      );
      if (!node) throw new Error("Card node not found");

      const dataUrl = await toPng(node, {
        pixelRatio: PIXEL_RATIO,
        cacheBust: true,
        skipFonts: false,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `bragme-${data.id}-${variant}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      setError(DOWNLOAD_FAILURE);
    } finally {
      setBusy(null);
    }
  }

  async function shareLink() {
    setError(null);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/card/${data.id}`
        : `/card/${data.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `BragMe — ${data.title}`,
          text: data.vibeCaption,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setError("Link copied to clipboard");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error(err);
      setError(SHARE_FAILURE);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => exportPng("story")}
          disabled={busy !== null}
          className="flex-1 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm font-medium hover:bg-foreground/10 disabled:opacity-50"
        >
          {busy === "story" ? "Baking…" : "Download 9:16"}
        </button>
        <button
          type="button"
          onClick={() => exportPng("post")}
          disabled={busy !== null}
          className="flex-1 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm font-medium hover:bg-foreground/10 disabled:opacity-50"
        >
          {busy === "post" ? "Baking…" : "Download 1:1"}
        </button>
      </div>
      <button
        type="button"
        onClick={shareLink}
        className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
      >
        Share link
      </button>
      {error && (
        <p className="text-xs text-muted text-center" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
