import { extractKnowledgeFromDocument } from "@/lib/knowledge-base/pipeline/extract";
import {
  clearStagedBatches,
  getStagedEntryCount,
  recordIngestionJob,
  stageValidatedBatch,
} from "@/lib/knowledge-base/pipeline/staging-store";
import type {
  KnowledgeDocumentInput,
  KnowledgeIngestionJob,
  KnowledgePipelineStage,
} from "@/lib/knowledge-base/pipeline/types";
import {
  validateDocumentInputSize,
  validateIngestionBatch,
} from "@/lib/knowledge-base/pipeline/validate";

function createJobId() {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function updateJob(
  job: KnowledgeIngestionJob,
  patch: Partial<KnowledgeIngestionJob>,
): KnowledgeIngestionJob {
  const next = { ...job, ...patch, updatedAt: new Date().toISOString() };
  recordIngestionJob(next);
  return next;
}

export type PipelineRunResult =
  | {
      ok: true;
      job: KnowledgeIngestionJob;
      validation: ReturnType<typeof validateIngestionBatch>;
      staged: boolean;
      message: string;
    }
  | {
      ok: false;
      job: KnowledgeIngestionJob;
      errors: string[];
    };

export function runKnowledgeIngestionPipeline(
  input: KnowledgeDocumentInput,
  options: { stageOnSuccess?: boolean } = {},
): PipelineRunResult {
  const stageOnSuccess = options.stageOnSuccess ?? false;
  const now = new Date().toISOString();

  let job: KnowledgeIngestionJob = {
    id: createJobId(),
    sourceId: input.sourceId,
    batchId: input.batchId,
    format: input.format,
    status: "pending",
    stage: "intake",
    createdAt: now,
    updatedAt: now,
    entryCount: 0,
    validCount: 0,
  };
  recordIngestionJob(job);

  const sizeErrors = validateDocumentInputSize(input.content);
  if (sizeErrors.length) {
    job = updateJob(job, {
      status: "failed",
      stage: "intake",
      errorMessage: sizeErrors.join(" "),
    });
    return { ok: false, job, errors: sizeErrors };
  }

  job = updateJob(job, { status: "extracting", stage: "extract" });

  const extraction = extractKnowledgeFromDocument(input);
  if (!extraction.ok) {
    job = updateJob(job, {
      status: "failed",
      stage: "extract",
      errorMessage: extraction.errors.join(" "),
    });
    return { ok: false, job, errors: extraction.errors };
  }

  job = updateJob(job, {
    batchId: extraction.batchId,
    entryCount: extraction.candidates.length,
    stage: "validate",
  });

  const payloads = extraction.candidates.map((candidate) => candidate.payload);
  const validation = validateIngestionBatch(payloads, extraction.sourceId);

  job = updateJob(job, {
    validCount: validation.validCount,
    status: validation.invalidCount > 0 ? "failed" : "validated",
    stage: validation.invalidCount > 0 ? "validate" : "stage",
    errorMessage:
      validation.invalidCount > 0
        ? `${validation.invalidCount} entries failed validation`
        : undefined,
  });

  if (validation.invalidCount > 0) {
    return {
      ok: false,
      job,
      errors: validation.rows.flatMap((row) =>
        row.valid ? [] : row.errors.map((error) => `${row.entryId}: ${error}`),
      ),
    };
  }

  let staged = false;
  if (stageOnSuccess) {
    stageValidatedBatch(extraction.sourceId, extraction.batchId, payloads);
    staged = true;
    job = updateJob(job, { status: "staged", stage: "stage" });
  } else {
    job = updateJob(job, { status: "validated", stage: "validate" });
  }

  return {
    ok: true,
    job,
    validation,
    staged,
    message: staged
      ? `Staged ${payloads.length} entries for ${extraction.sourceId} (batch ${extraction.batchId}). Staged total: ${getStagedEntryCount()}.`
      : `Validated ${payloads.length} entries. Enable staging to hold for admin review before publish.`,
  };
}

export function clearPipelineStaging(sourceId?: string) {
  return clearStagedBatches(sourceId);
}

export function getPipelineReadiness() {
  const stages: { stage: KnowledgePipelineStage; ready: boolean; note: string }[] = [
    {
      stage: "intake",
      ready: true,
      note: "PDF, DOCX, Markdown, structured_text registered",
    },
    {
      stage: "extract",
      ready: true,
      note: "structured_text + markdown JSON envelope active",
    },
    { stage: "validate", ready: true, note: "Zod + IP + per-entry Brain classification" },
    { stage: "stage", ready: true, note: "In-memory staging store active" },
    { stage: "index", ready: true, note: "Index builder ready for staged merge" },
    {
      stage: "publish",
      ready: false,
      note: "Awaiting first handbook extraction batch (multi-domain)",
    },
  ];

  return {
    stages,
    stagedEntryCount: getStagedEntryCount(),
    readyForIrrigationBook: true,
  };
}
