"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Shortcut = {
  keys: string[];
  label: string;
  /** Pages where this shortcut is active. Empty = everywhere. */
  pages?: string[];
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["?"], label: "Show / hide this panel" },
  { keys: ["Esc"], label: "Close panel · blur input" },
  { keys: ["/"], label: "Focus the search box", pages: ["/feed"] },
  { keys: ["j"], label: "Next card", pages: ["/feed", "/mine", "/"] },
  { keys: ["k"], label: "Previous card", pages: ["/feed", "/mine", "/"] },
  { keys: ["r"], label: "Surprise me · random card" },
  { keys: ["g"], label: "Go home" },
  { keys: ["f"], label: "Go to feed" },
  { keys: ["m"], label: "Go to mine" },
  { keys: ["s"], label: "Go to stats" },
];

const NAV_KEYS: Record<string, string> = {
  g: "/",
  f: "/feed",
  m: "/mine",
  s: "/stats",
};

const FOCUSABLE_FEED_PATHS = ["/", "/feed", "/mine"];

export function KeyboardShortcuts() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);

  // Keep skipping shortcuts on /glorious/login (nothing to navigate, and
  // typing the password shouldn't trigger anything).
  const disabled = pathname.startsWith("/glorious");

  useEffect(() => {
    if (disabled) return;

    function getCardLinks(): HTMLElement[] {
      return Array.from(
        document.querySelectorAll<HTMLElement>('a[href^="/card/"]'),
      );
    }

    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;

      // Allow Escape to bail out of an input.
      if (e.key === "Escape") {
        if (isTyping && target instanceof HTMLElement) target.blur();
        if (helpOpen) setHelpOpen(false);
        return;
      }

      if (isTyping) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // ? toggles help (Shift-/ on US layouts)
      if (e.key === "?") {
        setHelpOpen((o) => !o);
        e.preventDefault();
        return;
      }

      if (helpOpen) return; // hold further shortcuts while help is open

      if (e.key === "/") {
        const search = document.querySelector<HTMLInputElement>(
          'input[type="search"]',
        );
        if (search) {
          search.focus();
          e.preventDefault();
        }
        return;
      }

      if (e.key === "r") {
        e.preventDefault();
        void fetch("/api/random", { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .then((body: { id?: string } | null) => {
            if (body?.id) router.push(`/card/${body.id}`);
          })
          .catch(() => {});
        return;
      }

      if (NAV_KEYS[e.key]) {
        router.push(NAV_KEYS[e.key]);
        e.preventDefault();
        return;
      }

      if (e.key === "j" || e.key === "k") {
        if (!FOCUSABLE_FEED_PATHS.includes(pathname)) return;
        const cards = getCardLinks();
        if (cards.length === 0) return;
        const next =
          e.key === "j"
            ? Math.min(focusIdx + 1, cards.length - 1)
            : Math.max(focusIdx === -1 ? 0 : focusIdx - 1, 0);
        setFocusIdx(next);
        const node = cards[next];
        node.focus();
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pathname, router, focusIdx, helpOpen, disabled]);

  // Reset card focus index whenever route changes.
  useEffect(() => {
    setFocusIdx(-1);
  }, [pathname]);

  if (disabled) return null;

  return (
    <>
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
      <KbdHint />
    </>
  );
}

function HelpOverlay({ onClose }: { onClose: () => void }) {
  const pathname = usePathname() ?? "";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-foreground/10 bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="kbd-title"
            className="font-mono text-xs uppercase tracking-[0.28em] text-muted"
          >
            keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground"
          >
            esc
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s) => {
            const active = !s.pages || s.pages.includes(pathname);
            return (
              <li
                key={s.keys.join(" ")}
                className={[
                  "flex items-center justify-between gap-3 text-sm",
                  active ? "" : "opacity-40",
                ].join(" ")}
              >
                <span className="text-foreground">{s.label}</span>
                <span className="flex gap-1">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="rounded-md border border-foreground/15 bg-foreground/5 px-2 py-0.5 font-mono text-xs"
                    >
                      {k}
                    </kbd>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function KbdHint() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "?", bubbles: true }),
        )
      }
      aria-label="Keyboard shortcuts"
      className="fixed bottom-4 right-4 z-30 hidden h-8 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/80 px-3 text-xs text-muted backdrop-blur transition-colors hover:text-foreground sm:flex"
    >
      <kbd className="rounded-md border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px]">
        ?
      </kbd>
      <span>shortcuts</span>
    </button>
  );
}
