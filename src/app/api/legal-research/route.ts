/**
 * Next.js Route Handler — Legal Research API
 * Serwer-side: operacje na cache i zewnętrznych API dzieją się tu.
 * Klient (WorkspaceShell) odpytuje ten endpoint przez fetch.
 */
import { type NextRequest, NextResponse } from "next/server";
import * as LRS from "@/domain/services/legal-research-service";
import { cacheStats } from "@/infrastructure/cache/legal-knowledge-cache";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "catalog";

  try {
    switch (action) {
      // ── Katalog aktów ────────────────────────────────────────
      case "catalog": {
        return NextResponse.json({
          statutes: LRS.getStatuteCatalog(),
          euLaw: LRS.getEuLawCatalog(),
          cjeuJudgments: LRS.getSeedCjeuJudgments(),
        });
      }

      // ── Metadane aktu ISAP ────────────────────────────────────
      case "act_metadata": {
        const eli = searchParams.get("eli");
        if (!eli) return NextResponse.json({ error: "Brak parametru eli" }, { status: 400 });
        const meta = await LRS.getActMetadata(eli);
        if (!meta) return NextResponse.json({ error: "Nie znaleziono aktu" }, { status: 404 });
        return NextResponse.json(meta);
      }

      // ── Pełny tekst aktu (HTML) ───────────────────────────────
      case "act_text": {
        const eli = searchParams.get("eli");
        if (!eli) return NextResponse.json({ error: "Brak parametru eli" }, { status: 400 });
        const text = await LRS.getActFullText(eli);
        if (!text) return NextResponse.json({ error: "Tekst niedostępny" }, { status: 404 });
        return NextResponse.json(text);
      }

      // ── Wyszukiwanie aktów ISAP ───────────────────────────────
      case "search_acts": {
        const q = searchParams.get("q") ?? "";
        const result = await LRS.searchPolishActs({ title: q, keyword: q, limit: 20 });
        return NextResponse.json(result);
      }

      // ── Wyszukiwanie orzeczeń SN Cywilna ─────────────────────
      case "search_sn_civil": {
        const q = searchParams.get("q") ?? "";
        const pageSize = Number(searchParams.get("pageSize") ?? "10");
        const result = await LRS.searchSupremeCivilJudgments(q, pageSize);
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Wyszukiwanie orzeczeń SN Praca ───────────────────────
      case "search_sn_labor": {
        const q = searchParams.get("q") ?? "";
        const result = await LRS.searchSupremeLaborJudgments(q, 10);
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Wyszukiwanie wszystkich sądów ────────────────────────
      case "search_judgments": {
        const q = searchParams.get("q") ?? "";
        const courtType = (searchParams.get("courtType") ?? "SUPREME") as "SUPREME" | "COMMON" | "CONSTITUTIONAL_TRIBUNAL" | "ADMINISTRATIVE";
        const pageSize = Number(searchParams.get("pageSize") ?? "10");
        const pageNumber = Number(searchParams.get("page") ?? "0");
        const result = await LRS.searchAllJudgments({ all: q, courtType, pageSize, pageNumber });
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Wyszukiwanie TK ──────────────────────────────────────
      case "search_tk": {
        const q = searchParams.get("q") ?? "";
        const result = await LRS.searchConstitutionalJudgments(q, 10);
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Wyszukiwanie NSA ─────────────────────────────────────
      case "search_nsa": {
        const q = searchParams.get("q") ?? "";
        const result = await LRS.searchAdministrativeJudgments(q, 10);
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Wyszukiwanie po sygnaturze ────────────────────────────
      case "by_case_number": {
        const cn = searchParams.get("caseNumber") ?? "";
        const result = await LRS.findJudgmentByCaseNumber(cn);
        return NextResponse.json(result ?? { items: [], totalResults: 0 });
      }

      // ── Pełny tekst aktu UE ───────────────────────────────────
      case "eu_text": {
        const celexId = searchParams.get("celexId");
        if (!celexId) return NextResponse.json({ error: "Brak parametru celexId" }, { status: 400 });
        const text = await LRS.getEuActText(celexId);
        if (!text) return NextResponse.json({ error: "Tekst UE niedostępny" }, { status: 404 });
        return NextResponse.json({ celexId, html: text });
      }

      // ── Wyszukiwanie TSUE ─────────────────────────────────────
      case "search_cjeu": {
        const q = searchParams.get("q") ?? "";
        const results = await LRS.searchCjeuJudgments(q.split(" ").filter(Boolean), 10);
        return NextResponse.json({ items: results });
      }

      // ── Kompleksowe wyszukiwanie ─────────────────────────────
      case "comprehensive": {
        const q = searchParams.get("q") ?? "";
        if (!q) return NextResponse.json({ error: "Brak zapytania" }, { status: 400 });
        const result = await LRS.comprehensiveLegalSearch(q);
        return NextResponse.json(result);
      }

      // ── Aktualność przepisów ──────────────────────────────────
      case "currency_check": {
        const elisRaw = searchParams.get("elis") ?? "";
        const elis = elisRaw.split(",").filter(Boolean);
        const map = await LRS.checkActsCurrency(elis);
        return NextResponse.json(Object.fromEntries(map));
      }

      // ── Status cache ──────────────────────────────────────────
      case "cache_stats": {
        return NextResponse.json(cacheStats());
      }

      default:
        return NextResponse.json({ error: `Nieznana akcja: ${action}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
