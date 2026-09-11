/**
 * Klient ISAP ELI API — api.sejm.gov.pl
 *
 * Zweryfikowane live 12.09.2026:
 *   GET /eli/acts/{publisher}/{year}/{pos}           → metadane JSON
 *   GET /eli/acts/{publisher}/{year}/{pos}/text.html → tekst HTML (oryg. ogłoszenie)
 *   GET /eli/acts/{unified_eli}/text.html            → tekst jednolity HTML ✅
 *   GET /eli/acts/search?title=&publisher=&keyword=  → wyszukiwanie aktów
 *   GET /eli/changes/acts?since={date}               → zmiany od daty
 *
 * Strategia tekstu jednolitego:
 *   1. Pobierz metadane aktu → references["Inf. o tekście jednolitym"][0].id
 *   2. Pobierz /eli/acts/{unified_eli}/text.html → pełny tekst ujednolicony
 *
 * Cache TTL:
 *   - metadane: 24h
 *   - teksty HTML: 7 dni
 *   - wyszukiwanie: 1h
 */
import { cacheGet, cacheSet } from "@/infrastructure/cache/legal-knowledge-cache";
import type { IsapActMetadata, IsapActFullText, ActCurrencyStatus } from "@/domain/data/statutes/statute-types";

const ISAP_API_BASE = "https://api.sejm.gov.pl/eli";

const METADATA_TTL_H = 24;
const TEXT_TTL_H = 7 * 24;
const SEARCH_TTL_H = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function isapFetch(path: string): Promise<unknown> {
  const url = `${ISAP_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`ISAP API ${res.status}: ${url}`);
  }
  return res.json();
}

async function isapFetchHtml(path: string): Promise<string> {
  const url = `${ISAP_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`ISAP HTML ${res.status}: ${url}`);
  }
  return res.text();
}

function parseMetadata(raw: Record<string, unknown>, eli: string): IsapActMetadata {
  const refs = (raw["references"] ?? {}) as Record<string, Array<{ id: string; date?: string }>>;
  const unified = refs["Inf. o tekście jednolitym"] ?? [];
  const amendments = refs["Akty zmieniające"] ?? [];
  const tk = refs["Orzeczenie TK"] ?? [];
  const directives = ((raw["directives"] ?? []) as Array<{ address: string; title: string }>).map(
    (d) => ({ celexId: d.address, title: d.title })
  );

  return {
    eli,
    displayAddress: String(raw["displayAddress"] ?? ""),
    title: String(raw["title"] ?? ""),
    status: String(raw["status"] ?? ""),
    inForce: raw["inForce"] === "IN_FORCE" ? "IN_FORCE" : raw["inForce"] === "REPEALED" ? "REPEALED" : "UNKNOWN",
    changeDate: raw["changeDate"] ? String(raw["changeDate"]) : null,
    textHtmlAvailable: Boolean(raw["textHTML"]),
    latestConsolidatedEli: unified.length > 0 ? unified[0].id : null,
    relatedEuDirectives: directives,
    amendments: amendments.map((a) => ({ id: a.id, date: a.date ?? "" })),
    tkJudgments: tk.map((t) => t.id),
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Pobiera metadane aktu: status, datę zmiany, ELI tekstu jednolitego.
 * Cache 24h.
 */
export async function getActMetadata(eli: string): Promise<IsapActMetadata> {
  const cacheKey = `isap_meta_${eli}`;
  const cached = cacheGet<IsapActMetadata>(cacheKey);
  if (cached) return { ...cached, inForce: cached.inForce };

  const [publisher, year, pos] = eli.split("/");
  const raw = (await isapFetch(`/acts/${publisher}/${year}/${pos}`)) as Record<string, unknown>;
  const meta = parseMetadata(raw, eli);
  cacheSet(cacheKey, meta, METADATA_TTL_H);
  return meta;
}

/**
 * Pobiera pełny tekst HTML aktu (tekst jednolity jeśli dostępny, inaczej oryginał).
 * Cache 7 dni.
 */
export async function getActFullText(eli: string): Promise<IsapActFullText> {
  const cacheKey = `isap_text_${eli}`;
  const cached = cacheGet<IsapActFullText>(cacheKey);
  if (cached) return cached;

  // Ustal ELI do pobrania tekstu
  let textEli = eli;
  try {
    const meta = await getActMetadata(eli);
    if (meta.latestConsolidatedEli) {
      textEli = meta.latestConsolidatedEli;
    }
  } catch {
    // Używamy oryginalnego ELI jako fallback
  }

  const [publisher, year, pos] = textEli.split("/");
  const html = await isapFetchHtml(`/acts/${publisher}/${year}/${pos}/text.html`);

  const result: IsapActFullText = {
    eli,
    consolidatedEli: textEli,
    htmlContent: html,
    fetchedAt: new Date().toISOString(),
    provenanceSource: "ISAP_LIVE",
  };
  cacheSet(cacheKey, result, TEXT_TTL_H);
  return result;
}

/**
 * Wyszukuje akty prawne po tytule / słowie kluczowym.
 * Cache 1h.
 */
export async function searchActs(params: {
  title?: string;
  keyword?: string;
  publisher?: "DU" | "MP";
  status?: "IN_FORCE" | "REPEALED";
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: IsapActMetadata[]; totalCount: number }> {
  const cacheKey = `isap_search_${JSON.stringify(params)}`;
  const cached = cacheGet<{ items: IsapActMetadata[]; totalCount: number }>(cacheKey);
  if (cached) return cached;

  const qs = new URLSearchParams();
  if (params.title)     qs.set("title", params.title);
  if (params.keyword)   qs.set("keyword", params.keyword);
  if (params.publisher) qs.set("publisher", params.publisher);
  if (params.status)    qs.set("status", params.status);
  if (params.type)      qs.set("type", params.type);
  if (params.limit)     qs.set("limit", String(params.limit));
  if (params.offset)    qs.set("offset", String(params.offset));

  const raw = (await isapFetch(`/acts/search?${qs.toString()}`)) as {
    items: Record<string, unknown>[];
    totalCount: number;
  };

  const items = (raw.items ?? []).map((item) => {
    const eli = `${item["publisher"]}/${item["year"]}/${item["pos"]}`;
    return parseMetadata(item, eli);
  });

  const result = { items, totalCount: raw.totalCount ?? 0 };
  cacheSet(cacheKey, result, SEARCH_TTL_H);
  return result;
}

/**
 * Pobiera listę aktów, które zmieniły się od podanej daty.
 * Użyteczne do automatycznej inwalidacji cache.
 */
export async function getActsChangedSince(since: string): Promise<string[]> {
  const raw = (await isapFetch(`/changes/acts?since=${since}&limit=100`)) as {
    items: Array<{ ELI: string }>;
  };
  return (raw.items ?? []).map((i) => i.ELI);
}

/**
 * Sprawdza aktualność aktu — czy był nowelizowany od podanej daty.
 */
export async function checkActCurrency(eli: string, knownAsOf: string): Promise<ActCurrencyStatus> {
  try {
    const meta = await getActMetadata(eli);
    const isUpToDate = !meta.changeDate || new Date(meta.changeDate) <= new Date(knownAsOf);
    return {
      eli,
      isUpToDate,
      apiChangeDate: meta.changeDate,
      checkedAt: new Date().toISOString(),
      warning: isUpToDate
        ? null
        : `Akt zmieniony ${meta.changeDate}. Sprawdź nowelizacje.`,
    };
  } catch (err) {
    return {
      eli,
      isUpToDate: true,
      apiChangeDate: null,
      checkedAt: new Date().toISOString(),
      warning: `Nie udało się sprawdzić aktualności: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Buduje link do tekstu PDF (tekst jednolity) na ISAP.
 */
export function buildIsapPdfUrl(eli: string): string {
  const [publisher, year, pos] = eli.split("/");
  const address = `W${publisher}${String(year).padStart(4, "0")}${String(Number(pos)).padStart(8, "0")}`;
  return `https://isap.sejm.gov.pl/isap.nsf/download.xsp/${address}/T`;
}

/**
 * Buduje link do strony ISAP dla danego aktu.
 */
export function buildIsapPageUrl(eli: string): string {
  const [publisher, year, pos] = eli.split("/");
  return `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=W${publisher}${year}${pos}`;
}
