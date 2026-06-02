import type { KnowledgeDocumentFormat } from "@/lib/knowledge-base/types";
import type { KnowledgeDocumentInput } from "@/lib/knowledge-base/pipeline/types";

export type DocumentAdapterResult =
  | { ok: true; structuredJson: string }
  | { ok: false; errors: string[] };

export type DocumentAdapter = {
  format: KnowledgeDocumentFormat;
  label: string;
  description: string;
  /** Sprint 26: PDF/DOCX adapters registered; extraction runs offline before upload */
  supportsDirectUpload: boolean;
  parse(input: KnowledgeDocumentInput): DocumentAdapterResult;
};

const OFFLINE_EXTRACTION_MESSAGE =
  "Direct PDF/DOCX parsing is not enabled in Grow OS. Extract concepts offline, then upload structured_text JSON via the ingestion pipeline.";

function parseStructuredText(input: KnowledgeDocumentInput): DocumentAdapterResult {
  const trimmed = input.content.trim();
  if (!trimmed) {
    return { ok: false, errors: ["Empty structured extraction payload."] };
  }
  return { ok: true, structuredJson: trimmed };
}

function parseMarkdownExtraction(input: KnowledgeDocumentInput): DocumentAdapterResult {
  const trimmed = input.content.trim();
  if (!trimmed.startsWith("{")) {
    return {
      ok: false,
      errors: [
        "Markdown adapter expects a JSON extraction envelope in Sprint 26. Use structured_text format or pre-convert markdown blocks to JSON offline.",
      ],
    };
  }
  return { ok: true, structuredJson: trimmed };
}

function rejectBinaryFormat(format: KnowledgeDocumentFormat): DocumentAdapterResult {
  return {
    ok: false,
    errors: [OFFLINE_EXTRACTION_MESSAGE, `Received format: ${format}.`],
  };
}

export const KNOWLEDGE_DOCUMENT_ADAPTERS: DocumentAdapter[] = [
  {
    format: "structured_text",
    label: "Structured JSON",
    description: "Validated batch of extracted knowledge entries (recommended).",
    supportsDirectUpload: true,
    parse: parseStructuredText,
  },
  {
    format: "markdown",
    label: "Markdown",
    description: "Markdown envelope with embedded JSON extraction (no raw chapters stored).",
    supportsDirectUpload: true,
    parse: parseMarkdownExtraction,
  },
  {
    format: "pdf",
    label: "PDF",
    description: "Registered for offline extraction — never stored in Grow OS.",
    supportsDirectUpload: false,
    parse: (input) => rejectBinaryFormat(input.format),
  },
  {
    format: "docx",
    label: "DOCX",
    description: "Registered for offline extraction — never stored in Grow OS.",
    supportsDirectUpload: false,
    parse: (input) => rejectBinaryFormat(input.format),
  },
];

export function getDocumentAdapter(
  format: KnowledgeDocumentFormat,
): DocumentAdapter | undefined {
  return KNOWLEDGE_DOCUMENT_ADAPTERS.find((adapter) => adapter.format === format);
}
