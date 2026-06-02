import Link from "next/link";

import type { VarietyKnowledgeLink } from "@/lib/cultivation/variety-knowledge-links";

type VarietyKnowledgeLinksPanelProps = {
  varietyName: string;
  links: VarietyKnowledgeLink[];
};

export function VarietyKnowledgeLinksPanel({
  varietyName,
  links,
}: VarietyKnowledgeLinksPanelProps) {
  if (!links.length) {
    return null;
  }

  return (
    <section className="bf-glass space-y-3 rounded-2xl p-5">
      <div>
        <p className="bf-section-eyebrow text-fuchsia-400/80">Knowledge links</p>
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Related concepts
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Curated Botafarm knowledge for {varietyName} — no AI, catalog only.
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.entryId}>
            <Link
              href={`/dashboard/knowledge/${link.entryId}`}
              className="group block rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/15 px-4 py-3 transition hover:border-fuchsia-400/45"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-fuchsia-200/90 group-hover:text-fuchsia-100">
                {link.label}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{link.shortSummary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
