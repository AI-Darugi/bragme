import Link from "next/link";
import { FeedCard } from "@/components/FeedCard";
import type { Lineage, LineageItem } from "@/lib/cards-store";

type Props = {
  lineage: Lineage;
};

const RELATION_LABEL: Record<string, string> = {
  refine: "↻ refined",
  translate: "🌐 translated",
};

function relationLabel(relation: string | null): string {
  if (!relation) return "spinoff";
  return RELATION_LABEL[relation] ?? relation;
}

export function LineageView({ lineage }: Props) {
  const hasAny =
    lineage.parent !== null ||
    lineage.siblings.length > 0 ||
    lineage.children.length > 0;
  if (!hasAny) return null;

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          card lineage
        </span>
        <h2 className="mt-1 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          The story behind this card.
        </h2>
        <p className="mt-1 text-sm text-muted">
          Refines and translations branch off the original. Each lands as
          its own card so you can flip between them.
        </p>
      </header>

      <div className="space-y-8">
        {lineage.parent && (
          <LineageGroup
            label="Came from"
            items={[lineage.parent]}
            tone="origin"
          />
        )}
        {lineage.siblings.length > 0 && (
          <LineageGroup
            label="Other versions of the same story"
            items={lineage.siblings}
            tone="sibling"
          />
        )}
        {lineage.children.length > 0 && (
          <LineageGroup
            label="Spinoffs"
            items={lineage.children}
            tone="spinoff"
          />
        )}
      </div>
    </section>
  );
}

function LineageGroup({
  label,
  items,
  tone,
}: {
  label: string;
  items: LineageItem[];
  tone: "origin" | "sibling" | "spinoff";
}) {
  void tone;
  return (
    <div>
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
      </h3>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-4">
        {items.map((item) => (
          <div
            key={item.card.id}
            className="mb-6 break-inside-avoid"
          >
            <span className="mb-2 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {relationLabel(item.relation)}
            </span>
            <Link
              href={`/card/${item.card.id}`}
              className="group block transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="transition-shadow duration-300 group-hover:[&>*]:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]">
                <FeedCard data={item.card} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
