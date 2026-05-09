"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockGenerate } from "@/lib/mock";
import { saveCard } from "@/lib/card-storage";

const MAX_STORY = 2000;
const MIN_STORY = 30;
const MAX_NICK = 30;
const NICK_PATTERN = /^[a-zA-Z0-9._-]+$/;

const LOADING_LINES = [
  "Reading your aura…",
  "Distilling the chaos…",
  "Polishing the receipts…",
  "Asking the universe for your color…",
  "Cooking up your main character moment…",
  "Untangling the lore…",
];

const PLACEHOLDER =
  "vented to your group chat for 2 hours? loved your last presentation? hate your boss? cried at a Pixar trailer? type whatever's bouncing around inside.";

const NETWORK_ERROR = "Hmm, our AI is shy right now. Try again?";

function pickLoadingLine(prev?: string): string {
  if (LOADING_LINES.length === 1) return LOADING_LINES[0];
  let next = prev;
  while (!next || next === prev) {
    next = LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];
  }
  return next;
}

export function BragForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [story, setStory] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  function validate(): string | null {
    const nick = nickname.trim();
    if (!nick) return "Pick a nickname.";
    if (nick.length > MAX_NICK)
      return `Nickname is too long (max ${MAX_NICK} characters).`;
    if (!NICK_PATTERN.test(nick))
      return "Nicknames can use letters, numbers, dot, dash, underscore.";

    const raw = story.trim();
    if (raw.length < MIN_STORY)
      return `Tell us a bit more — at least ${MIN_STORY} characters.`;
    if (raw.length > MAX_STORY)
      return `Whoa, that's too much — keep it under ${MAX_STORY} characters.`;
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setGenerating(true);
    setLoadingLine(pickLoadingLine());
    intervalRef.current = setInterval(() => {
      setLoadingLine((prev) => pickLoadingLine(prev));
    }, 1100);

    try {
      // TODO(step 3): replace mockGenerate with `await fetch("/api/generate", ...)`
      await new Promise((r) => setTimeout(r, 1800));
      const card = mockGenerate({
        nickname: nickname.trim(),
        rawStory: story.trim(),
      });
      saveCard(card);
      router.push(`/card/${card.id}`);
    } catch (err) {
      console.error(err);
      setError(NETWORK_ERROR);
      setGenerating(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  const charCount = story.length;
  const overLimit = charCount > MAX_STORY;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-4"
      noValidate
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Nickname
        </span>
        <div className="flex items-center rounded-2xl border border-foreground/15 bg-background px-4 focus-within:border-foreground/40">
          <span className="font-mono text-base text-muted">@</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={generating}
            maxLength={MAX_NICK + 4}
            placeholder="lunatypes"
            className="w-full bg-transparent py-3 pl-1 text-base outline-none placeholder:text-muted/60 disabled:opacity-60"
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Spill it
        </span>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          disabled={generating}
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full resize-y rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base leading-relaxed outline-none placeholder:text-muted/60 focus:border-foreground/40 disabled:opacity-60"
        />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {overLimit ? (
              <span className="text-rose-500">over the limit</span>
            ) : (
              <>min {MIN_STORY} chars · keep it real</>
            )}
          </span>
          <span
            className={`font-mono tabular-nums ${overLimit ? "text-rose-500" : ""}`}
          >
            {charCount} / {MAX_STORY}
          </span>
        </div>
      </label>

      <button
        type="submit"
        disabled={generating}
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {generating ? (
          <>
            <Spinner />
            <span>{loadingLine}</span>
          </>
        ) : (
          "Generate my brag card →"
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="text-center text-sm text-rose-500"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
