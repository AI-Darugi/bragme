import Link from "next/link";
import type { FeedSort } from "@/lib/cards-store";

type Props = {
  active: FeedSort;
};

const TABS: Array<{ value: FeedSort; label: string; href: string }> = [
  { value: "latest", label: "Latest", href: "/feed" },
  { value: "trending", label: "🔥 Trending", href: "/feed?sort=trending" },
];

export function FeedTabs({ active }: Props) {
  return (
    <nav
      aria-label="Feed sort"
      className="mb-8 inline-flex rounded-full border border-foreground/10 bg-background/60 p-1"
    >
      {TABS.map((t) => {
        const isActive = active === t.value;
        return (
          <Link
            key={t.value}
            href={t.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              isActive
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
