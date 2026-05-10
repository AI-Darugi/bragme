const SECTIONS: Array<{ icon: string; title: string; body: string }> = [
  {
    icon: "🎨",
    title: "Tweak the vibe",
    body: "테마 6가지 + 이모지 32개 중 골라서 카드 색감/이모지 변경.",
  },
  {
    icon: "📐",
    title: "Card layout (위 탭)",
    body: "18가지 레이아웃 — Default, Photocard, Polaroid, Magazine, Receipt, Notebook, Trading, Stamp, Manga, Scrapbook, Biz card, Report card, Movie poster, Résumé, Ticket, Sticker, Blueprint, Recipe.",
  },
  {
    icon: "↻",
    title: "Try a different angle",
    body: "같은 이야기로 톤 4가지 (🤍 Softer / 🔥 Chaotic / 👑 Confident / 🌑 Cryptic) 새 카드 생성.",
  },
  {
    icon: "🌐",
    title: "Translate",
    body: "9개 언어로 번역 (영어/한국어/일본어/중국어/스페인어/프랑스어/독일어/포르투갈어/이탈리아어). 새 카드로 생성됨.",
  },
  {
    icon: "💾",
    title: "Download / Share",
    body: "선택한 레이아웃 PNG 다운로드, 링크 공유, iframe 임베드 코드.",
  },
  {
    icon: "✨",
    title: "Premium",
    body: "$3 결제 시 워터마크 제거 + 고해상도 다운로드 (Lemon Squeezy).",
  },
  {
    icon: "🥂",
    title: "Reactions",
    body: "4가지 반응 — 응원 🥂 / 광기 🔥 / 팩트 💯 / 공감 🥲. 카드당 IP별 1회씩.",
  },
  {
    icon: "🌳",
    title: "Card lineage",
    body: "이 카드의 부모 (refine/translate 원본), 형제 (같은 부모의 다른 버전), 자식 (이 카드의 spinoff) 표시.",
  },
  {
    icon: "🔗",
    title: "More like this",
    body: "같은 테마 카드 4장 추천 + 해당 테마 피드 링크.",
  },
];

export function CardCheatSheet() {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
      <header className="mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          이 페이지에서 뭐 할 수 있나
        </span>
        <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          카드 디테일 페이지 가이드
        </h2>
        <p className="mt-1 text-xs text-muted">
          ※ 아래 실제 UI는 영어로 표시됩니다. 이 가이드를 옆에 두고 보세요.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <li
            key={s.title}
            className="flex gap-3 rounded-2xl border border-foreground/10 bg-background/50 p-3"
          >
            <span className="text-2xl leading-none" aria-hidden>
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{s.title}</p>
              <p className="mt-1 text-xs leading-snug text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
