"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockGenerate } from "@/lib/mock";
import { markCreated, saveCard, saveRawStory } from "@/lib/card-storage";

const MAX_STORY = 2000;
const MIN_STORY = 30;

const LOADING_LINES = [
  "당신의 아우라를 읽는 중…",
  "혼란을 정제하는 중…",
  "영수증 광택 내는 중…",
  "당신의 색깔을 우주에 묻는 중…",
  "주인공 모먼트 끓이는 중…",
  "스토리 풀어내는 중…",
  "델루루 강도 측정 중…",
  "혼돈을 바이브로 번역 중…",
  "소프트 런칭 감리 중…",
  "당신을 대신해 콜 잡는 중…",
  "단톡 행간 읽는 중…",
  "주인공 에너지 병에 담는 중…",
];

const PLACEHOLDER =
  "단톡에 2시간 푸념했어? 발표 끝장났어? 상사 미워해? 픽사 예고편에 울었어? 머릿속에 굴러다니는 거 아무거나 적어봐.";

const NETWORK_ERROR = "흠, AI가 부끄러워하고 있어요. 다시 해볼래요?";

function pickLoadingLine(prev?: string): string {
  if (LOADING_LINES.length === 1) return LOADING_LINES[0];
  let next = prev;
  while (!next || next === prev) {
    next = LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];
  }
  return next;
}

type ApiResponse =
  | { card: import("@/components/card/Card").CardData }
  | { error: { code: string; message: string } };

async function callGenerate(
  rawStory: string,
): Promise<import("@/components/card/Card").CardData> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ raw_story: rawStory }),
  });
  if (res.status === 503) {
    const body = (await res.json().catch(() => null)) as ApiResponse | null;
    if (body && "error" in body && body.error.code === "AI_NOT_CONFIGURED") {
      await new Promise((r) => setTimeout(r, 1000));
      return mockGenerate({ rawStory });
    }
  }
  const body = (await res.json().catch(() => null)) as ApiResponse | null;
  if (!res.ok || !body || "error" in body) {
    const msg = body && "error" in body ? body.error.message : NETWORK_ERROR;
    throw new Error(msg);
  }
  return body.card;
}

export function BragFormKo() {
  const router = useRouter();
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

  useEffect(() => {
    function onFill(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setStory(detail);
    }
    window.addEventListener("bragme:fill", onFill);
    return () => window.removeEventListener("bragme:fill", onFill);
  }, []);

  function validate(): string | null {
    const raw = story.trim();
    if (raw.length < MIN_STORY)
      return `조금만 더 적어주세요 — 최소 ${MIN_STORY}자.`;
    if (raw.length > MAX_STORY)
      return `너무 길어요 — ${MAX_STORY}자 이하로.`;
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
      const trimmed = story.trim();
      const card = await callGenerate(trimmed);
      saveCard(card);
      saveRawStory(card.id, trimmed);
      markCreated(card.id);
      router.push(`/card/${card.id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : NETWORK_ERROR);
      setGenerating(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  if (generating) return <GeneratingView line={loadingLine} />;

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
          쏟아내기
        </span>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full resize-y rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base leading-relaxed outline-none placeholder:text-muted/60 focus:border-foreground/40"
        />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {overLimit ? (
              <span className="text-rose-500">글자 수 초과</span>
            ) : (
              <>최소 {MIN_STORY}자 · 솔직하게 · 100% 익명</>
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
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90"
      >
        내 브래그 카드 만들기 →
      </button>

      <p className="text-center text-xs text-muted">
        익명 핸들을 자동으로 만들어 드려요 (예{" "}
        <span className="font-mono">quiet_kettle_42</span>) — 가입 없음,
        이메일 없음, 실명 없음.
      </p>

      {error && (
        <p role="alert" className="text-center text-sm text-rose-500">
          {error}
        </p>
      )}
    </form>
  );
}

function GeneratingView({ line }: { line: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-7">
      <div className="aspect-[9/16] w-[280px] overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/5 via-foreground/10 to-foreground/5 shadow-xl">
        <div className="flex h-full animate-pulse flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-14 rounded-full bg-foreground/20" />
            <div className="h-8 w-8 rounded-full bg-foreground/20" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="h-5 w-5/6 rounded-md bg-foreground/25" />
              <div className="h-5 w-2/3 rounded-md bg-foreground/25" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 w-full rounded-full bg-foreground/15" />
              <div className="h-6 w-5/6 rounded-full bg-foreground/15" />
              <div className="h-6 w-2/3 rounded-full bg-foreground/15" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-1/3 rounded-full bg-foreground/15" />
            <div className="h-3 w-3/5 rounded-full bg-foreground/15" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          카드 제조 중
        </p>
        <p
          className="text-base text-foreground sm:text-lg"
          aria-live="polite"
        >
          {line}
        </p>
      </div>
    </div>
  );
}
