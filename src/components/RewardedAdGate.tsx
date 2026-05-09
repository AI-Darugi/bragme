"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bragme:feed-unlocked";
const COUNTDOWN_SECONDS = 5;

type Props = {
  children: React.ReactNode;
};

export function RewardedAdGate({ children }: Props) {
  // SSR + first paint default: locked. Client mount checks sessionStorage.
  const [unlocked, setUnlocked] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || unlocked) return;
    if (seconds <= 0) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mounted, unlocked, seconds]);

  const locked = !unlocked;

  return (
    <>
      <div
        aria-hidden={locked || undefined}
        className={
          locked
            ? "pointer-events-none select-none opacity-40 blur-sm"
            : ""
        }
      >
        {children}
      </div>
      {locked && <Modal seconds={seconds} />}
    </>
  );
}

function Modal({ seconds }: { seconds: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-gate-title"
    >
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-foreground/10 bg-background p-8 text-center shadow-2xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          rewarded ad · mock
        </span>
        <h2 id="ad-gate-title" className="text-2xl font-semibold tracking-tight">
          Earning your peek
        </h2>
        <p className="text-sm text-muted">
          The feed unlocks in a moment. In production this is a real rewarded
          ad — for now it&apos;s a tiny countdown.
        </p>
        <div
          className="font-mono text-5xl font-semibold tabular-nums"
          aria-live="polite"
        >
          {seconds}
        </div>
        {/*
          TODO(ads): replace this mock countdown with the Monetag rewarded
          ad SDK. On the SDK's "ad-completed / rewarded" callback, set
          sessionStorage[bragme:feed-unlocked] = "1" and re-render. Keep
          the no-skip behavior — the user must complete the ad to see
          the feed. Use NEXT_PUBLIC_MONETAG_ZONE_ID to identify the unit.
        */}
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          please don&apos;t close the tab
        </p>
      </div>
    </div>
  );
}
