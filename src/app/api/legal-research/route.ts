/**
 * Next.js Route Handler — Legal Research API
 * GET: katalog, wyszukiwanie, metadane (bez AI)
 * POST: zapytania AI (analiza, ekstrakcja artykułów, asystent chat)
 *
 * Klucz GEMINI_API_KEY nigdy nie trafia do klienta — wyłącznie server-side.
 */
import { type NextRequest, NextResponse } from "next/server";
import * as LRS from "@/domain/services/legal-research-service";
import { cacheStats } from "@/infrastructure/cache/legal-knowledge-cache";
import {
  analyzeLegalQuery,
  suggestLegalProvisions,
  legalAssistantChat,
  extractArticleFromActHtml,
  summarizeJudgment,
} from "@/infrastructure/external/gemini-client";

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
// ──────────────────────────────────────────────────────────────────────────
// POST — AI endpoints (Gemini)
// ──────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const action = String(body["action"] ?? "");

  try {
    switch (action) {

      // ── Analiza zapytania w j. naturalnym ───────────────────────────────
      case "ai_analyze_query": {
        const query = String(body["query"] ?? "");
        if (!query) return NextResponse.json({ error: "Brak query" }, { status: 400 });
        const result = await analyzeLegalQuery(query);
        return NextResponse.json(result);
      }

      // ── Ekstrakcja artykułu z pełnego tekstu aktu ───────────────────────
      case "ai_extract_article": {
        const eli = String(body["eli"] ?? "");
        const articleQuery = String(body["articleQuery"] ?? "");
        const actShortName = String(body["actShortName"] ?? "");
        if (!eli || !articleQuery) {
          return NextResponse.json({ error: "Brak eli lub articleQuery" }, { status: 400 });
        }
        const fullText = await LRS.getActFullText(eli);
        if (!fullText) {
          return NextResponse.json({ error: "Nie udało się pobrać tekstu aktu" }, { status: 404 });
        }
        const result = await extractArticleFromActHtml({
          htmlText: fullText.htmlContent,
          articleQuery,
          actShortName,
        });
        return NextResponse.json({ ...result, eli, source: fullText.provenanceSource });
      }

      // ── Dopasowanie przepisów do faktów sprawy ──────────────────────────
      case "ai_suggest_provisions": {
        const matterDescription = String(body["matterDescription"] ?? "");
        const claimType = String(body["claimType"] ?? "zapłata z umowy");
        const contractDate = body["contractDate"] ? String(body["contractDate"]) : undefined;
        const claimAmountPln = body["claimAmountPln"] ? Number(body["claimAmountPln"]) : undefined;
        const keyFacts = Array.isArray(body["keyFacts"])
          ? (body["keyFacts"] as string[]).map(String)
          : [];
        const result = await suggestLegalProvisions({
          matterDescription,
          claimType,
          contractDate,
          claimAmountPln,
          keyFacts,
        });
        return NextResponse.json(result);
      }

      // ── Streszczenie wyroku ─────────────────────────────────────────────
      case "ai_summarize_judgment": {
        const fullText = String(body["fullText"] ?? "");
        const caseNumber = String(body["caseNumber"] ?? "");
        const courtName = String(body["courtName"] ?? "Sąd Najwyższy");
        if (!fullText || !caseNumber) {
          return NextResponse.json({ error: "Brak fullText lub caseNumber" }, { status: 400 });
        }
        const result = await summarizeJudgment({ fullText, caseNumber, courtName });
        return NextResponse.json(result);
      }

      // ── Asystent badawczy (swobodny chat) ──────────────────────────────
      case "ai_chat": {
        const question = String(body["question"] ?? "");
        const context = body["context"] ? String(body["context"]) : undefined;
        if (!question) return NextResponse.json({ error: "Brak pytania" }, { status: 400 });
        const answer = await legalAssistantChat({ question, context });
        return NextResponse.json({ answer });
      }

      default:
        return NextResponse.json({ error: `Nieznana akcja AI: ${action}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Nie loguj szczegółów — mogą zawierać fragmenty tajnych danych
    console.error("[legal-research AI]", message.slice(0, 200));
    return NextResponse.json({ error: "Błąd serwisu AI. Spróbuj ponownie." }, { status: 500 });
  }
}
