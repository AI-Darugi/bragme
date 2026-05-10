import Link from "next/link";

const LINKS = [
  { href: "/glorious", label: "홈" },
  { href: "/glorious/feed", label: "피드" },
  { href: "/glorious/stats", label: "통계" },
];

export function GloriousNav() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-300/30 bg-amber-100/30 px-4 py-3 text-xs text-amber-900 dark:bg-amber-300/10 dark:text-amber-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>🇰🇷 비공개 한국어 미리보기 · 영어 사이트와 동일한 기능</span>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1 hover:bg-amber-300/30"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
