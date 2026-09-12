/**
 * Serwis odczytu i parsowania realnych dokumentów wgrywanych przez prawnika
 * Obsługuje pliki PDF, DOCX, TXT oraz bezpośrednie wklejanie tekstu akt.
 */

import { CaseDocument, DocumentChunk, DocumentType } from "../models/evidence";

export interface ParseDocumentInput {
  fileName: string;
  fileType: string;
  rawContent: string;
}

/**
 * Przekształca surową treść dokumentu na ustrukturyzowany CaseDocument
 * z podziałem na strony, akapity i unikalne identyfikatory fragmentów (chunkId).
 */
export function parseRawTextToDocument(
  documentId: string,
  input: ParseDocumentInput
): CaseDocument {
  const normalizedText = input.rawContent.replace(/\r\n/g, "\n");
  
  // Dzielimy na wirtualne karty/strony (jeśli są znaczniki stron lub co ~3000 znaków)
  const rawPages = normalizedText.includes("[STRONA_")
    ? normalizedText.split(/\[STRONA_\d+\]/)
    : splitIntoPages(normalizedText);

  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  rawPages.forEach((pageContent, pageIdx) => {
    const pageNumber = pageIdx + 1;
    // Dzielenie na akapity
    const paragraphs = pageContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length === 0 && pageContent.trim().length > 0) {
      chunks.push({
        id: `${documentId}-p${pageNumber}-c${chunkCounter++}`,
        documentId,
        documentTitle: input.fileName,
        pageNumber,
        paragraphIndex: 1,
        text: pageContent.trim(),
        ocrConfidence: 1.0,
      });
    } else {
      paragraphs.forEach((para, paraIdx) => {
        chunks.push({
          id: `${documentId}-p${pageNumber}-c${chunkCounter++}`,
          documentId,
          documentTitle: input.fileName,
          pageNumber,
          paragraphIndex: paraIdx + 1,
          text: para,
          ocrConfidence: 1.0,
        });
      });
    }
  });

  const totalPages = Math.max(1, rawPages.length);

  return {
    id: documentId,
    matterId: "active-matter",
    fileName: input.fileName,
    documentType: inferDocumentType(input.fileName, input.fileType),
    fileSizeBytes: new Blob([input.rawContent]).size,
    pageCount: totalPages,
    uploadedAt: new Date().toISOString(),
    chunks,
    completenessReport: {
      totalPages,
      digitallyExtractedPages: totalPages,
      ocrPages: 0,
      degradedPages: 0,
      missingPagesNotes: [],
      status: "COMPLETE",
    },
  };
}

function splitIntoPages(text: string, charsPerPage = 2500): string[] {
  if (!text || text.length <= charsPerPage) return [text];
  const pages: string[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const end = Math.min(cursor + charsPerPage, text.length);
    pages.push(text.slice(cursor, end));
    cursor = end;
  }
  return pages;
}

function inferDocumentType(fileName: string, mimeOrType: string): DocumentType {
  const lower = (fileName + " " + mimeOrType).toLowerCase();
  if (lower.includes("pozew")) return "POZEW";
  if (lower.includes("umow")) return "UMOWA";
  if (lower.includes("aneks")) return "ANEKS";
  if (lower.includes("korekt")) return "FAKTURA_KOREKTA";
  if (lower.includes("faktur") || lower.includes("vat")) return "FAKTURA_VAT";
  if (lower.includes("protok")) return "PROTOKOL_ODBIORU";
  if (lower.includes("wezwan")) return "WEZWANIE_DO_ZAPLATY";
  if (lower.includes("mail") || lower.includes("email")) return "KORESPONDENCJA_EMAIL";
  if (lower.includes("przelew") || lower.includes("platn")) return "POTWIERDZENIE_PRZELEWU";
  return "INNE";
}
