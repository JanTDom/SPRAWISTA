/**
 * Serwis badania prawnego — orkiestruje ISAP, SAOS i EUR-Lex.
 *
 * Główna fasada dla UI. Wszystkie zapytania przechodzą przez cache.
 * Nigdy nie rzuca wyjątków do klienta — obsługuje błędy gracefully.
 */
import * as IsapClient from "@/infrastructure/external/isap-client";
import * as SaosClient from "@/infrastructure/external/saos-client";
import * as EurLexClient from "@/infrastructure/external/eurlex-client";
import { STATUTE_CATALOG, findInCatalog, getByLegalArea } from "@/domain/data/statutes/statute-catalog";
import { EU_LAW_CATALOG, CJEU_JUDGMENT_CATALOG } from "@/domain/data/statutes/eu-law-catalog";
import type {
  IsapActMetadata,
  IsapActFullText,
  SaosSearchResult,
  SaosSearchParams,
  EuLegalAct,
  CjeuJudgment,
  LegalResearchResult,
  StatuteCatalogEntry,
  LegalArea,
  ActCurrencyStatus,
} from "@/domain/data/statutes/statute-types";

// ---------------------------------------------------------------------------
// Polskie akty prawne
// ---------------------------------------------------------------------------

/** Katalog wszystkich aktów dostępnych w systemie */
export function getStatuteCatalog(): StatuteCatalogEntry[] {
  return STATUTE_CATALOG;
}

/** Akty z danego obszaru prawa */
export function getActsByArea(area: LegalArea): StatuteCatalogEntry[] {
  return getByLegalArea(area);
}

/** Szybkie wyszukiwanie w katalogu (lokalne) */
export function catalogSearch(query: string): StatuteCatalogEntry[] {
  const q = query.toLowerCase();
  return STATUTE_CATALOG.filter(
    (e) =>
      e.shortName.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.eli.includes(q)
  );
}

/**
 * Pobiera metadane aktu z ISAP (z cache).
 * Nigdy nie rzuca — zwraca null przy błędzie.
 */
export async function getActMetadata(eli: string): Promise<IsapActMetadata | null> {
  try {
    return await IsapClient.getActMetadata(eli);
  } catch {
    return null;
  }
}

/**
 * Pobiera pełny tekst aktu (tekst jednolity HTML) z ISAP.
 * Zwraca null przy błędzie sieci.
 */
export async function getActFullText(eli: string): Promise<IsapActFullText | null> {
  try {
    return await IsapClient.getActFullText(eli);
  } catch {
    return null;
  }
}

/**
 * Wyszukuje akty prawne w ISAP.
 */
export async function searchPolishActs(params: {
  title?: string;
  keyword?: string;
  publisher?: "DU" | "MP";
  limit?: number;
}): Promise<{ items: IsapActMetadata[]; totalCount: number }> {
  try {
    return await IsapClient.searchActs(params);
  } catch {
    return { items: [], totalCount: 0 };
  }
}

/**
 * Sprawdza aktualność zbioru aktów.
 * Zwraca mapę ELI → status.
 */
export async function checkActsCurrency(elis: string[]): Promise<Map<string, ActCurrencyStatus>> {
  const results = new Map<string, ActCurrencyStatus>();
  await Promise.allSettled(
    elis.map(async (eli) => {
      const status = await IsapClient.checkActCurrency(eli, "2026-09-01");
      results.set(eli, status);
    })
  );
  return results;
}

// ---------------------------------------------------------------------------
// Orzecznictwo SN (SAOS)
// ---------------------------------------------------------------------------

/**
 * Wyszukuje orzeczenia SN (Izba Cywilna) po słowach kluczowych.
 */
export async function searchSupremeCivilJudgments(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult | null> {
  try {
    return await SaosClient.searchSupremeCivilChamber(query, pageSize);
  } catch {
    return null;
  }
}

/**
 * Wyszukuje orzeczenia SN (Izba Pracy) po słowach kluczowych.
 */
export async function searchSupremeLaborJudgments(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult | null> {
  try {
    return await SaosClient.searchSupremeLaborChamber(query, pageSize);
  } catch {
    return null;
  }
}

/**
 * Szerokie wyszukiwanie orzeczeń — wszystkie sądy i izby.
 */
export async function searchAllJudgments(
  params: SaosSearchParams
): Promise<SaosSearchResult | null> {
  try {
    return await SaosClient.searchJudgments(params);
  } catch {
    return null;
  }
}

/**
 * Wyszukuje orzeczenie po sygnaturze.
 */
export async function findJudgmentByCaseNumber(
  caseNumber: string
): Promise<SaosSearchResult | null> {
  try {
    const j = await SaosClient.findByCaseNumber(caseNumber);
    if (!j) return null;
    return { items: [j], totalResults: 1, pageNumber: 0, pageSize: 1, query: caseNumber };
  } catch {
    return null;
  }
}

/**
 * Wyszukuje orzeczenia TK.
 */
export async function searchConstitutionalJudgments(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult | null> {
  try {
    return await SaosClient.searchConstitutionalTribunal(query, pageSize);
  } catch {
    return null;
  }
}

/**
 * Wyszukuje orzeczenia NSA.
 */
export async function searchAdministrativeJudgments(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult | null> {
  try {
    return await SaosClient.searchNSA(query, pageSize);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Prawo UE i TSUE
// ---------------------------------------------------------------------------

/** Zwraca katalog dyrektyw i rozporządzeń UE */
export function getEuLawCatalog(): EuLegalAct[] {
  return EU_LAW_CATALOG;
}

/** Wyszukuje w seed katalogu UE */
export function searchEuLaw(query: string): EuLegalAct[] {
  return EurLexClient.searchEuCatalog(query);
}

/** Pobiera pełny tekst aktu UE (HTML) */
export async function getEuActText(celexId: string): Promise<string | null> {
  try {
    return await EurLexClient.getEuActText(celexId);
  } catch {
    return null;
  }
}

/** Wyroki TSUE z seed katalogu */
export function getSeedCjeuJudgments(): CjeuJudgment[] {
  return CJEU_JUDGMENT_CATALOG;
}

/** Wyszukuje wyroki TSUE (seed + SPARQL fallback) */
export async function searchCjeuJudgments(
  keywords: string[],
  limit = 10
): Promise<CjeuJudgment[]> {
  return EurLexClient.searchCjeuJudgments({ keywords, limit });
}

/** Dyrektywy UE powiązane z polskim aktem */
export function getRelatedEuLaw(polishEli: string): EuLegalAct[] {
  return EurLexClient.getEuActsForPolishAct(polishEli);
}

// ---------------------------------------------------------------------------
// Kompleksowe wyszukiwanie (agregat)
// ---------------------------------------------------------------------------

/**
 * Przeszukuje jednocześnie: katalog polskich aktów, SAOS (SN Cywilna),
 * katalog UE i seed TSUE.
 *
 * Szybkie — używa cache i seed przed API.
 */
export async function comprehensiveLegalSearch(query: string): Promise<LegalResearchResult> {
  const [saosResult, euActs, cjeuJudgments, polishActsSearch] = await Promise.all([
    searchSupremeCivilJudgments(query, 5),
    Promise.resolve(EurLexClient.searchEuCatalog(query)),
    EurLexClient.searchCjeuJudgments({ keywords: query.split(" "), limit: 5 }),
    searchPolishActs({ title: query, limit: 5 }),
  ]);

  return {
    query,
    polishActs: polishActsSearch.items,
    saosJudgments: saosResult,
    euActs,
    cjeuJudgments,
    searchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Linki
// ---------------------------------------------------------------------------

export const buildIsapUrl = IsapClient.buildIsapPageUrl;
export const buildIsapPdfUrl = IsapClient.buildIsapPdfUrl;
export const buildEurLexUrl = EurLexClient.buildEurLexUrl;
export const buildCuriaUrl = EurLexClient.buildCuriaUrl;
