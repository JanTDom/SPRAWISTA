"use client";
/**
 * LegalResearchPanel — panel badania prawnego + asystent AI Gemini.
 *
 * Źródła:
 *  - ISAP ELI API — pełny tekst każdego polskiego aktu
 *  - SAOS API — 200k+ orzeczeń SN, TK, NSA, SA
 *  - EUR-Lex SPARQL — dyrektywy UE i wyroki TSUE
 *  - Gemini 2.5 Flash — analiza zapytań, ekstrakcja artykułów, asystent
 *
 * AI: wyłącznie server-side (/api/legal-research POST). Klucz nigdy w przeglądarce.
 */
import React, { useState, useCallback, useTransition, useRef } from "react";
import type {
  StatuteCatalogEntry,
  IsapActMetadata,
  SaosJudgment,
  EuLegalAct,
  CjeuJudgment,
} from "@/domain/data/statutes/statute-types";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type SearchMode = "pl_acts" | "sn_civil" | "sn_labor" | "tk" | "nsa" | "eu" | "tsue" | "comprehensive";
type ViewState = "catalog" | "search" | "act_text" | "ai_assistant";

interface CatalogData {
  statutes: StatuteCatalogEntry[];
  euLaw: EuLegalAct[];
  cjeuJudgments: CjeuJudgment[];
}

interface AiAnalysisResult {
  interpretation: string;
  suggestedArticles: Array<{ actEli: string; actShortName: string; articles: string[] }>;
  saosKeywords: string[];
  relevantEuCelexIds: string[];
  practicalSummary: string;
}

interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ──────────────────────────────────────────────────────────────────────────
// API helpers
// ──────────────────────────────────────────────────────────────────────────

async function legalApi<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ action, ...params });
  const res = await fetch(`/api/legal-research?${qs.toString()}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

async function legalAiPost<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/legal-research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...body }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}


// ──────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "IN_FORCE" || status?.includes("tekst jednolity") || status?.includes("obowiązuje");
  return (
    <span
      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
        isActive
          ? "bg-[#E6F4EA] text-[#137333]"
          : "bg-[#F5E0A0] text-[#B06000]"
      }`}
    >
      {isActive ? "● obowiązuje" : "○ archiwalny"}
    </span>
  );
}

function ActCard({
  entry,
  onOpen,
  onViewText,
}: {
  entry: StatuteCatalogEntry;
  onOpen: (eli: string) => void;
  onViewText: (eli: string, title: string) => void;
}) {
  return (
    <div className="border border-[#E1E3E7] rounded-lg p-3.5 bg-white hover:border-[#355CFF]/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="font-mono font-bold text-[#355CFF] text-xs mr-2">{entry.shortName}</span>
          <span className="text-[10px] text-[#8C93A0] font-mono">{entry.displayAddress}</span>
        </div>
        <StatusBadge status="IN_FORCE" />
      </div>
      <p className="text-[12px] text-[#172338] font-medium mb-1 leading-snug line-clamp-2">{entry.title}</p>
      <p className="text-[11px] text-[#5F6774] mb-2.5 leading-relaxed">{entry.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onViewText(entry.eli, entry.shortName)}
          className="text-[11px] font-mono text-[#355CFF] hover:underline"
        >
          Tekst jednolity ↗
        </button>
        <span className="text-[#E1E3E7]">|</span>
        <a
          href={`https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=W${entry.eli.replace(/\//g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-[#5F6774] hover:text-[#172338]"
        >
          ISAP ↗
        </a>
        {entry.latestConsolidatedEli && (
          <>
            <span className="text-[#E1E3E7]">|</span>
            <span className="text-[10px] font-mono text-[#8C93A0]">tj. {entry.latestConsolidatedEli}</span>
          </>
        )}
      </div>
    </div>
  );
}

function JudgmentCard({ j }: { j: SaosJudgment }) {
  const [expanded, setExpanded] = useState(false);
  const caseNum = j.caseNumbers[0] ?? "—";
  return (
    <div className="border border-[#E1E3E7] rounded-lg p-3.5 bg-white text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-[#355CFF] text-sm">{caseNum}</span>
        <span className="text-[10px] text-[#5F6774] font-mono">{j.judgmentType} · {j.judgmentDate}</span>
      </div>
      {j.chamberName && (
        <p className="text-[11px] text-[#172338]">{j.chamberName}</p>
      )}
      {j.textSnippet && (
        <div>
          <p className={`text-[#5F6774] leading-relaxed font-mono text-[11px] ${!expanded ? "line-clamp-3" : ""}`}>
            {j.textSnippet}
          </p>
          {j.textSnippet.length > 200 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-[10px] text-[#355CFF] mt-0.5"
            >
              {expanded ? "Zwiń ↑" : "Rozwiń ↓"}
            </button>
          )}
        </div>
      )}
      <div className="flex items-center gap-3 pt-1 border-t border-[#E1E3E7]/60">
        <a href={j.saosDetailUrl} target="_blank" rel="noopener noreferrer"
          className="text-[11px] text-[#355CFF] hover:underline font-mono">
          SAOS ↗
        </a>
        {j.referencedRegulations.slice(0, 2).map((r, i) => (
          <span key={i} className="text-[10px] font-mono text-[#8C93A0] truncate max-w-[200px]"
            title={r.journalTitle}>
            {r.text?.slice(0, 50)}…
          </span>
        ))}
      </div>
    </div>
  );
}

function EuActCard({ act }: { act: EuLegalAct }) {
  return (
    <div className="border border-[#E1E3E7] rounded-lg p-3.5 bg-white text-xs">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="font-mono font-bold text-[#7B42CC] text-[11px]">{act.celexId}</span>
          <span className="mx-1.5 text-[#E1E3E7]">·</span>
          <span className="text-[10px] text-[#5F6774]">{act.type} {act.actNumber}</span>
        </div>
        <StatusBadge status={act.isInForce ? "IN_FORCE" : "REPEALED"} />
      </div>
      <p className="text-[12px] text-[#172338] font-medium mb-1 leading-snug">{act.shortName}</p>
      <p className="text-[11px] text-[#5F6774] mb-2 leading-relaxed">{act.summary}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <a href={act.eurLexUrl} target="_blank" rel="noopener noreferrer"
          className="text-[11px] font-mono text-[#7B42CC] hover:underline">EUR-Lex ↗</a>
        {act.implementingPolishEli && (
          <span className="text-[10px] font-mono text-[#5F6774]">
            → implementacja: {act.implementingPolishEli}
          </span>
        )}
      </div>
    </div>
  );
}

function CjeuCard({ j }: { j: CjeuJudgment }) {
  return (
    <div className="border border-[#E1E3E7] rounded-lg p-3.5 bg-white text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-[#C5221F]">{j.caseNumber}</span>
        <span className="text-[10px] text-[#5F6774] font-mono">{j.type} · {j.date}</span>
      </div>
      <p className="text-[12px] font-medium text-[#172338]">{j.title}</p>
      <blockquote className="font-serif text-[12px] italic text-[#172338] leading-relaxed pl-3 border-l-2 border-[#C5221F] bg-[#FAF9F6] p-2 rounded-r">
        „{j.thesis}"
      </blockquote>
      <p className="text-[11px] text-[#5F6774]">{j.practicalRelevance}</p>
      <a href={j.curiaUrl} target="_blank" rel="noopener noreferrer"
        className="text-[11px] font-mono text-[#C5221F] hover:underline">
        CURIA ↗
      </a>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────

export function LegalResearchPanel() {
  const [view, setView] = useState<ViewState>("catalog");
  const [searchMode, setSearchMode] = useState<SearchMode>("comprehensive");
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<unknown>(null);
  const [actText, setActText] = useState<{ eli: string; title: string; html: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Ładuj katalog przy pierwszym renderze
  React.useEffect(() => {
    if (catalogLoaded) return;
    setCatalogLoaded(true);
    startTransition(async () => {
      try {
        const data = await legalApi<CatalogData>("catalog");
        setCatalog(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Błąd ładowania katalogu");
      }
    });
  }, [catalogLoaded]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setError(null);
    setView("search");
    startTransition(async () => {
      try {
        let result: unknown;
        switch (searchMode) {
          case "pl_acts":
            result = await legalApi("search_acts", { q: query });
            break;
          case "sn_civil":
            result = await legalApi("search_sn_civil", { q: query, pageSize: "15" });
            break;
          case "sn_labor":
            result = await legalApi("search_sn_labor", { q: query });
            break;
          case "tk":
            result = await legalApi("search_tk", { q: query });
            break;
          case "nsa":
            result = await legalApi("search_nsa", { q: query });
            break;
          case "eu":
            result = await legalApi("comprehensive", { q: query });
            break;
          case "tsue":
            result = await legalApi("search_cjeu", { q: query });
            break;
          case "comprehensive":
          default:
            result = await legalApi("comprehensive", { q: query });
            break;
        }
        setSearchResults(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Błąd wyszukiwania");
      }
    });
  }, [query, searchMode]);

  const handleViewText = useCallback((eli: string, title: string) => {
    setError(null);
    setView("act_text");
    startTransition(async () => {
      try {
        const data = await legalApi<{ eli: string; htmlContent: string }>("act_text", { eli });
        setActText({ eli, title, html: data.htmlContent });
      } catch (e) {
        setError(`Nie udało się pobrać tekstu: ${e instanceof Error ? e.message : String(e)}`);
      }
    });
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono font-bold bg-[#EEF2FF] text-[#355CFF] px-2 py-0.5 rounded border border-[#C7D2FE]">
            Dostęp do całości prawa
          </span>
          <span className="text-xs font-mono text-[#5F6774]">
            ISAP ELI · SAOS (200k+ orzeczeń) · EUR-Lex · CURIA TSUE
          </span>
          <span className="text-xs font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded border border-[#A5D6A7]">
            ✦ Gemini 2.5 Flash
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#172338]">Badanie prawne</h2>
            <p className="text-sm text-[#5F6774] mt-1">
              Pełny dostęp do polskiego prawa, orzecznictwa i prawa unijnego — z asystentem AI.
            </p>
          </div>
          <button
            onClick={() => setView(view === "ai_assistant" ? "catalog" : "ai_assistant")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === "ai_assistant"
                ? "bg-[#172338] text-white"
                : "bg-[#F0FDF4] text-[#2E7D32] border border-[#A5D6A7] hover:bg-[#E8F5E9]"
            }`}
          >
            <span>✦</span>
            <span>Asystent AI</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-[#E1E3E7] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Szukaj: przepis, sygnatura, słowo kluczowe…"
            className="flex-1 text-sm font-sans bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg px-3 py-2 text-[#172338] placeholder:text-[#8C93A0] focus:outline-none focus:ring-1 focus:ring-[#355CFF]"
          />
          <button
            onClick={handleSearch}
            disabled={isPending || !query.trim()}
            className="px-4 py-2 bg-[#355CFF] text-white text-sm font-semibold rounded-lg hover:bg-[#2A4AE0] disabled:opacity-40 transition-colors"
          >
            {isPending ? "…" : "Szukaj"}
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["comprehensive", "Wszystko"],
              ["pl_acts", "Akty PL"],
              ["sn_civil", "SN Cywilna"],
              ["sn_labor", "SN Praca"],
              ["tk", "TK"],
              ["nsa", "NSA"],
              ["eu", "Prawo UE"],
              ["tsue", "TSUE"],
            ] as [SearchMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setSearchMode(mode)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors ${
                searchMode === mode
                  ? "bg-[#172338] text-white border-[#172338]"
                  : "bg-white text-[#5F6774] border-[#E1E3E7] hover:border-[#355CFF] hover:text-[#355CFF]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#FEF7E0] border border-[#B06000] rounded-lg p-3 text-xs font-mono text-[#B06000]">
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className="text-center py-8 text-sm text-[#5F6774] animate-pulse">
          Odpytuję źródła prawne…
        </div>
      )}

      {/* Act full text view */}
      {view === "act_text" && actText && !isPending && (
        <div className="bg-white border border-[#E1E3E7] rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#E1E3E7]">
            <div>
              <span className="font-mono font-bold text-[#355CFF]">{actText.title}</span>
              <span className="ml-2 text-xs text-[#5F6774] font-mono">{actText.eli}</span>
            </div>
            <button
              onClick={() => setView("catalog")}
              className="text-xs text-[#5F6774] hover:text-[#172338] font-mono"
            >
              ← Powrót
            </button>
          </div>
          <div
            className="p-5 text-xs leading-relaxed text-[#172338] overflow-auto max-h-[60vh] legal-html-content"
            dangerouslySetInnerHTML={{ __html: actText.html }}
          />
        </div>
      )}

      {/* Search results */}
      {view === "search" && searchResults != null && !isPending && (
        <SearchResultsView
          results={searchResults as Record<string, unknown>}
          mode={searchMode}
          onBack={() => setView("catalog")}
          onViewText={handleViewText}
        />
      )}

      {/* Catalog view */}
      {view === "catalog" && !isPending && catalog && (
        <CatalogView catalog={catalog} onViewText={handleViewText} />
      )}

      {/* AI assistant */}
      {view === "ai_assistant" && (
        <AiAssistantView onBack={() => setView("catalog")} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// AiAssistantView — Gemini 2.5 Flash asystent prawny
// ──────────────────────────────────────────────────────────────────────────

function AiAssistantView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content: "Dzień dobry. Jestem asystentem badawczym opartym na Gemini 2.5 Flash. Pomagam w analizie przepisów, wyszukiwaniu właściwych artykułów i interpretacji orzecznictwa.\n\nMożesz zapytać o konkretny przepis, sygnaturę orzeczenia lub opisać problem prawny — wskażę gdzie szukać podstawy.\n\nNie udzielam porad prawnych — wspieram Twoją pracę badawczą.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<"chat" | "analyze">("chat");
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = [
    "Jakie są przesłanki z art. 481 KC dla odsetek za opóźnienie?",
    "Kiedy roszczenie z umowy o roboty budowlane ulega przedawnieniu?",
    "Co to jest rekompensata 40 EUR z ustawy o transakcjach handlowych?",
    "Jak działa zarzut braku legitymacji procesowej czynnej?",
    "Jakie są skutki przekroczenia terminu na odpowiedź na pozew?",
    "Kiedy zastosowanie ma dyrektywa 2011/7/UE zamiast polskiej UTH?",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    const userMsg: AiChatMessage = { role: "user", content: text.trim(), timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);
    setAnalysisResult(null);

    try {
      if (analysisMode === "analyze") {
        const result = await legalAiPost<AiAnalysisResult>("ai_analyze_query", { query: text.trim() });
        setAnalysisResult(result);
        setMessages((m) => [...m, {
          role: "assistant",
          content: `**Interpretacja:** ${result.interpretation}\n\n**Stan prawny:** ${result.practicalSummary}`,
          timestamp: new Date().toISOString(),
        }]);
      } else {
        const { answer } = await legalAiPost<{ answer: string }>("ai_chat", { question: text.trim() });
        setMessages((m) => [...m, { role: "assistant", content: answer, timestamp: new Date().toISOString() }]);
      }
    } catch (err) {
      setMessages((m) => [...m, {
        role: "assistant",
        content: `Błąd: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsThinking(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nav bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold text-[#2E7D32] bg-[#F0FDF4] border border-[#A5D6A7] px-2 py-0.5 rounded">✦ Gemini 2.5 Flash</span>
          <span className="text-xs text-[#5F6774] font-mono">Asystent badań prawnych</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#E1E3E7] rounded-lg overflow-hidden text-[11px] font-mono">
            {(["chat", "analyze"] as const).map((mode) => (
              <button key={mode} onClick={() => setAnalysisMode(mode)}
                className={`px-2.5 py-1 transition-colors ${analysisMode === mode ? "bg-[#172338] text-white" : "bg-white text-[#5F6774] hover:bg-[#FAF9F6]"}`}>
                {mode === "chat" ? "Rozmowa" : "Analiza źródeł"}
              </button>
            ))}
          </div>
          <button onClick={onBack} className="text-xs text-[#5F6774] hover:text-[#172338] font-mono">← Katalog</button>
        </div>
      </div>

      <div className="text-xs font-mono text-[#5F6774] bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg px-3 py-2">
        {analysisMode === "chat"
          ? "Tryb rozmowy — zadaj pytanie prawne w języku naturalnym."
          : "Tryb analizy — AI wskaże konkretne artykuły, frazy do SAOS i dyrektywy UE."}
      </div>

      {/* Chat */}
      <div className="bg-white border border-[#E1E3E7] rounded-xl overflow-hidden">
        <div className="h-[420px] overflow-y-auto p-4 space-y-4" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${msg.role === "assistant" ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]" : "bg-[#EEF2FF] text-[#355CFF] border border-[#C7D2FE]"}`}>
                {msg.role === "assistant" ? "✦" : "P"}
              </div>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-[#EEF2FF] text-[#172338] rounded-tr-sm" : "bg-[#FAF9F6] text-[#172338] border border-[#E1E3E7] rounded-tl-sm"}`}>
                <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
                <span className="text-[10px] text-[#8C93A0] font-mono mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-3">
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] flex items-center justify-center text-xs font-bold">✦</div>
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-[#E1E3E7] p-3 flex gap-2 bg-[#FAF9F6]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Zapytaj o przepis, orzeczenie lub problem prawny… (Enter = wyślij)"
            rows={2}
            className="flex-1 text-sm bg-white border border-[#E1E3E7] rounded-lg px-3 py-2 text-[#172338] placeholder:text-[#8C93A0] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] resize-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isThinking || !input.trim()}
            className="px-4 py-2 bg-[#2E7D32] text-white text-sm font-semibold rounded-lg hover:bg-[#1B5E20] disabled:opacity-40 transition-colors self-end"
          >
            {isThinking ? "…" : "Wyślij"}
          </button>
        </div>
      </div>

      {/* Structured analysis result */}
      {analysisResult && (
        <div className="bg-white border border-[#E1E3E7] rounded-xl p-4 space-y-4">
          <h4 className="font-serif font-bold text-[#172338]">Analiza źródeł prawa</h4>
          {analysisResult.suggestedArticles.length > 0 && (
            <div>
              <p className="text-[11px] font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">Sugerowane artykuły</p>
              <div className="space-y-1.5">
                {analysisResult.suggestedArticles.map((a, i) => (
                  <div key={i} className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg px-3 py-2">
                    <span className="font-mono font-bold text-[#355CFF] text-xs">{a.actShortName}</span>
                    <span className="mx-2 text-[#E1E3E7]">·</span>
                    <span className="text-xs text-[#172338]">{a.articles.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {analysisResult.saosKeywords.length > 0 && (
            <div>
              <p className="text-[11px] font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">Frazy do SAOS</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.saosKeywords.map((k, i) => (
                  <span key={i} className="text-[11px] font-mono bg-[#EEF2FF] text-[#355CFF] border border-[#C7D2FE] px-2 py-0.5 rounded">{k}</span>
                ))}
              </div>
            </div>
          )}
          {analysisResult.relevantEuCelexIds.length > 0 && (
            <div>
              <p className="text-[11px] font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">Prawo UE</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.relevantEuCelexIds.map((c, i) => (
                  <a key={i} href={`https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:${c}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-mono bg-[#F3E5F5] text-[#7B42CC] border border-[#CE93D8] px-2 py-0.5 rounded hover:underline">
                    {c} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick prompts (when fresh) */}
      {messages.length <= 1 && (
        <div>
          <p className="text-[11px] font-mono text-[#5F6774] mb-2 uppercase tracking-wider">Przykładowe pytania:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} onClick={() => sendMessage(p)}
                className="text-left text-xs text-[#172338] bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg px-3 py-2.5 hover:border-[#2E7D32]/50 hover:bg-[#F0FDF4] transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// CatalogView
// ──────────────────────────────────────────────────────────────────────────

function CatalogView({
  catalog,
  onViewText,
}: {
  catalog: CatalogData;
  onViewText: (eli: string, title: string) => void;
}) {
  const areas = [
    { key: "ZOBOWIAZANIA_CYWILNE", label: "Prawo cywilne i zobowiązania" },
    { key: "PRAWO_PROCESOWE", label: "Prawo procesowe (KPC)" },
    { key: "PRAWO_GOSPODARCZE", label: "Prawo gospodarcze i handlowe" },
    { key: "PRAWO_PRACY", label: "Prawo pracy" },
    { key: "PRAWO_UPADLOSCIOWE", label: "Upadłość i restrukturyzacja" },
    { key: "PRAWO_PODATKOWE", label: "Prawo podatkowe" },
    { key: "PRAWO_BUDOWLANE", label: "Prawo budowlane i nieruchomości" },
    { key: "PRAWO_BANKOWE", label: "Prawo bankowe i usługi płatnicze" },
    { key: "OCHRONA_KONKURENCJI", label: "Ochrona konkurencji" },
    { key: "OCHRONA_DANYCH", label: "Ochrona danych (RODO)" },
    { key: "PRAWO_AUTORSKIE", label: "Własność intelektualna" },
    { key: "PRAWO_ZAMOWIEN", label: "Zamówienia publiczne" },
    { key: "PRAWO_KARNE_GOSPODARCZE", label: "Prawo karne gospodarcze" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Prawo polskie */}
      <div className="space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#172338] border-b border-[#E1E3E7] pb-2">
          Prawo polskie — {catalog.statutes.length} aktów
        </h3>
        {areas.map((area) => {
          const acts = catalog.statutes.filter((s) => s.legalAreas.includes(area.key));
          if (!acts.length) return null;
          return (
            <div key={area.key}>
              <h4 className="text-xs font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">
                {area.label}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {acts.map((a) => (
                  <ActCard
                    key={a.eli}
                    entry={a}
                    onOpen={() => {}}
                    onViewText={onViewText}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prawo UE */}
      <div>
        <h3 className="font-serif font-bold text-lg text-[#172338] border-b border-[#E1E3E7] pb-2 mb-4">
          Prawo Unii Europejskiej — {catalog.euLaw.length} aktów
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {catalog.euLaw.map((a) => (
            <EuActCard key={a.celexId} act={a} />
          ))}
        </div>
      </div>

      {/* TSUE */}
      <div>
        <h3 className="font-serif font-bold text-lg text-[#172338] border-b border-[#E1E3E7] pb-2 mb-4">
          Orzecznictwo TSUE — {catalog.cjeuJudgments.length} kluczowych wyroków
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {catalog.cjeuJudgments.map((j) => (
            <CjeuCard key={j.celexId} j={j} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SearchResultsView
// ──────────────────────────────────────────────────────────────────────────

function SearchResultsView({
  results,
  mode,
  onBack,
  onViewText,
}: {
  results: unknown;
  mode: SearchMode;
  onBack: () => void;
  onViewText: (eli: string, title: string) => void;
}) {
  const r = results as Record<string, unknown>;

  // Comprehensive result
  const snItems = (r["saosJudgments"] as { items?: SaosJudgment[] } | null)?.items ?? [];
  const snTotal = (r["saosJudgments"] as { totalResults?: number } | null)?.totalResults ?? 0;
  const euActItems = (r["euActs"] as EuLegalAct[] | null) ?? [];
  const cjeuItems = (r["cjeuJudgments"] as CjeuJudgment[] | null) ?? [];
  const polishActItems = (r["polishActs"] as IsapActMetadata[] | null) ?? [];

  // Direct judgment search
  const directItems = (r["items"] as SaosJudgment[] | null) ?? [];
  const directTotal = (r["totalResults"] as number | null) ?? 0;

  const isComprehensive = mode === "comprehensive" || mode === "eu";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-[#172338]">Wyniki wyszukiwania</h3>
        <button onClick={onBack} className="text-xs text-[#5F6774] hover:text-[#172338] font-mono">
          ← Katalog
        </button>
      </div>

      {isComprehensive ? (
        <>
          {polishActItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">
                Akty prawne ISAP ({polishActItems.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {polishActItems.map((a) => (
                  <div key={a.eli} className="border border-[#E1E3E7] rounded-lg p-3.5 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[#355CFF] text-xs">{a.eli}</span>
                      <StatusBadge status={a.inForce} />
                    </div>
                    <p className="text-[12px] text-[#172338] font-medium mb-2">{a.title}</p>
                    <button
                      onClick={() => onViewText(a.eli, a.eli)}
                      className="text-[11px] font-mono text-[#355CFF] hover:underline"
                    >
                      Tekst jednolity ↗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {snItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">
                Orzeczenia SN — Izba Cywilna (znaleziono {snTotal})
              </h4>
              <div className="space-y-2">
                {snItems.map((j) => <JudgmentCard key={j.saosId} j={j} />)}
              </div>
            </div>
          )}

          {euActItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">
                Prawo UE ({euActItems.length})
              </h4>
              <div className="space-y-2">
                {euActItems.map((a) => <EuActCard key={a.celexId} act={a} />)}
              </div>
            </div>
          )}

          {cjeuItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-[#5F6774] uppercase tracking-wider mb-2">
                Wyroki TSUE ({cjeuItems.length})
              </h4>
              <div className="space-y-2">
                {cjeuItems.map((j) => <CjeuCard key={j.celexId} j={j} />)}
              </div>
            </div>
          )}

          {snItems.length === 0 && euActItems.length === 0 && cjeuItems.length === 0 && polishActItems.length === 0 && (
            <p className="text-sm text-[#5F6774] text-center py-8">Brak wyników dla tego zapytania.</p>
          )}
        </>
      ) : (
        <div>
          <p className="text-xs font-mono text-[#5F6774] mb-3">
            Znaleziono: <strong className="text-[#172338]">{directTotal}</strong> orzeczeń
          </p>
          <div className="space-y-2">
            {directItems.map((j) => <JudgmentCard key={j.saosId} j={j} />)}
          </div>
          {directItems.length === 0 && (
            <p className="text-sm text-[#5F6774] text-center py-8">Brak wyników.</p>
          )}
        </div>
      )}
    </div>
  );
}
