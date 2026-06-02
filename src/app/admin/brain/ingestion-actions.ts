"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { IRRIGATION_HANDBOOK_SOURCE_ID } from "@/lib/knowledge-base/domains/irrigation-manifest";
import { formatHandbookBatchTemplateJson } from "@/lib/knowledge-base/pipeline/sample-batch-template";
import {
  clearPipelineStaging,
  runKnowledgeIngestionPipeline,
} from "@/lib/knowledge-base/pipeline/run-pipeline";
import { listIngestionJobs } from "@/lib/knowledge-base/pipeline/staging-store";
import { parseStructuredIngestionBatch } from "@/lib/knowledge-base/pipeline/validate";
import type { KnowledgeDocumentFormat } from "@/lib/knowledge-base/types";

export type IngestionActionState = {
  error?: string;
  success?: string;
  validationSummary?: string;
  jobId?: string;
};

export async function getIngestionTemplateAction(): Promise<{ template: string }> {
  await requireAdmin();
  return { template: formatHandbookBatchTemplateJson() };
}

export async function validateIngestionBatchAction(
  _: IngestionActionState,
  formData: FormData,
): Promise<IngestionActionState> {
  await requireAdmin();

  const content = String(formData.get("batch_json") ?? "").trim();
  if (!content) {
    return { error: "Paste a structured extraction JSON batch." };
  }

  const parsed = parseStructuredIngestionBatch(content);
  if (!parsed.ok) {
    return { error: parsed.errors.join(" ") };
  }

  const pipeline = runKnowledgeIngestionPipeline(
    {
      sourceId: parsed.sourceId,
      batchId: parsed.batchId,
      format: "structured_text",
      content,
    },
    { stageOnSuccess: false },
  );

  if (!pipeline.ok) {
    return {
      error: pipeline.errors.slice(0, 8).join(" "),
      jobId: pipeline.job.id,
    };
  }

  revalidatePath("/admin/brain");
  revalidatePath("/admin/brain/ingestion");

  return {
    success: "Batch validated — no entries staged.",
    validationSummary: `${pipeline.validation.validCount}/${pipeline.validation.total} entries valid`,
    jobId: pipeline.job.id,
  };
}

export async function stageIngestionBatchAction(
  _: IngestionActionState,
  formData: FormData,
): Promise<IngestionActionState> {
  await requireAdmin();

  const content = String(formData.get("batch_json") ?? "").trim();
  const sourceId = String(formData.get("source_id") ?? IRRIGATION_HANDBOOK_SOURCE_ID).trim();

  if (!content) {
    return { error: "Paste a structured extraction JSON batch." };
  }

  const parsed = parseStructuredIngestionBatch(content);
  if (!parsed.ok) {
    return { error: parsed.errors.join(" ") };
  }

  if (parsed.sourceId !== sourceId) {
    return { error: "Batch sourceId does not match selected source." };
  }

  const pipeline = runKnowledgeIngestionPipeline(
    {
      sourceId: parsed.sourceId,
      batchId: parsed.batchId,
      format: "structured_text",
      content,
    },
    { stageOnSuccess: true },
  );

  if (!pipeline.ok) {
    return {
      error: pipeline.errors.slice(0, 8).join(" "),
      jobId: pipeline.job.id,
    };
  }

  revalidatePath("/admin/brain");
  revalidatePath("/admin/brain/ingestion");

  return {
    success: pipeline.message,
    validationSummary: `${pipeline.validation.validCount}/${pipeline.validation.total} entries staged`,
    jobId: pipeline.job.id,
  };
}

export async function clearStagedIngestionAction(
  _: IngestionActionState,
  formData: FormData,
): Promise<IngestionActionState> {
  await requireAdmin();

  const sourceId = String(formData.get("source_id") ?? "").trim() || undefined;
  const removed = clearPipelineStaging(sourceId);

  revalidatePath("/admin/brain");
  revalidatePath("/admin/brain/ingestion");

  return {
    success: sourceId
      ? `Cleared staged batches for ${sourceId} (${removed} batch(es)).`
      : `Cleared all staged batches (${removed} batch(es)).`,
  };
}

export async function getIngestionJobsSnapshotAction() {
  await requireAdmin();
  return listIngestionJobs().slice(0, 10);
}

export async function probeDocumentFormatAction(
  format: KnowledgeDocumentFormat,
): Promise<{ supported: boolean; message: string }> {
  await requireAdmin();

  if (format === "pdf" || format === "docx") {
    return {
      supported: false,
      message:
        "PDF/DOCX adapters are registered for offline extraction only. Upload structured_text JSON after extraction.",
    };
  }

  return {
    supported: true,
    message: `${format} adapter ready for structured extraction envelopes.`,
  };
}
