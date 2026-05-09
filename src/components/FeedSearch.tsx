"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function FeedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initial);

  function go(next: string) {
    const params = new URLSearchParams(searchParams);
    const trimmed = next.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const qs = params.toString();
    router.push(qs ? `/feed?${qs}` : "/feed");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    go(q);
  }

  function clear() {
    setQ("");
    go("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 w-full">
      <label className="flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-4 py-2 transition-colors focus-within:border-foreground/40">
        <span aria-hidden className="text-base leading-none">
          🔍
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, caption, brag…"
          aria-label="Search the feed"
          maxLength={100}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
        />
        {q && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="rounded-full px-2 text-xs text-muted hover:text-foreground"
          >
            ✕
          </button>
        )}
      </label>
    </form>
  );
}
