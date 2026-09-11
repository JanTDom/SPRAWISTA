/**
 * Sprawista Domain Models: Akta, Fakty, Statusy Ontologiczne i Cytowania
 */

export type FactStatus =
  | "CLAIM_CLAIMANT"     // Twierdzenie powoda z pozwu (wymaga zaprzeczenia lub dowodu)
  | "CLAIM_DEFENDANT"    // Twierdzenie pozwanego klienta
  | "DOCUMENT_CONTENT"   // Dosłowna treść dokumentu źródłowego (umowa, faktura, protokół)
  | "RULING_FINDING"     // Teza z weryfikowalnego orzeczenia SN/SA
  | "AI_HYPOTHESIS"      // Wstępna hipoteza analityczna systemu
  | "LAWYER_ASSESSMENT"  // Stanowisko merytoryczne pełnomocnika
  | "ACCEPTED_FINDING";  // Zaakceptowany fakt bezsporny

export type DocumentType =
  | "POZEW"
  | "UMOWA"
  | "ANEKS"
  | "FAKTURA_VAT"
  | "FAKTURA_KOREKTA"
  | "PROTOKOL_ODBIORU"
  | "KORESPONDENCJA_EMAIL"
  | "WEZWANIE_DO_ZAPLATY"
  | "POTWIERDZENIE_PRZELEWU"
  | "INNE";

export interface BoundingBox {
  readonly pageNumber: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DocumentChunk {
  readonly id: string;
  readonly documentId: string;
  readonly documentTitle: string;
  readonly pageNumber: number;
  readonly paragraphIndex: number;
  readonly text: string;
  readonly boundingBox?: BoundingBox;
  readonly ocrConfidence?: number; // 0.0 do 1.0 (selektywny OCR)
}

export interface IngestionCompletenessReport {
  readonly totalPages: number;
  readonly digitallyExtractedPages: number;
  readonly ocrPages: number;
  readonly degradedPages: number;
  readonly missingPagesNotes: readonly string[];
  readonly status: "COMPLETE" | "PARTIAL_DEGRADED" | "NEEDS_MANUAL_REVIEW";
}

export interface CaseDocument {
  readonly id: string;
  readonly matterId: string;
  readonly fileName: string;
  readonly documentType: DocumentType;
  readonly fileSizeBytes: number;
  readonly pageCount: number;
  readonly uploadedAt: string;
  readonly completenessReport: IngestionCompletenessReport;
  readonly chunks: readonly DocumentChunk[];
}

export type CitationRelation = "WSPIERA" | "PRZECZY" | "KONTEKST" | "NIEUSTALONY";

export interface CitationLink {
  readonly id: string;
  readonly pleadingSectionId: string;
  readonly sentenceText: string;
  readonly sourceChunkId: string;
  readonly documentId: string;
  readonly documentTitle: string;
  readonly pageNumber: number;
  readonly quotedSnippet: string;
  readonly relation: CitationRelation;
  readonly verifiedByLawyer: boolean;
}

export interface TimelineEvent {
  readonly id: string;
  readonly date: string; // ISO YYYY-MM-DD
  readonly isDateCertain: boolean;
  readonly title: string;
  readonly description: string;
  readonly status: FactStatus;
  readonly sourceChunkId?: string;
  readonly sourceDocumentTitle?: string;
  readonly pageNumber?: number;
}

export interface CaseIssue {
  readonly id: string;
  readonly title: string;
  readonly category: "FORMALNY" | "MATERIALNY" | "ROZLICZENIOWY";
  readonly claimantPosition: string;
  readonly defendantPosition: string;
  readonly supportingProof: string;
  readonly adversaryCounterProof: string;
  readonly missingInformation?: string;
  readonly lawyerDecision?: "PODNIESC" | "ODRZUCIC" | "DO_DECYZJI";
}
