import type {
  KnowledgeIngestionJob,
  KnowledgeStagedBatch,
} from "@/lib/knowledge-base/pipeline/types";
import type { KnowledgeIngestionPayload } from "@/lib/knowledge-base/types";

/** In-memory staging — Sprint 26 prep; replace with Supabase tables when publishing pipeline */
const stagedBatches = new Map<string, KnowledgeStagedBatch>();
const ingestionJobs: KnowledgeIngestionJob[] = [];

function batchKey(sourceId: string, batchId: string) {
  return `${sourceId}::${batchId}`;
}

export function listIngestionJobs(): KnowledgeIngestionJob[] {
  return [...ingestionJobs].sort(
    (left, right) => right.createdAt.localeCompare(left.createdAt),
  );
}

export function getIngestionJob(jobId: string): KnowledgeIngestionJob | undefined {
  return ingestionJobs.find((job) => job.id === jobId);
}

export function recordIngestionJob(job: KnowledgeIngestionJob): void {
  const index = ingestionJobs.findIndex((item) => item.id === job.id);
  if (index >= 0) {
    ingestionJobs[index] = job;
  } else {
    ingestionJobs.unshift(job);
  }
  if (ingestionJobs.length > 50) {
    ingestionJobs.length = 50;
  }
}

export function stageValidatedBatch(
  sourceId: string,
  batchId: string,
  payloads: KnowledgeIngestionPayload[],
): KnowledgeStagedBatch {
  const staged: KnowledgeStagedBatch = {
    sourceId,
    batchId,
    stagedAt: new Date().toISOString(),
    payloads,
  };
  stagedBatches.set(batchKey(sourceId, batchId), staged);
  return staged;
}

export function getStagedBatch(
  sourceId: string,
  batchId: string,
): KnowledgeStagedBatch | undefined {
  return stagedBatches.get(batchKey(sourceId, batchId));
}

export function listStagedBatches(): KnowledgeStagedBatch[] {
  return [...stagedBatches.values()].sort((left, right) =>
    right.stagedAt.localeCompare(left.stagedAt),
  );
}

export function getStagedEntriesForSource(sourceId: string): KnowledgeIngestionPayload[] {
  return listStagedBatches()
    .filter((batch) => batch.sourceId === sourceId)
    .flatMap((batch) => batch.payloads);
}

export function getAllStagedPayloads(): KnowledgeIngestionPayload[] {
  return listStagedBatches().flatMap((batch) => batch.payloads);
}

export function clearStagedBatches(sourceId?: string): number {
  if (!sourceId) {
    const count = stagedBatches.size;
    stagedBatches.clear();
    return count;
  }

  let removed = 0;
  for (const [key, batch] of stagedBatches) {
    if (batch.sourceId === sourceId) {
      stagedBatches.delete(key);
      removed += 1;
    }
  }
  return removed;
}

export function getStagedEntryCount(): number {
  return getAllStagedPayloads().length;
}
