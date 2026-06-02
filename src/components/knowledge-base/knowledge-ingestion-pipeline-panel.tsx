"use client";

import { useActionState, useState } from "react";

import {
  clearStagedIngestionAction,
  stageIngestionBatchAction,
  validateIngestionBatchAction,
  type IngestionActionState,
} from "@/app/admin/brain/ingestion-actions";
import { IRRIGATION_HANDBOOK_SOURCE_ID } from "@/lib/knowledge-base/domains/irrigation-manifest";
import { KNOWLEDGE_DOCUMENT_ADAPTERS } from "@/lib/knowledge-base/pipeline/document-adapters";
import { formatHandbookBatchTemplateJson } from "@/lib/knowledge-base/pipeline/sample-batch-template";
import type { KnowledgePipelineStage } from "@/lib/knowledge-base/pipeline/types";

type PipelineStageRow = {
  stage: KnowledgePipelineStage;
  ready: boolean;
  note: string;
};

type KnowledgeIngestionPipelinePanelProps = {
  stages: PipelineStageRow[];
  stagedEntryCount: number;
  readyForIrrigationBook: boolean;
};

const initialState: IngestionActionState = {};

export function KnowledgeIngestionPipelinePanel({
  stages,
  stagedEntryCount,
  readyForIrrigationBook,
}: KnowledgeIngestionPipelinePanelProps) {
  const [batchJson, setBatchJson] = useState("");
  const [validateState, validateAction, validatePending] = useActionState(
    validateIngestionBatchAction,
    initialState,
  );
  const [stageState, stageAction, stagePending] = useActionState(
    stageIngestionBatchAction,
    initialState,
  );
  const [clearState, clearAction, clearPending] = useActionState(
    clearStagedIngestionAction,
    initialState,
  );

  function loadTemplate() {
    setBatchJson(formatHandbookBatchTemplateJson());
  }

  const lastResult = stageState?.success || stageState?.error
    ? stageState
    : validateState?.success || validateState?.error
      ? validateState
      : clearState;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="bf-section-eyebrow text-cyan-400/80">Sprint 26 pipeline</p>
          <p className="text-sm text-zinc-400">
            {readyForIrrigationBook
              ? "Ready to receive the first Botafarm Irrigation book extraction batch."
              : "Pipeline configuration incomplete."}
          </p>
        </div>
        <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 font-mono text-xs text-emerald-200">
          {stagedEntryCount} staged · book not loaded
        </span>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((row) => (
          <li
            key={row.stage}
            className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                {row.stage}
              </span>
              <span
                className={`font-mono text-[9px] uppercase ${
                  row.ready ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {row.ready ? "ready" : "pending"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">{row.note}</p>
          </li>
        ))}
      </ul>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Document adapters
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {KNOWLEDGE_DOCUMENT_ADAPTERS.map((adapter) => (
            <li
              key={adapter.format}
              className={`rounded border px-2 py-1 text-[11px] ${
                adapter.supportsDirectUpload
                  ? "border-cyan-500/30 text-cyan-200/90"
                  : "border-zinc-700 text-zinc-500"
              }`}
              title={adapter.description}
            >
              {adapter.label}
              {!adapter.supportsDirectUpload ? " · offline" : ""}
            </li>
          ))}
        </ul>
      </div>

      <form className="space-y-3">
        <input type="hidden" name="source_id" value={IRRIGATION_HANDBOOK_SOURCE_ID} />
        <label className="block text-sm text-zinc-300" htmlFor="batch-json">
          Structured extraction batch (JSON)
        </label>
        <textarea
          id="batch-json"
          name="batch_json"
          value={batchJson}
          onChange={(event) => setBatchJson(event.target.value)}
          rows={12}
          placeholder='{ "sourceId": "irrigation-handbook", "batchId": "...", "entries": [...] }'
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200"
        />
        <p className="text-[11px] text-zinc-500">
          Never paste full chapters, PDF text, or proprietary document bodies. Extracted knowledge
          entries only.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadTemplate}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Load empty template
          </button>
          <button
            type="submit"
            formAction={validateAction}
            disabled={validatePending || !batchJson.trim()}
            className="rounded-md border border-cyan-600/50 bg-cyan-950/40 px-3 py-1.5 text-sm text-cyan-100 hover:border-cyan-400 disabled:opacity-50"
          >
            {validatePending ? "Validating…" : "Validate batch"}
          </button>
          <button
            type="submit"
            formAction={stageAction}
            disabled={stagePending || !batchJson.trim()}
            className="rounded-md border border-fuchsia-600/50 bg-fuchsia-950/40 px-3 py-1.5 text-sm text-fuchsia-100 hover:border-fuchsia-400 disabled:opacity-50"
          >
            {stagePending ? "Staging…" : "Validate & stage"}
          </button>
          <button
            type="submit"
            formAction={clearAction}
            disabled={clearPending}
            className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 hover:border-red-500 disabled:opacity-50"
          >
            {clearPending ? "Clearing…" : "Clear staged"}
          </button>
        </div>
      </form>

      {lastResult?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {lastResult.error}
        </p>
      ) : null}
      {lastResult?.success ? (
        <p className="text-sm text-emerald-300/90" role="status">
          {lastResult.success}
          {lastResult.validationSummary ? ` · ${lastResult.validationSummary}` : ""}
        </p>
      ) : null}
    </div>
  );
}
