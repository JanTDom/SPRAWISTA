/**
 * Wspólne typy TypeScript dla warstwy wiedzy prawnej Sprawisty.
 * Źródło prawdy: ISAP ELI API (api.sejm.gov.pl) + SAOS API + EUR-Lex SPARQL.
 * Baza nie przechowuje tekstów artykułów — pobiera je na żywo z oficjalnych źródeł.
 */

export type ProvenanceSource =
  | "ISAP_LIVE"
  | "ISAP_CACHED"
  | "SAOS_LIVE"
  | "SAOS_CACHED"
  | "EURLEX_LIVE"
  | "EURLEX_CACHED"
  | "SEED_OFFLINE";

export type ActStatus = "IN_FORCE" | "REPEALED" | "PENDING" | "UNKNOWN";

export type LegalArea =
  | "ZOBOWIAZANIA_CYWILNE"
  | "PRAWO_PROCESOWE"
  | "PRAWO_GOSPODARCZE"
  | "PRAWO_PRACY"
  | "PRAWO_BUDOWLANE"
  | "PRAWO_UPADLOSCIOWE"
  | "PRAWO_PODATKOWE"
  | "PRAWO_BANKOWE"
  | "PRAWO_KARNE_GOSPODARCZE"
  | "OCHRONA_KONKURENCJI"
  | "OCHRONA_DANYCH"
  | "PRAWO_AUTORSKIE"
  | "PRAWO_ZAMOWIEN"
  | "PRAWO_NIERUCHOMOSCI"
  | "PRAWO_RODZINNE"
  | "PRAWO_UE"
  | "ORZECZNICTWO_TSUE";

/**
 * Wpis w katalogu aktów — tylko metadane identyfikacyjne,
 * bez osadzania tekstów artykułów.
 */
export interface StatuteCatalogEntry {
  eli: string;               // "DU/1964/93"
  displayAddress: string;    // "Dz.U. 1964 nr 16 poz. 93"
  title: string;             // pełna nazwa
  shortName: string;         // "KC", "KPC", "UTH" …
  description: string;       // czym jest ten akt dla prawnika
  legalAreas: LegalArea[];
  relatedEuCelexIds: string[];
  /** ELI najnowszego tekstu jednolitego — aktualizowany przez ISAP client */
  latestConsolidatedEli: string | null;
  lastKnownChangeDate: string | null;
}

/** Metadane aktu pobrane na żywo z ISAP */
export interface IsapActMetadata {
  eli: string;
  displayAddress: string;
  title: string;
  status: string;
  inForce: ActStatus;
  changeDate: string | null;
  textHtmlAvailable: boolean;
  latestConsolidatedEli: string | null;
  relatedEuDirectives: Array<{ celexId: string; title: string }>;
  amendments: Array<{ id: string; date: string }>;
  tkJudgments: string[];
  fetchedAt: string;
}

/** Pełny tekst aktu — HTML ze strony ISAP */
export interface IsapActFullText {
  eli: string;
  consolidatedEli: string;
  htmlContent: string;         // surowy HTML z api.sejm.gov.pl
  fetchedAt: string;
  provenanceSource: ProvenanceSource;
}

/** Parametry wyszukiwania orzeczeń w SAOS */
export interface SaosSearchParams {
  all?: string;              // full-text (ZALECANE zamiast keywords)
  courtType?: "COMMON" | "SUPREME" | "CONSTITUTIONAL_TRIBUNAL" | "ADMINISTRATIVE";
  caseNumber?: string;
  judgmentDateFrom?: string;
  judgmentDateTo?: string;
  scChamberName?: string;
  judgmentTypes?: string;
  pageNumber?: number;
  pageSize?: number;
  sortingField?: string;
  sortingDirection?: "ASC" | "DESC";
}

/** Orzeczenie z SAOS */
export interface SaosJudgment {
  saosId: number;
  caseNumbers: string[];
  courtType: string;
  judgmentDate: string;
  judgmentType: string;
  chamberName: string | null;
  divisionName: string | null;
  judges: Array<{ name: string; function: string | null; specialRoles: string[] }>;
  textSnippet: string | null;
  fullTextUrl: string;
  referencedRegulations: Array<{
    journalTitle: string;
    journalYear: number;
    journalEntry: number;
    text: string;
  }>;
  saosDetailUrl: string;
  provenanceSource: ProvenanceSource;
  fetchedAt: string;
}

/** Odpowiedź z SAOS search */
export interface SaosSearchResult {
  items: SaosJudgment[];
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  query: string;
}

/** Dyrektywa / Rozporządzenie UE */
export interface EuLegalAct {
  celexId: string;           // "32011L0007"
  actNumber: string;         // "2011/7/UE"
  type: "Dyrektywa" | "Rozporządzenie" | "Decyzja" | "Umowa";
  titlePl: string;
  shortName: string;
  date: string;
  isInForce: boolean;
  eurLexUrl: string;
  implementingPolishEli?: string;
  summary: string;
  provenanceSource: ProvenanceSource;
}

/** Wyrok TSUE */
export interface CjeuJudgment {
  celexId: string;           // "62006CJ0306"
  caseNumber: string;        // "C-306/06"
  title: string;
  date: string;
  type: "wyrok" | "opinia" | "postanowienie";
  thesis: string;
  practicalRelevance: string;
  keywords: string[];
  curiaUrl: string;
  relatedDirectives: string[];
  provenanceSource: ProvenanceSource;
}

/** Wynik wyszukiwania prawnego (agregat) */
export interface LegalResearchResult {
  query: string;
  polishActs: IsapActMetadata[];
  saosJudgments: SaosSearchResult | null;
  euActs: EuLegalAct[];
  cjeuJudgments: CjeuJudgment[];
  searchedAt: string;
}

/** Stan aktualności przepisu */
export interface ActCurrencyStatus {
  eli: string;
  isUpToDate: boolean;
  apiChangeDate: string | null;
  checkedAt: string;
  warning: string | null;
}
