import type { BatchClassificationSummary } from "@/lib/knowledge-base/pipeline/classification";
import type {
  KnowledgeDocumentFormat,
  KnowledgeEntryKind,
  KnowledgeIngestionPayload,
  KnowledgeSourceIngestionStatus,
} from "@/lib/knowledge-base/types";

export type { BatchClassificationSummary };

export type KnowledgePipelineStage =
  | "intake"
  | "extract"
  | "validate"
  | "stage"
  | "index"
  | "publish";

export type KnowledgeIngestionJobStatus =
  | "pending"
  | "extracting"
  | "validated"
  | "staged"
  | "failed"
  | "completed";

export type KnowledgeDocumentInput = {
  sourceId: string;
  format: KnowledgeDocumentFormat;
  batchId: string;
  /** Filename for admin traceability only — never stored as downloadable asset */
  fileName?: string;
  /**
   * Structured extraction JSON or markdown/text for adapter parsing.
   * Discarded after pipeline run — never written to catalog or DB.
   */
  content: string;
};

export type KnowledgeExtractionCandidate = {
  kind: KnowledgeEntryKind;
  payload: KnowledgeIngestionPayload;
  extractionNotes?: string;
};

export type KnowledgePipelineExtractionResult = {
  ok: true;
  sourceId: string;
  batchId: string;
  format: KnowledgeDocumentFormat;
  candidates: KnowledgeExtractionCandidate[];
  discardedInputBytes: number;
} | {
  ok: false;
  sourceId: string;
  batchId: string;
  errors: string[];
};

export type KnowledgeBatchValidationRow = {
  index: number;
  entryId: string;
  title: string;
  category: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type KnowledgeBatchValidationReport = {
  sourceId: string;
  batchId: string;
  total: number;
  validCount: number;
  invalidCount: number;
  rows: KnowledgeBatchValidationRow[];
  classificationSummary: BatchClassificationSummary;
  batchWarnings: string[];
};

export type KnowledgeIngestionJob = {
  id: string;
  sourceId: string;
  batchId: string;
  format: KnowledgeDocumentFormat;
  status: KnowledgeIngestionJobStatus;
  stage: KnowledgePipelineStage;
  createdAt: string;
  updatedAt: string;
  entryCount: number;
  validCount: number;
  errorMessage?: string;
};

export type KnowledgeStagedBatch = {
  sourceId: string;
  batchId: string;
  stagedAt: string;
  payloads: KnowledgeIngestionPayload[];
};

export type KnowledgeSourceCoverageReport = {
  sourceId: string;
  sourceTitle: string;
  ingestionStatus: KnowledgeSourceIngestionStatus;
  entriesCreated: number;
  categoriesCovered: string[];
  targetCategories: readonly string[];
  categoryCoveragePercent: number;
  conceptsCovered: number;
  targetConceptCount: number;
  coveragePercent: number;
  metricsCovered: string[];
  phasesCovered: string[];
  feedsMultipleBrainDomains: boolean;
  plannedForSprint?: number;
};
