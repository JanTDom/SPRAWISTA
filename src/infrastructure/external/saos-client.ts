/**
 * Klient SAOS API — www.saos.org.pl/api
 *
 * Zweryfikowane live 12.09.2026:
 *   GET /api/search/judgments?all=...&courtType=...&pageSize=...  → lista orzeczeń
 *   GET /api/judgments/{id}                                       → szczegóły orzeczenia
 *
 * KLUCZOWE: używaj parametru `all=` (full-text) zamiast `keywords=`.
 * `keywords=` zwraca 0 wyników — to tagi redakcyjne, rzadko przypisywane.
 * `all=odsetki ustawowe` → 5966 wyników ✅
 *
 * Cache TTL: 6h dla wyszukiwań, 30 dni dla szczegółów orzeczeń.
 */
import { cacheGet, cacheSet } from "@/infrastructure/cache/legal-knowledge-cache";
import type { SaosSearchParams, SaosSearchResult, SaosJudgment } from "@/domain/data/statutes/statute-types";

const SAOS_BASE = "https://www.saos.org.pl/api";
const SEARCH_TTL_H = 6;
const DETAIL_TTL_H = 30 * 24;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function saosFetch(path: string): Promise<unknown> {
  const url = `${SAOS_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) {
    throw new Error(`SAOS API ${res.status}: ${url}`);
  }
  return res.json();
}

function parseJudgment(raw: Record<string, unknown>): SaosJudgment {
  const cases = (raw["courtCases"] as Array<{ caseNumber: string }> | undefined) ?? [];
  const judges = (raw["judges"] as Array<{ name: string; function: string | null; specialRoles: string[] }> | undefined) ?? [];
  const division = raw["division"] as { name?: string; chamber?: { name?: string }; chambers?: Array<{ name?: string }> } | undefined;

  let chamberName: string | null = null;
  if (division?.chamber?.name) chamberName = division.chamber.name;
  else if (division?.chambers?.[0]?.name) chamberName = division.chambers[0].name ?? null;

  const regs = (raw["referencedRegulations"] as Array<{
    journalTitle?: string;
    journalYear?: number;
    journalEntry?: number;
    text?: string;
  }> | undefined) ?? [];

  const saosId = Number(raw["id"]);

  return {
    saosId,
    caseNumbers: cases.map((c) => c.caseNumber),
    courtType: String(raw["courtType"] ?? ""),
    judgmentDate: String(raw["judgmentDate"] ?? ""),
    judgmentType: String(raw["judgmentType"] ?? ""),
    chamberName,
    divisionName: division?.name ?? null,
    judges,
    textSnippet: raw["textContent"] ? String(raw["textContent"]).slice(0, 600) : null,
    fullTextUrl: `${SAOS_BASE}/judgments/${saosId}`,
    referencedRegulations: regs.map((r) => ({
      journalTitle: r.journalTitle ?? "",
      journalYear: r.journalYear ?? 0,
      journalEntry: r.journalEntry ?? 0,
      text: r.text ?? "",
    })),
    saosDetailUrl: `https://www.saos.org.pl/judgment/${saosId}`,
    provenanceSource: "SAOS_LIVE",
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Wyszukuje orzeczenia w SAOS.
 * Domyślnie: Sąd Najwyższy, sortowanie od najnowszych, max 20.
 *
 * @example
 * searchJudgments({ all: "przedawnienie roszczenia", courtType: "SUPREME", pageSize: 10 })
 */
export async function searchJudgments(params: SaosSearchParams): Promise<SaosSearchResult> {
  const p: SaosSearchParams = {
    courtType: "SUPREME",
    pageSize: 20,
    pageNumber: 0,
    sortingField: "JUDGMENT_DATE",
    sortingDirection: "DESC",
    ...params,
  };

  const cacheKey = `saos_search_${JSON.stringify(p)}`;
  const cached = cacheGet<SaosSearchResult>(cacheKey);
  if (cached) return cached;

  const qs = new URLSearchParams();
  if (p.all)               qs.set("all", p.all);
  if (p.courtType)         qs.set("courtType", p.courtType);
  if (p.caseNumber)        qs.set("caseNumber", p.caseNumber);
  if (p.scChamberName)     qs.set("scChamberName", p.scChamberName);
  if (p.judgmentTypes)     qs.set("judgmentTypes", p.judgmentTypes);
  if (p.judgmentDateFrom)  qs.set("judgmentDateFrom", p.judgmentDateFrom);
  if (p.judgmentDateTo)    qs.set("judgmentDateTo", p.judgmentDateTo);
  if (p.sortingField)      qs.set("sortingField", p.sortingField);
  if (p.sortingDirection)  qs.set("sortingDirection", p.sortingDirection);
  qs.set("pageSize",   String(Math.min(p.pageSize ?? 20, 100)));
  qs.set("pageNumber", String(p.pageNumber ?? 0));

  const raw = (await saosFetch(`/search/judgments?${qs.toString()}`)) as {
    items: Record<string, unknown>[];
    info: { totalResults: number };
  };

  const items = (raw.items ?? []).map(parseJudgment);
  const result: SaosSearchResult = {
    items,
    totalResults: raw.info?.totalResults ?? 0,
    pageNumber: p.pageNumber ?? 0,
    pageSize: p.pageSize ?? 20,
    query: p.all ?? p.caseNumber ?? "",
  };

  cacheSet(cacheKey, result, SEARCH_TTL_H);
  return result;
}

/**
 * Pobiera pełne szczegóły orzeczenia, w tym pełny tekst.
 * Cache 30 dni.
 */
export async function getJudgment(saosId: number): Promise<SaosJudgment> {
  const cacheKey = `saos_judgment_${saosId}`;
  const cached = cacheGet<SaosJudgment>(cacheKey);
  if (cached) return cached;

  const raw = (await saosFetch(`/judgments/${saosId}`)) as { data: Record<string, unknown> };
  const judgment = parseJudgment(raw.data ?? {});
  // Przy pobieraniu szczegółów — pełny tekst bez przycinania
  if (raw.data?.["textContent"]) {
    judgment.textSnippet = String(raw.data["textContent"]);
  }
  cacheSet(cacheKey, judgment, DETAIL_TTL_H);
  return judgment;
}

/**
 * Wyszukuje orzeczenie po sygnaturze akt.
 * Zwraca pierwsze trafienie lub null.
 */
export async function findByCaseNumber(caseNumber: string): Promise<SaosJudgment | null> {
  const result = await searchJudgments({ caseNumber, pageSize: 1 });
  return result.items[0] ?? null;
}

/**
 * Wyszukuje orzeczenia Izby Cywilnej SN po słowach kluczowych.
 * Najczęstsze zastosowanie dla spraw cywilnych i handlowych.
 */
export async function searchSupremeCivilChamber(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult> {
  return searchJudgments({
    all: query,
    courtType: "SUPREME",
    scChamberName: "Izba Cywilna",
    pageSize,
    sortingField: "JUDGMENT_DATE",
    sortingDirection: "DESC",
  });
}

/**
 * Wyszukuje orzeczenia Izby Pracy SN.
 */
export async function searchSupremeLaborChamber(
  query: string,
  pageSize = 10
): Promise<SaosSearchResult> {
  return searchJudgments({
    all: query,
    courtType: "SUPREME",
    scChamberName: "Izba Pracy i Ubezpieczeń Społecznych",
    pageSize,
    sortingField: "JUDGMENT_DATE",
    sortingDirection: "DESC",
  });
}

/**
 * Wyszukuje orzeczenia Trybunału Konstytucyjnego.
 */
export async function searchConstitutionalTribunal(query: string, pageSize = 10): Promise<SaosSearchResult> {
  return searchJudgments({
    all: query,
    courtType: "CONSTITUTIONAL_TRIBUNAL",
    pageSize,
    sortingField: "JUDGMENT_DATE",
    sortingDirection: "DESC",
  });
}

/**
 * Wyszukuje orzeczenia Naczelnego Sądu Administracyjnego.
 */
export async function searchNSA(query: string, pageSize = 10): Promise<SaosSearchResult> {
  return searchJudgments({
    all: query,
    courtType: "ADMINISTRATIVE",
    pageSize,
    sortingField: "JUDGMENT_DATE",
    sortingDirection: "DESC",
  });
}

/**
 * Konwertuje metadane regulacji z SAOS na ELI ISAP.
 * referencedRegulations[].journalYear + journalEntry → "DU/{year}/{entry}"
 */
export function regulationToEli(journalYear: number, journalEntry: number): string {
  return `DU/${journalYear}/${journalEntry}`;
}
