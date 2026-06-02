"use client";

import { useMemo, useState } from "react";

import type { BookMap, BookMapNodeKind } from "@/lib/knowledge-base/book-map/types";

const KIND_STYLES: Record<BookMapNodeKind, string> = {
  concept: "text-cyan-300",
  rule: "text-fuchsia-300",
  action: "text-emerald-300",
  warning: "text-amber-300",
  metric: "text-violet-300",
};

type KnowledgeBookMapTreeProps = {
  bookMap: BookMap;
};

export function KnowledgeBookMapTree({ bookMap }: KnowledgeBookMapTreeProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set([bookMap.chapters[0]?.id].filter(Boolean) as string[]),
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const sortedChapters = useMemo(
    () => [...bookMap.chapters].sort((a, b) => a.order - b.order),
    [bookMap.chapters],
  );

  function toggleChapter(id: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {sortedChapters.map((chapter) => {
        const chapterOpen = expandedChapters.has(chapter.id);
        const nodeCount = chapter.sections.reduce((sum, section) => sum + section.nodes.length, 0);

        return (
          <div
            key={chapter.id}
            className="rounded-lg border border-white/[0.06] bg-black/25"
          >
            <button
              type="button"
              onClick={() => toggleChapter(chapter.id)}
              className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-zinc-500">
                    {chapter.number > 0 ? `Ch.${chapter.number}` : "Bonus"}
                  </span>
                  <ChapterRoleBadge role={chapter.role} />
                  <span className="text-sm font-medium text-zinc-100">{chapter.titleEn}</span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">{chapter.titleFr}</p>
                <p className="mt-1 text-xs text-zinc-600">{chapter.purpose}</p>
              </div>
              <div className="shrink-0 text-right text-xs text-zinc-500">
                <div>p.{chapter.pageStart}{chapter.pageEnd ? `–${chapter.pageEnd}` : ""}</div>
                <div>{nodeCount} nodes</div>
                <div className="mt-1">{chapterOpen ? "−" : "+"}</div>
              </div>
            </button>

            {chapterOpen ? (
              <div className="border-t border-white/[0.04] px-2 pb-2">
                {[...chapter.sections]
                  .sort((a, b) => a.order - b.order)
                  .map((section) => {
                    const sectionKey = `${chapter.id}:${section.id}`;
                    const sectionOpen = expandedSections.has(sectionKey);

                    return (
                      <div key={sectionKey} className="mt-2 rounded-md border border-white/[0.04]">
                        <button
                          type="button"
                          onClick={() => toggleSection(sectionKey)}
                          className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-xs hover:bg-white/[0.02]"
                        >
                          <div>
                            <span className="text-zinc-300">{section.titleEn}</span>
                            <span className="ml-2 text-zinc-600">
                              ({section.nodes.length} · {section.role})
                            </span>
                          </div>
                          <span className="text-zinc-600">{sectionOpen ? "−" : "+"}</span>
                        </button>

                        {sectionOpen ? (
                          <ul className="space-y-1 border-t border-white/[0.04] px-2.5 py-2">
                            {section.nodes.map((node) => (
                              <li
                                key={node.irrId}
                                className="rounded border border-white/[0.04] bg-black/20 px-2 py-1.5"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[10px] text-fuchsia-400/90">
                                    {node.irrId}
                                  </span>
                                  <span
                                    className={`text-[10px] uppercase tracking-wide ${KIND_STYLES[node.kind]}`}
                                  >
                                    {node.kind}
                                  </span>
                                  <span className="text-xs text-zinc-200">{node.label}</span>
                                </div>
                                <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                                  {node.summary}
                                </p>
                                {(node.dependsOn?.length ||
                                  node.relatedMetrics?.length ||
                                  node.targetConceptSlug) && (
                                  <dl className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-600">
                                    {node.dependsOn?.length ? (
                                      <span>requires: {node.dependsOn.join(", ")}</span>
                                    ) : null}
                                    {node.targetConceptSlug ? (
                                      <span>concept: {node.targetConceptSlug}</span>
                                    ) : null}
                                    {node.relatedMetrics?.length ? (
                                      <span>metrics: {node.relatedMetrics.join(", ")}</span>
                                    ) : null}
                                  </dl>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ChapterRoleBadge({ role }: { role: "learning_path" | "reference" }) {
  const styles =
    role === "learning_path"
      ? "border-cyan-500/30 text-cyan-300/90"
      : "border-amber-500/30 text-amber-300/90";

  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase ${styles}`}>
      {role === "learning_path" ? "Learning" : "Reference"}
    </span>
  );
}
