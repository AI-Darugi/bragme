"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const STORAGE_KEY = "bragme:theme";

const ICON: Record<Theme, string> = {
  system: "🖥️",
  light: "☀️",
  dark: "🌙",
};
const LABEL: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return "system";
}

function apply(theme: Theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("theme-light", "theme-dark");
  try {
    if (theme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.classList.add(`theme-${theme}`);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readStored());
    setMounted(true);
  }, []);

  function cycle() {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    apply(next);
  }

  // Avoid hydration mismatch — server renders the system icon; once we
  // know the actual stored theme, swap.
  const display = mounted ? theme : "system";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${LABEL[display]} (click to cycle)`}
      title={`Theme: ${LABEL[display]}`}
      className="flex items-center justify-center rounded-full px-3 py-1.5 text-sm hover:bg-foreground/5"
    >
      <span aria-hidden className="text-base leading-none">
        {ICON[display]}
      </span>
    </button>
  );
}
