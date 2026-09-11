/**
 * Klient EUR-Lex — dostęp do prawa UE i orzeczeń TSUE.
 *
 * Zweryfikowany endpoint SPARQL: https://publications.europa.eu/webapi/rdf/sparql
 * Publiczny, bez autoryzacji. Format wyników: JSON.
 *
 * EUR-Lex pełny tekst: https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=CELEX:{celexId}
 *
 * Cache TTL: 48h dla tekstów dyrektyw, 7 dni dla orzeczeń TSUE.
 */
import { cacheGet, cacheSet } from "@/infrastructure/cache/legal-knowledge-cache";
import type { EuLegalAct, CjeuJudgment } from "@/domain/data/statutes/statute-types";
import { EU_LAW_CATALOG, CJEU_JUDGMENT_CATALOG } from "@/domain/data/statutes/eu-law-catalog";

const SPARQL_ENDPOINT = "https://publications.europa.eu/webapi/rdf/sparql";
const EURLEX_BASE = "https://eur-lex.europa.eu";

const DIRECTIVE_TTL_H = 48;
const JUDGMENT_TTL_H = 7 * 24;

// ---------------------------------------------------------------------------
// EUR-Lex full text
// ---------------------------------------------------------------------------

/**
 * Pobiera pełny tekst dyrektywy / rozporządzenia UE w HTML (po polsku).
 * Cache 48h.
 */
export async function getEuActText(celexId: string): Promise<string> {
  const cacheKey = `eurlex_text_${celexId}`;
  const cached = cacheGet<string>(cacheKey);
  if (cached) return cached;

  const url = `${EURLEX_BASE}/legal-content/PL/TXT/HTML/?uri=CELEX:${celexId}`;
  const res = await fetch(url, {
    headers: { Accept: "text/html" },
    next: { revalidate: 172800 },
  });
  if (!res.ok) {
    throw new Error(`EUR-Lex ${res.status}: ${url}`);
  }
  const html = await res.text();
  cacheSet(cacheKey, html, DIRECTIVE_TTL_H);
  return html;
}

/**
 * Buduje URL do tekstu dyrektywy na EUR-Lex (PL).
 */
export function buildEurLexUrl(celexId: string): string {
  return `${EURLEX_BASE}/legal-content/PL/TXT/?uri=CELEX:${celexId}`;
}

/**
 * Buduje URL do orzeczenia TSUE na CURIA.
 */
export function buildCuriaUrl(celexId: string): string {
  return `https://curia.europa.eu/juris/liste.jsf?num=${celexId}`;
}

// ---------------------------------------------------------------------------
// SPARQL queries
// ---------------------------------------------------------------------------

async function sparqlQuery(query: string): Promise<unknown[]> {
  const cacheKey = `sparql_${Buffer.from(query).toString("base64").slice(0, 60)}`;
  const cached = cacheGet<unknown[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/sparql-results+json",
    },
    body: `query=${encodeURIComponent(query)}&format=application%2Fsparql-results%2Bjson`,
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`SPARQL ${res.status}`);
  }

  const json = (await res.json()) as {
    results: { bindings: unknown[] };
  };
  const bindings = json.results?.bindings ?? [];
  cacheSet(cacheKey, bindings, 24);
  return bindings;
}

// ---------------------------------------------------------------------------
// TSUE — wyszukiwanie dynamiczne
// ---------------------------------------------------------------------------

/**
 * Wyszukuje wyroki TSUE przez SPARQL po słowach kluczowych.
 * Zwraca do 20 wyników.
 */
export async function searchCjeuJudgments(params: {
  keywords: string[];
  fromDate?: string;
  limit?: number;
}): Promise<CjeuJudgment[]> {
  const { keywords, fromDate = "2010-01-01", limit = 20 } = params;

  // Najpierw przeszukaj seed catalog
  const q = keywords.join(" ").toLowerCase();
  const seedMatches = CJEU_JUDGMENT_CATALOG.filter((j) =>
    j.keywords.some((k) => q.includes(k.toLowerCase())) ||
    j.thesis.toLowerCase().includes(q) ||
    j.practicalRelevance.toLowerCase().includes(q)
  );

  if (seedMatches.length >= Math.min(limit, 3)) {
    return seedMatches.slice(0, limit);
  }

  // Fallback: SPARQL query dla dynamicznych wyników
  try {
    const keywordFilter = keywords.map((k) => `CONTAINS(LCASE(STR(?title)), "${k.toLowerCase()}")`).join(" || ");

    const query = `
PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?work ?title ?date ?caseNumber WHERE {
  ?work cdm:work_has_resource-type <http://publications.europa.eu/resource/authority/resource-type/JUDG>.
  ?work cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/CJEU>.
  ?work cdm:work_date_document ?date.
  OPTIONAL { ?work cdm:expression_title ?title. FILTER(LANG(?title) = "pl") }
  OPTIONAL { ?work cdm:case-law_originates_in_case ?caseNumber }
  FILTER(?date >= "${fromDate}"^^xsd:date)
  FILTER(${keywordFilter || 'true'})
}
ORDER BY DESC(?date)
LIMIT ${limit}
`;

    const bindings = await sparqlQuery(query);
    const dynamicResults: CjeuJudgment[] = (
      bindings as Array<{
        work?: { value: string };
        title?: { value: string };
        date?: { value: string };
        caseNumber?: { value: string };
      }>
    ).map((b) => {
      const celexId = b.work?.value?.split("/").pop() ?? "";
      return {
        celexId,
        caseNumber: b.caseNumber?.value ?? celexId,
        title: b.title?.value ?? "Wyrok TSUE",
        date: b.date?.value ?? "",
        type: "wyrok" as const,
        thesis: "Pełna treść dostępna na CURIA",
        practicalRelevance: "Wynik dynamicznego wyszukiwania",
        keywords,
        curiaUrl: `https://curia.europa.eu/juris/liste.jsf?num=${b.caseNumber?.value ?? ""}`,
        relatedDirectives: [],
        provenanceSource: "EURLEX_LIVE" as const,
      };
    });

    return [...seedMatches, ...dynamicResults].slice(0, limit);
  } catch {
    // Gdy SPARQL nie odpowiada — zwróć tylko seed
    return seedMatches;
  }
}

// ---------------------------------------------------------------------------
// Katalog seed
// ---------------------------------------------------------------------------

/** Pobiera akt UE z seed katalogu lub zwraca null */
export function getEuActFromCatalog(celexId: string): EuLegalAct | null {
  return EU_LAW_CATALOG.find((a) => a.celexId === celexId) ?? null;
}

/** Zwraca wszystkie dyrektywy powiązane z polskim aktem (po ELI) */
export function getEuActsForPolishAct(polishEli: string): EuLegalAct[] {
  return EU_LAW_CATALOG.filter((a) => a.implementingPolishEli === polishEli);
}

/** Wyszukuje w katalogu EU po słowach kluczowych */
export function searchEuCatalog(query: string): EuLegalAct[] {
  const q = query.toLowerCase();
  return EU_LAW_CATALOG.filter(
    (a) =>
      a.titlePl.toLowerCase().includes(q) ||
      a.shortName.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.celexId.toLowerCase().includes(q)
  );
}

/** Zwraca wyroki TSUE z seed katalogu powiązane z daną dyrektywą */
export function getCjeuForDirective(celexId: string): CjeuJudgment[] {
  return CJEU_JUDGMENT_CATALOG.filter((j) => j.relatedDirectives.includes(celexId));
}

/** Zwraca wszystkie wyroki TSUE z seed katalogu */
export function getAllSeedCjeuJudgments(): CjeuJudgment[] {
  return CJEU_JUDGMENT_CATALOG;
}
