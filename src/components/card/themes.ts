import type { ColorTheme } from "@/db/schema";

export type ThemeDef = {
  label: string;
  gradient: string;
  text: string;
  subtext: string;
  chip: string;
  divider: string;
};

export const THEMES: Record<ColorTheme, ThemeDef> = {
  sunset: {
    label: "Sunset",
    gradient: "bg-[linear-gradient(135deg,#ff7eb3_0%,#ff758c_45%,#ff8c42_100%)]",
    text: "text-white",
    subtext: "text-white/80",
    chip: "bg-white/15 text-white ring-1 ring-white/20",
    divider: "bg-white/25",
  },
  ocean: {
    label: "Ocean",
    gradient: "bg-[linear-gradient(135deg,#22d3ee_0%,#3b82f6_50%,#312e81_100%)]",
    text: "text-white",
    subtext: "text-cyan-100/85",
    chip: "bg-white/15 text-white ring-1 ring-white/20",
    divider: "bg-white/25",
  },
  forest: {
    label: "Forest",
    gradient: "bg-[linear-gradient(135deg,#bef264_0%,#22c55e_50%,#065f46_100%)]",
    text: "text-white",
    subtext: "text-emerald-50/90",
    chip: "bg-black/20 text-white ring-1 ring-white/20",
    divider: "bg-white/30",
  },
  lavender: {
    label: "Lavender",
    gradient: "bg-[linear-gradient(135deg,#c4b5fd_0%,#a855f7_50%,#4c1d95_100%)]",
    text: "text-white",
    subtext: "text-purple-100/90",
    chip: "bg-white/15 text-white ring-1 ring-white/20",
    divider: "bg-white/25",
  },
  peach: {
    label: "Peach",
    gradient: "bg-[linear-gradient(135deg,#fde68a_0%,#fda4af_50%,#fb7185_100%)]",
    text: "text-zinc-900",
    subtext: "text-zinc-800/80",
    chip: "bg-white/55 text-zinc-900 ring-1 ring-white/70",
    divider: "bg-zinc-900/20",
  },
  mono: {
    label: "Mono",
    gradient: "bg-[linear-gradient(135deg,#27272a_0%,#0a0a0a_60%,#000000_100%)]",
    text: "text-white",
    subtext: "text-zinc-300",
    chip: "bg-white/10 text-white ring-1 ring-white/15",
    divider: "bg-white/20",
  },
};
