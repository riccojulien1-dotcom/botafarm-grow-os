"use client";

import { useTranslations } from "next-intl";

export function EnvironmentImportPlaceholder() {
  const t = useTranslations("environment.import");

  const sources = [
    t("graphPhoto"),
    t("growlink"),
    t("aroya"),
    t("trolmaster"),
    t("manualActive"),
  ];

  return (
    <div className="bf-inset-panel border border-dashed border-cyan-500/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="bf-lab-label text-cyan-500/80">{t("eyebrow")}</p>
          <p className="mt-2 text-lg font-semibold text-white">{t("title")}</p>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">{t("description")}</p>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/90">
          {t("uiReady")}
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sources.map((source) => (
          <li
            key={source}
            className="rounded-md border border-white/[0.08] bg-black/30 px-2.5 py-1 text-xs text-zinc-500"
          >
            {source}
          </li>
        ))}
      </ul>
    </div>
  );
}
